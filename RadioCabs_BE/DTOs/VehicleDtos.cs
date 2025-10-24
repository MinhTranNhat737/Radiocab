using RadioCabs_BE.Models;
using RadioCabs_BE.DTOs;

namespace RadioCabs_BE.DTOs
{
    // ==================== VEHICLE DTOs ====================
    
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
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        
        // Navigation properties
        public CompanyDto? Company { get; set; }
        public VehicleModelDto? Model { get; set; }
        public ICollection<VehicleInProvinceDto> VehicleInProvinces { get; set; } = new List<VehicleInProvinceDto>();
        public ICollection<VehicleZonePreferenceDto> VehicleZonePreferences { get; set; } = new List<VehicleZonePreferenceDto>();
        public ICollection<DriverVehicleAssignmentDto> DriverVehicleAssignments { get; set; } = new List<DriverVehicleAssignmentDto>();
        public ICollection<DriverScheduleDto> DriverSchedules { get; set; } = new List<DriverScheduleDto>();
    }

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
        public ActiveFlag Status { get; set; } = ActiveFlag.ACTIVE;
        
        // Optional relationships
        public List<long>? ProvinceIds { get; set; }
        public List<VehicleZonePreferenceCreateDto>? ZonePreferences { get; set; }
    }

    public class UpdateVehicleDto
    {
        public long ModelId { get; set; }
        public string PlateNumber { get; set; } = null!;
        public string? Vin { get; set; }
        public string? Color { get; set; }
        public short? YearManufactured { get; set; }
        public DateOnly InServiceFrom { get; set; }
        public int OdometerKm { get; set; }
        public ActiveFlag Status { get; set; }
        
        // Optional relationships
        public List<long>? ProvinceIds { get; set; }
        public List<VehicleZonePreferenceCreateDto>? ZonePreferences { get; set; }
    }

    // ==================== VEHICLE MODEL DTOs ====================
    
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
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        
        // Navigation properties
        public CompanyDto? Company { get; set; }
        public VehicleSegmentDto? Segment { get; set; }
        public ICollection<VehicleDto> Vehicles { get; set; } = new List<VehicleDto>();
        public ICollection<ModelPriceProvinceDto> ModelPriceProvinces { get; set; } = new List<ModelPriceProvinceDto>();
    }

    public class CreateVehicleModelDto
    {
        public long CompanyId { get; set; }
        public long? SegmentId { get; set; }
        public string Brand { get; set; } = null!;
        public string ModelName { get; set; } = null!;
        public FuelType FuelType { get; set; } = FuelType.GASOLINE;
        public VehicleCategory SeatCategory { get; set; } = VehicleCategory.SEDAN_5;
        public string? ImageUrl { get; set; }
        public string? Description { get; set; }
        public bool IsActive { get; set; } = true;
        
        // Optional relationships
        public List<ModelPriceProvinceCreateDto>? PriceProvinces { get; set; }
    }

    public class UpdateVehicleModelDto
    {
        public long? SegmentId { get; set; }
        public string Brand { get; set; } = null!;
        public string ModelName { get; set; } = null!;
        public FuelType FuelType { get; set; }
        public VehicleCategory SeatCategory { get; set; }
        public string? ImageUrl { get; set; }
        public string? Description { get; set; }
        public bool IsActive { get; set; }
        
        // Optional relationships
        public List<ModelPriceProvinceCreateDto>? PriceProvinces { get; set; }
    }

    // ==================== VEHICLE SEGMENT DTOs ====================
    
    public class VehicleSegmentDto
    {
        public long SegmentId { get; set; }
        public long CompanyId { get; set; }
        public string Code { get; set; } = null!;
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        
        // Navigation properties
        public CompanyDto? Company { get; set; }
        public ICollection<VehicleModelDto> VehicleModels { get; set; } = new List<VehicleModelDto>();
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

    // ==================== PROVINCE & WARD DTOs ====================
    
    // Note: ProvinceDto is defined in DrivingOrderDtos.cs

    public class WardDto
    {
        public long WardId { get; set; }
        public long ProvinceId { get; set; }
        public string? Code { get; set; }
        public string Name { get; set; } = null!;
        public string? WardType { get; set; } // PHƯỜNG, XÃ, THỊ TRẤN
        public bool IsActive { get; set; } = true;
        
        // Navigation properties
        public ProvinceDto Province { get; set; } = null!;
        public ICollection<ZoneWardDto> ZoneWards { get; set; } = new List<ZoneWardDto>();
    }

    // ==================== ZONE DTOs ====================
    
    public class ZoneDto
    {
        public long ZoneId { get; set; }
        public long CompanyId { get; set; }
        public long ProvinceId { get; set; }
        public string Code { get; set; } = null!;
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        
        // Navigation properties
        public CompanyDto? Company { get; set; }
        public ProvinceDto Province { get; set; } = null!;
        public ICollection<ZoneWardDto> ZoneWards { get; set; } = new List<ZoneWardDto>();
        public ICollection<VehicleZonePreferenceDto> VehicleZonePreferences { get; set; } = new List<VehicleZonePreferenceDto>();
    }

    public class CreateZoneDto
    {
        public long CompanyId { get; set; }
        public long ProvinceId { get; set; }
        public string Code { get; set; } = null!;
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public bool IsActive { get; set; } = true;
        
        // Optional relationships
        public List<long>? WardIds { get; set; }
    }

    public class UpdateZoneDto
    {
        public string Code { get; set; } = null!;
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public bool IsActive { get; set; }
        
        // Optional relationships
        public List<long>? WardIds { get; set; }
    }

    public class ZoneWardDto
    {
        public long ZoneId { get; set; }
        public long WardId { get; set; }
        
        // Navigation properties
        public ZoneDto Zone { get; set; } = null!;
        public WardDto Ward { get; set; } = null!;
    }

    // ==================== VEHICLE PROVINCE DTOs ====================
    
    public class VehicleInProvinceDto
    {
        public long VehicleId { get; set; }
        public long ProvinceId { get; set; }
        public bool Allowed { get; set; }
        public DateOnly? SinceDate { get; set; }
        
        // Navigation properties
        public VehicleDto Vehicle { get; set; } = null!;
        public ProvinceDto Province { get; set; } = null!;
    }

    public class CreateVehicleInProvinceDto
    {
        public long VehicleId { get; set; }
        public long ProvinceId { get; set; }
        public bool Allowed { get; set; } = true;
        public DateOnly? SinceDate { get; set; }
    }

    // ==================== VEHICLE ZONE PREFERENCE DTOs ====================
    
    public class VehicleZonePreferenceDto
    {
        public long VehicleId { get; set; }
        public long ZoneId { get; set; }
        public short Priority { get; set; } // 1 = HIGH, 2 = MEDIUM, 3 = LOW
        
        // Navigation properties
        public VehicleDto Vehicle { get; set; } = null!;
        public ZoneDto Zone { get; set; } = null!;
    }

    public class VehicleZonePreferenceCreateDto
    {
        public long ZoneId { get; set; }
        public int Priority { get; set; } = 2; // Default MEDIUM
        public bool IsActive { get; set; } = true;
    }

    public class CreateVehicleZonePreferenceDto
    {
        public long VehicleId { get; set; }
        public long ZoneId { get; set; }
        public int Priority { get; set; } = 2;
        public bool IsActive { get; set; } = true;
    }

    // ==================== MODEL PRICE PROVINCE DTOs ====================
    
    public class ModelPriceProvinceDto
    {
        public long ModelPriceId { get; set; }
        public long CompanyId { get; set; }
        public long ProvinceId { get; set; }
        public long ModelId { get; set; }
        public decimal OpeningFare { get; set; }
        public decimal RateFirst20Km { get; set; }
        public decimal RateOver20Km { get; set; }
        public decimal TrafficAddPerKm { get; set; }
        public decimal RainAddPerTrip { get; set; }
        public decimal IntercityRatePerKm { get; set; }
        public TimeOnly? TimeStart { get; set; }
        public TimeOnly? TimeEnd { get; set; }
        public long? ParentId { get; set; }
        public DateOnly DateStart { get; set; }
        public DateOnly DateEnd { get; set; }
        public bool IsActive { get; set; }
        public string? Note { get; set; }
        
        // Navigation properties
        public VehicleModelDto Model { get; set; } = null!;
        public ProvinceDto Province { get; set; } = null!;
    }

    public class ModelPriceProvinceCreateDto
    {
        public long ProvinceId { get; set; }
        public decimal OpeningFare { get; set; }
        public decimal? PerKmRate { get; set; }
        public decimal? PerMinuteRate { get; set; }
        public bool IsActive { get; set; } = true;
    }

    public class CreateModelPriceProvinceDto
    {
        public long CompanyId { get; set; }
        public long ModelId { get; set; }
        public long ProvinceId { get; set; }
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

    // ==================== DRIVER VEHICLE ASSIGNMENT DTOs ====================
    
    public class DriverVehicleAssignmentDto
    {
        public long AssignmentId { get; set; }
        public long DriverAccountId { get; set; }
        public long VehicleId { get; set; }
        public DateTimeOffset StartAt { get; set; }
        public DateTimeOffset? EndAt { get; set; }
        
        // Navigation properties
        public VehicleDto Vehicle { get; set; } = null!;
        public AccountDto Driver { get; set; } = null!;
    }

    public class CreateDriverVehicleAssignmentDto
    {
        public long VehicleId { get; set; }
        public long DriverId { get; set; }
        public DateOnly AssignedFrom { get; set; }
        public DateOnly? AssignedTo { get; set; }
        public bool IsActive { get; set; } = true;
    }

    // ==================== DRIVER SCHEDULE DTOs ====================
    
    public class DriverScheduleDto
    {
        public long ScheduleId { get; set; }
        public long DriverAccountId { get; set; }
        public DateOnly WorkDate { get; set; }
        public TimeOnly StartTime { get; set; }
        public TimeOnly EndTime { get; set; }
        public long? VehicleId { get; set; }
        public string Status { get; set; } = "PLANNED";
        public string? Note { get; set; }
        public DateTimeOffset CreatedAt { get; set; }
        public DateTimeOffset? UpdatedAt { get; set; }
        
        // Navigation properties
        public AccountDto Driver { get; set; } = null!;
        public VehicleDto? Vehicle { get; set; }
    }

    public class CreateDriverScheduleDto
    {
        public long DriverAccountId { get; set; }
        public DateOnly WorkDate { get; set; }
        public TimeOnly StartTime { get; set; }
        public TimeOnly EndTime { get; set; }
        public long? VehicleId { get; set; }
        public string Status { get; set; } = "PLANNED";
        public string? Note { get; set; }
    }

    // Note: CompanyDto and AccountDto are defined in their respective files:
    // - CompanyDto in CompanyDtos.cs
    // - AccountDto in AccountDtos.cs
}