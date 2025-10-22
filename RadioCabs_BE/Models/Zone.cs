namespace RadioCabs_BE.Models
{
    public class Zone
    {
        public long ZoneId { get; set; }
        public long CompanyId { get; set; }
        public long ProvinceId { get; set; }
        public string Code { get; set; } = null!;
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public bool IsActive { get; set; } = true;

        // Navigation properties
        public Company Company { get; set; } = null!;
        public Province Province { get; set; } = null!;
        public ICollection<ZoneWard> ZoneWards { get; set; } = new List<ZoneWard>();
        public ICollection<VehicleZonePreference> VehicleZonePreferences { get; set; } = new List<VehicleZonePreference>();
    }
}
