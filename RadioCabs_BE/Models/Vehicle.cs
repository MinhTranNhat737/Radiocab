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
        public ActiveFlag Status { get; set; } = ActiveFlag.ACTIVE;

        // Navs
        public Company Company { get; set; } = null!;
        public VehicleModel Model { get; set; } = null!;

        // (tuỳ chọn) quan hệ ngược
        public ICollection<DriverVehicleAssignment>? DriverAssignments { get; set; }
        public ICollection<DriverSchedule>? DriverSchedules { get; set; }
        public ICollection<DriverScheduleTemplate>? DriverScheduleTemplates { get; set; }
        public ICollection<VehicleInProvince>? VehicleInProvinces { get; set; }
        public ICollection<VehicleZonePreference>? ZonePreferences { get; set; }
        public ICollection<DrivingOrder>? DrivingOrders { get; set; }
    }
}
