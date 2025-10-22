using RadioCabs_BE.Models;

namespace RadioCabs_BE.DTOs
{
    public class CreateVehicleDto
    {
        public long CompanyId { get; set; }
        public long ModelId { get; set; }
        public string PlateNumber { get; set; } = null!;
        public string? Vin { get; set; }
        public string? Color { get; set; }
        public short? YearManufactured { get; set; }
        public DateOnly InServiceFrom { get; set; }
        public int OdometerKm { get; set; } = 0;
    }

    public class UpdateVehicleDto
    {
        public long? ModelId { get; set; }
        public string? PlateNumber { get; set; }
        public string? Vin { get; set; }
        public string? Color { get; set; }
        public short? YearManufactured { get; set; }
        public DateOnly? InServiceFrom { get; set; }
        public int? OdometerKm { get; set; }
        public string? Status { get; set; }
    }

    public class VehicleDto
    {
        public long VehicleId { get; set; }
        public long CompanyId { get; set; }
        public long ModelId { get; set; }
        public string PlateNumber { get; set; } = null!;
        public string? Vin { get; set; }
        public string? Color { get; set; }
        public short? YearManufactured { get; set; }
        public DateOnly InServiceFrom { get; set; }
        public int OdometerKm { get; set; }
        public string Status { get; set; } = null!;
        public VehicleModelDto? Model { get; set; }
    }

    public class CreateVehicleModelDto
    {
        public long CompanyId { get; set; }
        public long? SegmentId { get; set; }
        public string Brand { get; set; } = null!;
        public string ModelName { get; set; } = null!;
        public string FuelType { get; set; } = "GASOLINE";
        public string SeatCategory { get; set; } = "SEDAN_5";
        public string? ImageUrl { get; set; }
        public string? Description { get; set; }
    }

    public class UpdateVehicleModelDto
    {
        public long? SegmentId { get; set; }
        public string? Brand { get; set; }
        public string? ModelName { get; set; }
        public string? FuelType { get; set; }
        public string? SeatCategory { get; set; }
        public string? ImageUrl { get; set; }
        public string? Description { get; set; }
        public bool? IsActive { get; set; }
    }

    public class VehicleModelDto
    {
        public long ModelId { get; set; }
        public long CompanyId { get; set; }
        public long? SegmentId { get; set; }
        public string Brand { get; set; } = null!;
        public string ModelName { get; set; } = null!;
        public string FuelType { get; set; } = null!;
        public string SeatCategory { get; set; } = null!;
        public string? ImageUrl { get; set; }
        public string? Description { get; set; }
        public bool IsActive { get; set; }
        public VehicleSegmentDto? Segment { get; set; }
    }

    public class CreateVehicleSegmentDto
    {
        public long CompanyId { get; set; }
        public string Code { get; set; } = null!;
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
    }

    public class UpdateVehicleSegmentDto
    {
        public string? Code { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public bool? IsActive { get; set; }
    }

    public class VehicleSegmentDto
    {
        public long SegmentId { get; set; }
        public long CompanyId { get; set; }
        public string Code { get; set; } = null!;
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public bool IsActive { get; set; }
    }
}





