using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using RadioCabs_BE.Data;
using RadioCabs_BE.Models;

namespace RadioCabs_BE.Services.Background
{
    public class DriverScheduleStatusUpdater : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly ILogger<DriverScheduleStatusUpdater> _logger;
        private readonly TimeSpan _interval = TimeSpan.FromMinutes(1);

        public DriverScheduleStatusUpdater(IServiceScopeFactory scopeFactory, ILogger<DriverScheduleStatusUpdater> logger)
        {
            _scopeFactory = scopeFactory;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("DriverScheduleStatusUpdater started (every {Minutes} minute).", _interval.TotalMinutes);
            while (!stoppingToken.IsCancellationRequested)
            {
                try { await UpdateStatusesAsync(stoppingToken); }
                catch (Exception ex) { _logger.LogError(ex, "Error updating driver schedules"); }

                try { await Task.Delay(_interval, stoppingToken); } catch { }
            }
        }

        private async Task UpdateStatusesAsync(CancellationToken ct)
        {
            using var scope = _scopeFactory.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<RadiocabsDbContext>();

            var now = DateTime.Now; // use local time to match business hours
            var today = DateOnly.FromDateTime(now.Date);
            var nowTime = TimeOnly.FromDateTime(now);

            // Only today's schedules; ignore OFF and CANCELLED
            var schedules = await db.DriverSchedules
                .Where(ds => ds.WorkDate == today && ds.Status != ShiftStatus.OFF && ds.Status != ShiftStatus.CANCELLED)
                .ToListAsync(ct);

            int changed = 0;
            foreach (var ds in schedules)
            {
                var before = ds.Status;
                ShiftStatus next;
                if (nowTime < ds.StartTime) next = ShiftStatus.PLANNED;
                else if (nowTime >= ds.StartTime && nowTime < ds.EndTime) next = ShiftStatus.ON;
                else next = ShiftStatus.COMPLETED;

                if (next != before)
                {
                    ds.Status = next;
                    ds.UpdatedAt = DateTimeOffset.UtcNow;
                    changed++;
                }
            }

            if (changed > 0)
            {
                await db.SaveChangesAsync(ct);
                _logger.LogInformation("DriverScheduleStatusUpdater updated {Count} schedules.", changed);
            }
        }
    }
}


