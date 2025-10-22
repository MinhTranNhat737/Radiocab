namespace RadioCabs_BE.Models
{
    public class ZoneWard
    {
        public long ZoneId { get; set; }
        public long WardId { get; set; }

        // Navigation properties
        public Zone Zone { get; set; } = null!;
        public Ward Ward { get; set; } = null!;
    }
}
