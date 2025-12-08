namespace vehicle_service.Models
{
    public class VehicleInProvince
    {
        public long VehicleId { get; set; }
        public long ProvinceId { get; set; }
        public bool Allowed { get; set; } = true;
        public DateOnly? SinceDate { get; set; }

        // Navigation properties
        public Vehicle Vehicle { get; set; } = null!;
    }
}
