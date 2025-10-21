namespace RadioCabs_BE.Models
{
    public class Province
    {
        public long ProvinceId { get; set; }
        public string? Code { get; set; }
        public string Name { get; set; } = null!;
    }
}
