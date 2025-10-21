namespace RadioCabs_BE.Models
{
    public class ModelPriceProvince
    {
        public long ModelPriceId { get; set; }
        public long CompanyId { get; set; }
        public long ProvinceId { get; set; }
        public long ModelId { get; set; }
        public decimal OpeningFare { get; set; }
        public decimal RateFirst20Km { get; set; }
        public decimal RateOver20Km { get; set; }
        public decimal TrafficAddPerKm { get; set; } = 0;
        public decimal RainAddPerTrip { get; set; } = 0;
        public decimal IntercityRatePerKm { get; set; } = 0;
        public TimeOnly? TimeStart { get; set; }
        public TimeOnly? TimeEnd { get; set; }
        public long? ParentId { get; set; }
        public DateOnly DateStart { get; set; }
        public DateOnly DateEnd { get; set; }
        public bool IsActive { get; set; } = true;
        public string? Note { get; set; }
    }
}
