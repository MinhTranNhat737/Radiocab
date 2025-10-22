using Microsoft.EntityFrameworkCore;
using RadioCabs_BE.Data;
using RadioCabs_BE.DTOs;
using RadioCabs_BE.Models;
using RadioCabs_BE.Repositories.Interfaces;
using RadioCabs_BE.Services.Interfaces;
using Npgsql;

namespace RadioCabs_BE.Services
{
    public class DriverScheduleService : IDriverScheduleService
    {
        private readonly IDriverScheduleRepository _scheduleRepo;
        private readonly IDriverScheduleTemplateRepository _templateRepo;
        private readonly RadiocabsDbContext _db;
        private readonly IUnitOfWork _uow;

        public DriverScheduleService(
            IDriverScheduleRepository scheduleRepo,
            IDriverScheduleTemplateRepository templateRepo,
            RadiocabsDbContext db,
            IUnitOfWork uow)
        {
            _scheduleRepo = scheduleRepo;
            _templateRepo = templateRepo;
            _db = db;
            _uow = uow;
        }

        // Template Management
        public async Task<DriverScheduleTemplate> CreateTemplateAsync(CreateDriverScheduleTemplateDto dto, CancellationToken ct = default)
        {
            var template = new DriverScheduleTemplate
            {
                DriverAccountId = dto.DriverAccountId,
                StartDate = dto.StartDate,
                EndDate = dto.EndDate,
                Weekday = dto.Weekday,
                StartTime = dto.StartTime,
                EndTime = dto.EndTime,
                VehicleId = dto.VehicleId,
                Note = dto.Note,
                IsActive = true
            };

            await _templateRepo.AddAsync(template, ct);
            await _uow.SaveChangesAsync(ct);
            return template;
        }

        public async Task<bool> UpdateTemplateAsync(long templateId, UpdateDriverScheduleTemplateDto dto, CancellationToken ct = default)
        {
            var template = await _templateRepo.GetByIdAsync(templateId, ct);
            if (template == null) return false;

            if (dto.StartDate.HasValue)
                template.StartDate = dto.StartDate.Value;
            if (dto.EndDate.HasValue)
                template.EndDate = dto.EndDate.Value;
            if (dto.StartTime.HasValue)
                template.StartTime = dto.StartTime.Value;
            if (dto.EndTime.HasValue)
                template.EndTime = dto.EndTime.Value;
            if (dto.VehicleId.HasValue)
                template.VehicleId = dto.VehicleId.Value;
            if (dto.IsActive.HasValue)
                template.IsActive = dto.IsActive.Value;
            if (!string.IsNullOrEmpty(dto.Note))
                template.Note = dto.Note;

            _templateRepo.Update(template);
            return await _uow.SaveChangesAsync(ct) > 0;
        }

        public async Task<IReadOnlyList<DriverScheduleTemplate>> ListTemplatesByDriverAsync(long driverAccountId, CancellationToken ct = default)
            => await _templateRepo.ListByDriverAsync(driverAccountId, ct);

        // Schedule Management
        public async Task<DriverSchedule> CreateScheduleAsync(CreateDriverScheduleDto dto, CancellationToken ct = default)
        {
            var schedule = new DriverSchedule
            {
                DriverAccountId = dto.DriverAccountId,
                WorkDate = dto.WorkDate,
                StartTime = dto.StartTime,
                EndTime = dto.EndTime,
                VehicleId = dto.VehicleId,
                Status = dto.Status,
                Note = dto.Note,
                CreatedAt = DateTimeOffset.Now
            };

            await _scheduleRepo.AddAsync(schedule, ct);
            await _uow.SaveChangesAsync(ct);
            return schedule;
        }

        public async Task<bool> UpdateScheduleAsync(long scheduleId, UpdateDriverScheduleDto dto, CancellationToken ct = default)
        {
            var schedule = await _scheduleRepo.GetByIdAsync(scheduleId, ct);
            if (schedule == null) return false;

            if (dto.StartTime.HasValue)
                schedule.StartTime = dto.StartTime.Value;
            if (dto.EndTime.HasValue)
                schedule.EndTime = dto.EndTime.Value;
            if (dto.VehicleId.HasValue)
                schedule.VehicleId = dto.VehicleId.Value;
            if (dto.Status.HasValue)
                schedule.Status = dto.Status.Value;
            if (!string.IsNullOrEmpty(dto.Note))
                schedule.Note = dto.Note;

            schedule.UpdatedAt = DateTimeOffset.Now;

            _scheduleRepo.Update(schedule);
            return await _uow.SaveChangesAsync(ct) > 0;
        }

        public async Task<IReadOnlyList<DriverSchedule>> ListByDriverAsync(long driverAccountId, DateOnly? workDate, CancellationToken ct = default)
            => await _scheduleRepo.ListByDriverAsync(driverAccountId, workDate, ct);

        public async Task<IReadOnlyList<DriverSchedule>> ListByDriverAsync(long driverAccountId, DateOnly from, DateOnly to, CancellationToken ct = default)
            => await _scheduleRepo.ListByDateRangeAsync(from, to, ct);

        public async Task<IReadOnlyList<DriverSchedule>> ListByStatusAsync(ShiftStatus status, CancellationToken ct = default)
            => await _scheduleRepo.ListByStatusAsync(status, ct);

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