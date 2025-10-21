namespace RadioCabs_BE.Models
{
    public class VehicleInProvince
    {
        public long VehicleId { get; set; }
        public long ProvinceId { get; set; }
        public bool Allowed { get; set; } = true;
        public DateOnly? SinceDate { get; set; }

        // Navs
        public Vehicle Vehicle { get; set; } = null!;
        public Province Province { get; set; } = null!;
    }
}
