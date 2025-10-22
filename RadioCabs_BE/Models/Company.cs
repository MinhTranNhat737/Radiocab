namespace RadioCabs_BE.Models
{
    public class Company
    {
        public long CompanyId { get; set; }
        public string Name { get; set; } = null!;
        public string Hotline { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Address { get; set; } = null!;
        public string TaxCode { get; set; } = null!;
        public string Status { get; set; } = "ACTIVE";
        public long? ContactAccountId { get; set; }
        public DateTimeOffset CreatedAt { get; set; }
        public DateTimeOffset? UpdatedAt { get; set; }
        public string Fax { get; set; } = string.Empty;

        // Navigation properties
        public Account? ContactAccount { get; set; }
        public ICollection<Account> Accounts { get; set; } = new List<Account>();
        public ICollection<VehicleSegment> VehicleSegments { get; set; } = new List<VehicleSegment>();
        public ICollection<VehicleModel> VehicleModels { get; set; } = new List<VehicleModel>();
        public ICollection<Vehicle> Vehicles { get; set; } = new List<Vehicle>();
        public ICollection<Zone> Zones { get; set; } = new List<Zone>();
        public ICollection<ModelPriceProvince> ModelPriceProvinces { get; set; } = new List<ModelPriceProvince>();
        public ICollection<MembershipOrder> MembershipOrders { get; set; } = new List<MembershipOrder>();
        public ICollection<DrivingOrder> DrivingOrders { get; set; } = new List<DrivingOrder>();
    }
}
