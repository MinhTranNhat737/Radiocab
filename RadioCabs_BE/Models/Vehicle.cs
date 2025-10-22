namespace RadioCabs_BE.Models
{
    public class Vehicle
    {
        public long VehicleId { get; set; }
        public long CompanyId { get; set; }
        public long ModelId { get; set; }
        public string PlateNumber { get; set; } = null!;
        public string? Vin { get; set; }
        public string? Color { get; set; }
        public short? YearManufactured { get; set; }
        public DateOnly InServiceFrom { get; set; }
        public int OdometerKm { get; set; } = 0;
        public string Status { get; set; } = "ACTIVE";

        // Navigation properties
        public Company Company { get; set; } = null!;
        public VehicleModel Model { get; set; } = null!;
        public ICollection<DriverVehicleAssignment> DriverVehicleAssignments { get; set; } = new List<DriverVehicleAssignment>();
        public ICollection<DriverSchedule> DriverSchedules { get; set; } = new List<DriverSchedule>();
        public ICollection<DriverScheduleTemplate> DriverScheduleTemplates { get; set; } = new List<DriverScheduleTemplate>();
        public ICollection<VehicleInProvince> VehicleInProvinces { get; set; } = new List<VehicleInProvince>();
        public ICollection<VehicleZonePreference> VehicleZonePreferences { get; set; } = new List<VehicleZonePreference>();
        public ICollection<DrivingOrder> DrivingOrders { get; set; } = new List<DrivingOrder>();
    }
}
