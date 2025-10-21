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

        // Navs
        public Company Company { get; set; } = null!;
        public Province Province { get; set; } = null!;

        // (tuỳ chọn) tập con liên quan
        public ICollection<ZoneWard>? ZoneWards { get; set; }
        public ICollection<VehicleZonePreference>? VehicleZonePreferences { get; set; }
    }
}
