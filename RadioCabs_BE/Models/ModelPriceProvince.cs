using Microsoft.EntityFrameworkCore;

namespace RadioCabs_BE.Models
{
    public class ModelPriceProvince
    {
        public long ModelPriceId { get; set; }
        public long CompanyId { get; set; }
        public long ProvinceId { get; set; }
        public long ModelId { get; set; }

        [Precision(12, 2)] public decimal OpeningFare { get; set; }
        [Precision(12, 2)] public decimal RateFirst20Km { get; set; }
        [Precision(12, 2)] public decimal RateOver20Km { get; set; }
        [Precision(12, 2)] public decimal TrafficAddPerKm { get; set; } = 0;
        [Precision(12, 2)] public decimal RainAddPerTrip { get; set; } = 0;
        [Precision(12, 2)] public decimal IntercityRatePerKm { get; set; } = 0;

        public TimeOnly? TimeStart { get; set; }
        public TimeOnly? TimeEnd { get; set; }
        public long? ParentId { get; set; }
        public DateOnly DateStart { get; set; }
        public DateOnly DateEnd { get; set; }
        public bool IsActive { get; set; } = true;
        public string? Note { get; set; }

        // Navigation properties
        public Company Company { get; set; } = null!;
        public Province Province { get; set; } = null!;
        public VehicleModel Model { get; set; } = null!;
        public ModelPriceProvince? Parent { get; set; }
        public ICollection<ModelPriceProvince> Children { get; set; } = new List<ModelPriceProvince>();
        public ICollection<DrivingOrder> DrivingOrders { get; set; } = new List<DrivingOrder>();
    }
}
