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
    }
}
