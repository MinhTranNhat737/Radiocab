namespace RadioCabs_BE.Models
{
    public class DriverVehicleAssignment
    {
        public long AssignmentId { get; set; }
        public long DriverAccountId { get; set; }
        public long VehicleId { get; set; }
        public DateTimeOffset StartAt { get; set; }
        public DateTimeOffset? EndAt { get; set; }

        // Navigation properties
        public Account Driver { get; set; } = null!;
        public Vehicle Vehicle { get; set; } = null!;
    }
}
