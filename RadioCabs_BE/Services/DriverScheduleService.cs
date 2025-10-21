using Microsoft.EntityFrameworkCore;
using RadioCabs_BE.Models;
using RadioCabs_BE.Repositories;      // IGenericRepository<DriverSchedule>
using RadioCabs_BE.Services.Interfaces;
using RadioCabs_BE.Data;
using Npgsql;

namespace RadioCabs_BE.Services
{
    public class DriverScheduleService : IDriverScheduleService
    {
        private readonly IGenericRepository<DriverSchedule> _repo;
        private readonly RadiocabsDbContext _db;

        public DriverScheduleService(
            IGenericRepository<DriverSchedule> repo,
            RadiocabsDbContext db)
        {
            _repo = repo;
            _db = db;
        }

        // Chuẩn chữ ký theo interface
        public Task<IReadOnlyList<DriverSchedule>> ListByDriverAsync(
            long driverAccountId, DateOnly from, DateOnly to, CancellationToken ct = default)
            => ListByDriverAndDateAsync(driverAccountId, from, to, ct);

        // Triển khai truy vấn trực tiếp EF (không cần repo riêng)
        public async Task<IReadOnlyList<DriverSchedule>> ListByDriverAndDateAsync(
            long driverAccountId, DateOnly from, DateOnly to, CancellationToken ct = default)
        {
            return await _db.DriverSchedules
                .AsNoTracking()
                .Where(s => s.DriverAccountId == driverAccountId
                         && s.WorkDate >= from
                         && s.WorkDate <= to)
                .OrderBy(s => s.WorkDate).ThenBy(s => s.StartTime)
                .ToListAsync(ct);
        }

        public async Task<int> SeedMonthFromTemplateAsync(int year, int month, CancellationToken ct = default)
        {
            await using var conn = _db.Database.GetDbConnection();
            await conn.OpenAsync(ct);
            await using var cmd = conn.CreateCommand();
            cmd.CommandText = "SELECT public.seed_driver_schedule_for_month(@y, @m)";
            cmd.Parameters.Add(new NpgsqlParameter("y", year));
            cmd.Parameters.Add(new NpgsqlParameter("m", month));
            var result = await cmd.ExecuteScalarAsync(ct);
            return Convert.ToInt32(result);
        }
    }
}
