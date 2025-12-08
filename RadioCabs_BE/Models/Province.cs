namespace RadioCabs_BE.Models
{
    public class Province
    {
        public long ProvinceId { get; set; }
        public string? Code { get; set; }
        public string Name { get; set; } = null!;

        // Navigation properties
        public ICollection<Ward> Wards { get; set; } = new List<Ward>();
        public ICollection<Zone> Zones { get; set; } = new List<Zone>();
        public ICollection<ModelPriceProvince> ModelPriceProvinces { get; set; } = new List<ModelPriceProvince>();
        public ICollection<VehicleInProvince> VehicleInProvinces { get; set; } = new List<VehicleInProvince>();
        public ICollection<DrivingOrder> FromDrivingOrders { get; set; } = new List<DrivingOrder>();
        public ICollection<DrivingOrder> ToDrivingOrders { get; set; } = new List<DrivingOrder>();
    }
}
