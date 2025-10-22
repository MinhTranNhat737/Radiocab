using Microsoft.EntityFrameworkCore;

namespace RadioCabs_BE.Models
{
    public class DrivingOrder
    {
        public long OrderId { get; set; }
        public long CompanyId { get; set; }
        public long? CustomerAccountId { get; set; }
        public long? VehicleId { get; set; }
        public long? DriverAccountId { get; set; }
        public long ModelId { get; set; }
        public long? PriceRefId { get; set; }
        public long FromProvinceId { get; set; }
        public long ToProvinceId { get; set; }

        public string? PickupAddress { get; set; }
        public string? DropoffAddress { get; set; }
        public DateTimeOffset? PickupTime { get; set; }
        public DateTimeOffset? DropoffTime { get; set; }

        public string Status { get; set; } = "NEW";

        [Precision(9, 2)] public decimal TotalKm { get; set; }
        [Precision(9, 2)] public decimal InnerCityKm { get; set; } = 0;
        [Precision(9, 2)] public decimal IntercityKm { get; set; } = 0;
        [Precision(9, 2)] public decimal TrafficKm { get; set; } = 0;

        public bool IsRaining { get; set; } = false;
        public int WaitMinutes { get; set; } = 0;

        [Precision(14, 2)] public decimal BaseFare { get; set; }
        [Precision(12, 2)] public decimal TrafficUnitPrice { get; set; } = 0;
        [Precision(14, 2)] public decimal TrafficFee { get; set; } = 0;
        [Precision(14, 2)] public decimal RainFee { get; set; } = 0;
        [Precision(12, 2)] public decimal IntercityUnitPrice { get; set; } = 0;
        [Precision(14, 2)] public decimal IntercityFee { get; set; } = 0;
        [Precision(14, 2)] public decimal OtherFee { get; set; } = 0;
        [Precision(14, 2)] public decimal TotalAmount { get; set; }

        public string? FareBreakdown { get; set; }

        public string? PaymentMethod { get; set; }
        public DateTimeOffset? PaidAt { get; set; }

        public DateTimeOffset CreatedAt { get; set; }
        public DateTimeOffset? UpdatedAt { get; set; }

        // Navigation properties
        public Company Company { get; set; } = null!;
        public Account? Customer { get; set; }
        public Account? Driver { get; set; }
        public Vehicle? Vehicle { get; set; }
        public VehicleModel Model { get; set; } = null!;
        public ModelPriceProvince? PriceRef { get; set; }
        public Province FromProvince { get; set; } = null!;
        public Province ToProvince { get; set; } = null!;
    }
}
