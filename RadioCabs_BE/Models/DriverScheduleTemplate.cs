namespace RadioCabs_BE.Models
{
    public class DriverScheduleTemplate
    {
        public long TemplateId { get; set; }
        public long DriverAccountId { get; set; }
        public DateOnly StartDate { get; set; }
        public DateOnly EndDate { get; set; }
        public short Weekday { get; set; }
        public TimeOnly StartTime { get; set; }
        public TimeOnly EndTime { get; set; }
        public long? VehicleId { get; set; }
        public string? Note { get; set; }
        public bool IsActive { get; set; } = true;
    }
}
