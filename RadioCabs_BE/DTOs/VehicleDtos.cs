using RadioCabs_BE.Models;

namespace RadioCabs_BE.DTOs
{
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
        public ActiveFlag Status { get; set; }
        public VehicleModelDto? Model { get; set; }
    }

    public class VehicleModelDto
    {
        public long ModelId { get; set; }
        public long CompanyId { get; set; }
        public long? SegmentId { get; set; }
        public string Brand { get; set; } = null!;
        public string ModelName { get; set; } = null!;
        public FuelType FuelType { get; set; }
        public VehicleCategory SeatCategory { get; set; }
        public string? ImageUrl { get; set; }
        public string? Description { get; set; }
        public bool IsActive { get; set; }
        public VehicleSegmentDto? Segment { get; set; }
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

    public class CreateVehicleSegmentDto
    {
        public long CompanyId { get; set; }
        public string Code { get; set; } = null!;
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public bool IsActive { get; set; } = true;
    }

    public class UpdateVehicleSegmentDto
    {
        public string Code { get; set; } = null!;
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public bool IsActive { get; set; }
    }

    public class ProvinceDto
    {
        public long ProvinceId { get; set; }
        public string? Code { get; set; }
        public string Name { get; set; } = null!;
    }

    public class WardDto
    {
        public long WardId { get; set; }
        public long ProvinceId { get; set; }
        public string? Code { get; set; }
        public string Name { get; set; } = null!;
        public ProvinceDto Province { get; set; } = null!;
    }

    public class ZoneDto
    {
        public long ZoneId { get; set; }
        public long CompanyId { get; set; }
        public long ProvinceId { get; set; }
        public string Code { get; set; } = null!;
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public bool IsActive { get; set; }
        public ProvinceDto Province { get; set; } = null!;
        public ICollection<ZoneWardDto> ZoneWards { get; set; } = new List<ZoneWardDto>();
    }

    public class CreateZoneDto
    {
        public long CompanyId { get; set; }
        public long ProvinceId { get; set; }
        public string Code { get; set; } = null!;
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public bool IsActive { get; set; } = true;
    }

    public class UpdateZoneDto
    {
        public string Code { get; set; } = null!;
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public bool IsActive { get; set; }
    }

    public class ZoneWardDto
    {
        public long ZoneId { get; set; }
        public long WardId { get; set; }
        public ZoneDto Zone { get; set; } = null!;
        public WardDto Ward { get; set; } = null!;
    }

    public class VehicleInProvinceDto
    {
        public long VehicleId { get; set; }
        public long ProvinceId { get; set; }
        public bool Allowed { get; set; }
        public DateOnly? SinceDate { get; set; }
        public VehicleDto Vehicle { get; set; } = null!;
        public ProvinceDto Province { get; set; } = null!;
    }

    public class VehicleZonePreferenceDto
    {
        public long VehicleId { get; set; }
        public long ZoneId { get; set; }
        public string Priority { get; set; } = null!; // HIGH, MEDIUM, LOW
        public bool IsActive { get; set; }
        public VehicleDto Vehicle { get; set; } = null!;
        public ZoneDto Zone { get; set; } = null!;
    }
}