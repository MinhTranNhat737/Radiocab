// Services/DriverScheduleService.cs (không có repo riêng)
using Microsoft.EntityFrameworkCore;
using RadioCabs_BE.Models;
using RadioCabs_BE.Repositories;  // IGenericRepository<DriverSchedule>
using RadioCabs_BE.Services.Interfaces;
using Radiocabs_BE.Data;
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
            _repo = repo; _db = db;
        }

        public async Task<IReadOnlyList<DriverSchedule>> ListByDriverAsync(
            long driverId, DateOnly from, DateOnly to, CancellationToken ct = default)
        {
            // lấy DbSet từ Generic
            var set = _db.Set<DriverSchedule>();

            return await set.AsNoTracking()
                .Where(x => x.DriverAccountId == driverId
                         && x.WorkDate >= from && x.WorkDate <= to)
                .OrderBy(x => x.WorkDate).ThenBy(x => x.StartTime)
                .ToListAsync(ct);
        }

        public async Task<int> SeedMonthFromTemplateAsync(int year, int month, CancellationToken ct = default)
        {
            var conn = _db.Database.GetDbConnection();
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
