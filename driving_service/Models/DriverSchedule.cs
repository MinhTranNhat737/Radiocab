using System.ComponentModel.DataAnnotations.Schema;
using common.Models;

namespace driving_service.Models
{
    public class DriverSchedule
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long ScheduleId { get; set; }
        public long DriverAccountId { get; set; }
        public DateOnly WorkDate { get; set; }
        public TimeOnly StartTime { get; set; }
        public TimeOnly EndTime { get; set; }
        public long? VehicleId { get; set; }
        public ShiftStatus Status { get; set; } = ShiftStatus.PLANNED;
        public string? Note { get; set; }
        public DateTimeOffset CreatedAt { get; set; }
        public DateTimeOffset? UpdatedAt { get; set; }

        // Navigation properties
    }
}
