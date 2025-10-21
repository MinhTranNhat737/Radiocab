using RadioCabs_BE.Models;

namespace RadioCabs_BE.Services.Interfaces
{
    public interface IDriverScheduleService
    {
        Task<IReadOnlyList<DriverSchedule>> ListByDriverAsync(long driverId, DateOnly from, DateOnly to, CancellationToken ct = default);

        /// <summary>Gọi hàm Postgres seed_driver_schedule_for_month(y, m).</summary>
        Task<int> SeedMonthFromTemplateAsync(int year, int month, CancellationToken ct = default);
    }
}
