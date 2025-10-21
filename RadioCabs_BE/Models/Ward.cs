namespace RadioCabs_BE.Models
{
    public class Ward
    {
        public long WardId { get; set; }
        public long ProvinceId { get; set; }
        public string? Code { get; set; }
        public string Name { get; set; } = null!;

        // Nav
        public Province Province { get; set; } = null!;

        // (tuỳ chọn)
        public ICollection<ZoneWard>? ZoneWards { get; set; }
    }
}
