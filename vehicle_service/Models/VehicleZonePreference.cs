namespace vehicle_service.Models
{
    public class VehicleZonePreference
    {
        public long VehicleId { get; set; }
        public long ZoneId { get; set; }
        public short Priority { get; set; } = 100;

        // Navigation properties
        public Vehicle Vehicle { get; set; } = null!;
    }
}
