using Microsoft.EntityFrameworkCore;

namespace RadioCabs_BE.Models
{
    [Keyless]
    public class VehicleModelWithSeats
    {
        public long ModelId { get; set; }
        public long CompanyId { get; set; }
        public long? SegmentId { get; set; }
        public string Brand { get; set; } = null!;
        public string ModelName { get; set; } = null!;
        public FuelType FuelType { get; set; }
        public VehicleCategory SeatCategory { get; set; }
        public string? ImageUrl { get; set; }
        public string? Description { get; set; }
        public bool IsActive { get; set; }
        public int? Seats { get; set; }
    }
}
