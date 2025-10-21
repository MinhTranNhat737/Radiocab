namespace RadioCabs_BE.Models
{
    public class VehicleSegment
    {
        public long SegmentId { get; set; }
        public long CompanyId { get; set; }
        public string Code { get; set; } = null!;
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public bool IsActive { get; set; } = true;
    }

}
