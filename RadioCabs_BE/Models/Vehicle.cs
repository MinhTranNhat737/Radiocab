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
    }
}
