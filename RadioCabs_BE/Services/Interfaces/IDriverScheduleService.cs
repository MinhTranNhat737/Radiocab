using RadioCabs_BE.Models;

namespace RadioCabs_BE.Services.Interfaces
{
    public interface IDriverScheduleService
    {
        // Lấy lịch theo khoảng ngày (bắt buộc: from, to)
        Task<IReadOnlyList<DriverSchedule>> ListByDriverAsync(
            long driverId, DateOnly from, DateOnly to, CancellationToken ct = default);

        /// <summary>Gọi hàm Postgres seed_driver_schedule_for_month(y, m).</summary>
        Task<int> SeedMonthFromTemplateAsync(int year, int month, CancellationToken ct = default);

        // (Giữ lại nếu bạn muốn, chữ ký trùng logic với ListByDriverAsync)
        Task<IReadOnlyList<DriverSchedule>> ListByDriverAndDateAsync(
            long driverAccountId, DateOnly from, DateOnly to, CancellationToken ct = default);
    }
}
