namespace RadioCabs_BE.Models
{
    public class VehicleModel
    {
        public long ModelId { get; set; }
        public long CompanyId { get; set; }
        public long? SegmentId { get; set; }
        public string Brand { get; set; } = null!;
        public string ModelName { get; set; } = null!;
        public string FuelType { get; set; } = "GASOLINE";
        public string SeatCategory { get; set; } = "SEDAN_5";
        public string? ImageUrl { get; set; }
        public string? Description { get; set; }
        public bool IsActive { get; set; } = true;

        // Navigation properties
        public Company Company { get; set; } = null!;
        public VehicleSegment? Segment { get; set; }
        public ICollection<Vehicle> Vehicles { get; set; } = new List<Vehicle>();
        public ICollection<ModelPriceProvince> ModelPriceProvinces { get; set; } = new List<ModelPriceProvince>();
        public ICollection<DrivingOrder> DrivingOrders { get; set; } = new List<DrivingOrder>();
    }
}
