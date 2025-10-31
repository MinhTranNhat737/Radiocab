using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;
using RadioCabs_BE.Repositories;
using RadioCabs_BE.Models;

namespace RadioCabs_BE.Services.Background
{
    public class MembershipStatusUpdater : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly ILogger<MembershipStatusUpdater> _logger;
        private readonly IConfiguration _configuration;

        public MembershipStatusUpdater(IServiceScopeFactory scopeFactory, ILogger<MembershipStatusUpdater> logger, IConfiguration configuration)
        {
            _scopeFactory = scopeFactory;
            _logger = logger;
            _configuration = configuration;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            var intervalMinutes = _configuration.GetValue<int?>("MembershipStatusChecker:IntervalMinutes") ?? 60;
            var delay = TimeSpan.FromMinutes(Math.Max(1, intervalMinutes));

            _logger.LogInformation("MembershipStatusUpdater started. Interval: {Minutes} minutes", delay.TotalMinutes);

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    await RunOnce(stoppingToken);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "MembershipStatusUpdater run failed: {Message}", ex.Message);
                }

                try
                {
                    await Task.Delay(delay, stoppingToken);
                }
                catch (TaskCanceledException)
                {
                    // ignore on shutdown
                }
            }
        }

        private async Task RunOnce(CancellationToken ct)
        {
            using var scope = _scopeFactory.CreateScope();
            var unitOfWork = scope.ServiceProvider.GetRequiredService<IUnitOfWork>();

            var today = DateOnly.FromDateTime(DateTime.UtcNow.Date);

            // Load all companies
            var companyRepo = unitOfWork.Repository<Company>();
            var companies = companyRepo.Query().ToList();
            _logger.LogInformation("Checking membership status for {Count} companies", companies.Count);

            foreach (var company in companies)
            {
                if (ct.IsCancellationRequested) break;

                // Skip refused and new companies (pending approval). APPROVE/ACTIVE/INACTIVE are managed by membership
                if (company.Status == ActiveFlag.REFUSED || company.Status == ActiveFlag.NEW)
                {
                    continue;
                }

                var ordersQuery = unitOfWork.Repository<MembershipOrder>().Query()
                    .Where(o => o.CompanyId == company.CompanyId && o.PaidAt != null);

                var hasActiveMembership = ordersQuery.Any(o => o.StartDate <= today && o.EndDate >= today);

                var desired = hasActiveMembership ? ActiveFlag.ACTIVE : ActiveFlag.INACTIVE;
                if (company.Status != desired)
                {
                    company.Status = desired;
                    company.UpdatedAt = DateTimeOffset.UtcNow;
                    companyRepo.Update(company);
                }
            }

            await unitOfWork.SaveChangesAsync();
        }
    }
}
