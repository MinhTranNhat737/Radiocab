using Microsoft.EntityFrameworkCore;
using RadioCabs_BE.Data;
using RadioCabs_BE.Models;
using RadioCabs_BE.Repositories.Interfaces;

namespace RadioCabs_BE.Repositories.Implementations
{
    public class DriverScheduleRepository : GenericRepository<DriverSchedule>, IDriverScheduleRepository
    {
        public DriverScheduleRepository(RadiocabsDbContext context) : base(context) { }

        public async Task<IReadOnlyList<DriverSchedule>> ListByDriverAsync(long driverAccountId, DateOnly? workDate = null, CancellationToken ct = default)
        {
            var query = _context.DriverSchedules
                .AsNoTracking()
                .Where(x => x.DriverAccountId == driverAccountId);

            if (workDate.HasValue)
                query = query.Where(x => x.WorkDate == workDate.Value);

            return await query
                .OrderBy(x => x.WorkDate)
                .ThenBy(x => x.StartTime)
                .ToListAsync(ct);
        }

        public async Task<IReadOnlyList<DriverSchedule>> ListByDateRangeAsync(DateOnly fromDate, DateOnly toDate, CancellationToken ct = default)
            => await _context.DriverSchedules
                .AsNoTracking()
                .Where(x => x.WorkDate >= fromDate && x.WorkDate <= toDate)
                .OrderBy(x => x.WorkDate)
                .ThenBy(x => x.StartTime)
                .ToListAsync(ct);

        public async Task<IReadOnlyList<DriverSchedule>> ListByStatusAsync(ShiftStatus status, CancellationToken ct = default)
            => await _context.DriverSchedules
                .AsNoTracking()
                .Where(x => x.Status == status)
                .OrderBy(x => x.WorkDate)
                .ThenBy(x => x.StartTime)
                .ToListAsync(ct);

        public async Task<DriverSchedule?> GetByDriverAndDateTimeAsync(long driverAccountId, DateOnly workDate, TimeOnly startTime, TimeOnly endTime, CancellationToken ct = default)
            => await _context.DriverSchedules
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.DriverAccountId == driverAccountId 
                                       && x.WorkDate == workDate 
                                       && x.StartTime == startTime 
                                       && x.EndTime == endTime, ct);
    }

    public class DriverScheduleTemplateRepository : GenericRepository<DriverScheduleTemplate>, IDriverScheduleTemplateRepository
    {
        public DriverScheduleTemplateRepository(RadiocabsDbContext context) : base(context) { }

        public async Task<IReadOnlyList<DriverScheduleTemplate>> ListByDriverAsync(long driverAccountId, CancellationToken ct = default)
            => await _context.DriverScheduleTemplates
                .AsNoTracking()
                .Where(x => x.DriverAccountId == driverAccountId)
                .OrderBy(x => x.Weekday)
                .ThenBy(x => x.StartTime)
                .ToListAsync(ct);

        public async Task<IReadOnlyList<DriverScheduleTemplate>> ListActiveByDriverAsync(long driverAccountId, CancellationToken ct = default)
            => await _context.DriverScheduleTemplates
                .AsNoTracking()
                .Where(x => x.DriverAccountId == driverAccountId && x.IsActive)
                .OrderBy(x => x.Weekday)
                .ThenBy(x => x.StartTime)
                .ToListAsync(ct);

        public async Task<IReadOnlyList<DriverScheduleTemplate>> ListByWeekdayAsync(short weekday, CancellationToken ct = default)
            => await _context.DriverScheduleTemplates
                .AsNoTracking()
                .Where(x => x.Weekday == weekday && x.IsActive)
                .OrderBy(x => x.StartTime)
                .ToListAsync(ct);
    }
}
