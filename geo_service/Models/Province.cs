namespace geo_service.Models
{
    public class Province
    {
        public long ProvinceId { get; set; }
        public string? Code { get; set; }
        public string Name { get; set; } = null!;

        public ICollection<Ward> Wards { get; set; } = new List<Ward>();
    }
}
