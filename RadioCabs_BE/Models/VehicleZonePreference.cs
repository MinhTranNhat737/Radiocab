namespace RadioCabs_BE.Models
{
    public class VehicleZonePreference
    {
        public long VehicleId { get; set; }
        public long ZoneId { get; set; }
        public short Priority { get; set; } = 100;

        // Navigation properties
        public Vehicle Vehicle { get; set; } = null!;
        public Zone Zone { get; set; } = null!;
    }
}
