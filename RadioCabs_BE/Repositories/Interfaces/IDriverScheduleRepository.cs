using RadioCabs_BE.Models;

namespace RadioCabs_BE.Repositories.Interfaces
{
    public interface IDriverScheduleRepository : IGenericRepository<DriverSchedule>
    {
        Task<IReadOnlyList<DriverSchedule>> ListByDriverAsync(long driverAccountId, DateOnly? workDate = null, CancellationToken ct = default);
        Task<IReadOnlyList<DriverSchedule>> ListByDateRangeAsync(DateOnly fromDate, DateOnly toDate, CancellationToken ct = default);
        Task<IReadOnlyList<DriverSchedule>> ListByStatusAsync(ShiftStatus status, CancellationToken ct = default);
        Task<DriverSchedule?> GetByDriverAndDateTimeAsync(long driverAccountId, DateOnly workDate, TimeOnly startTime, TimeOnly endTime, CancellationToken ct = default);
    }

    public interface IDriverScheduleTemplateRepository : IGenericRepository<DriverScheduleTemplate>
    {
        Task<IReadOnlyList<DriverScheduleTemplate>> ListByDriverAsync(long driverAccountId, CancellationToken ct = default);
        Task<IReadOnlyList<DriverScheduleTemplate>> ListActiveByDriverAsync(long driverAccountId, CancellationToken ct = default);
        Task<IReadOnlyList<DriverScheduleTemplate>> ListByWeekdayAsync(short weekday, CancellationToken ct = default);
    }
}
