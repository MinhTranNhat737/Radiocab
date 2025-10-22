using System.ComponentModel.DataAnnotations;
using RadioCabs_BE.Models;

namespace RadioCabs_BE.DTOs
{
    public class CreateDriverScheduleTemplateDto
    {
        [Required] public long DriverAccountId { get; set; }
        [Required] public DateOnly StartDate { get; set; }
        [Required] public DateOnly EndDate { get; set; }
        [Required, Range(0, 6)] public short Weekday { get; set; }
        [Required] public TimeOnly StartTime { get; set; }
        [Required] public TimeOnly EndTime { get; set; }
        public long? VehicleId { get; set; }
        [MaxLength(200)] public string? Note { get; set; }
    }

    public class UpdateDriverScheduleTemplateDto
    {
        public DateOnly? StartDate { get; set; }
        public DateOnly? EndDate { get; set; }
        public TimeOnly? StartTime { get; set; }
        public TimeOnly? EndTime { get; set; }
        public long? VehicleId { get; set; }
        public bool? IsActive { get; set; }
        [MaxLength(200)] public string? Note { get; set; }
    }

    public class CreateDriverScheduleDto
    {
        [Required] public long DriverAccountId { get; set; }
        [Required] public DateOnly WorkDate { get; set; }
        [Required] public TimeOnly StartTime { get; set; }
        [Required] public TimeOnly EndTime { get; set; }
        public long? VehicleId { get; set; }
        public ShiftStatus Status { get; set; } = ShiftStatus.PLANNED;
        [MaxLength(200)] public string? Note { get; set; }
    }

    public class UpdateDriverScheduleDto
    {
        public TimeOnly? StartTime { get; set; }
        public TimeOnly? EndTime { get; set; }
        public long? VehicleId { get; set; }
        public ShiftStatus? Status { get; set; }
        [MaxLength(200)] public string? Note { get; set; }
    }

    public class SeedDriverScheduleDto
    {
        [Required] public int Year { get; set; }
        [Required, Range(1, 12)] public int Month { get; set; }
    }
}
