namespace RadioCabs_BE.Models
{
    public class DriverVehicleAssignment
    {
        public long AssignmentId { get; set; }
        public long DriverAccountId { get; set; }
        public long VehicleId { get; set; }
        public DateTimeOffset StartAt { get; set; }
        public DateTimeOffset? EndAt { get; set; }
    }
}
