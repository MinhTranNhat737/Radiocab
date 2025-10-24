using RadioCabs_BE.DTOs;

namespace RadioCabs_BE.Services.Interfaces
{
    public interface IVehicleService
    {
        // Vehicle methods
        Task<VehicleDto?> GetVehicleByIdAsync(long id);
        Task<PagedResult<VehicleDto>> GetVehiclesPagedAsync(PageRequest request, long? companyId = null);
        Task<VehicleDto> CreateVehicleAsync(CreateVehicleDto dto);
        Task<VehicleDto?> UpdateVehicleAsync(long id, UpdateVehicleDto dto);
        Task<bool> DeleteVehicleAsync(long id);

        // VehicleModel methods
        Task<VehicleModelDto?> GetModelByIdAsync(long id);
        Task<PagedResult<VehicleModelDto>> GetModelsPagedAsync(PageRequest request, long? companyId = null);
        Task<VehicleModelDto> CreateModelAsync(CreateVehicleModelDto dto);
        Task<VehicleModelDto?> UpdateModelAsync(long id, UpdateVehicleModelDto dto);
        Task<bool> DeleteModelAsync(long id);

        // VehicleSegment methods
        Task<VehicleSegmentDto?> GetSegmentByIdAsync(long id);
        Task<PagedResult<VehicleSegmentDto>> GetSegmentsPagedAsync(PageRequest request, long? companyId = null);
        Task<VehicleSegmentDto> CreateSegmentAsync(CreateVehicleSegmentDto dto);
        Task<VehicleSegmentDto?> UpdateSegmentAsync(long id, UpdateVehicleSegmentDto dto);
        Task<bool> DeleteSegmentAsync(long id);

        // Zone methods
        Task<PagedResult<ZoneDto>> GetZonesPagedAsync(PageRequest request, long? companyId = null);
        Task<ZoneDto> CreateZoneAsync(CreateZoneDto dto);
        Task<ZoneDto?> UpdateZoneAsync(long id, UpdateZoneDto dto);
        Task<bool> DeleteZoneAsync(long id);

        // Zone Ward methods
        Task<PagedResult<ZoneWardDto>> GetZoneWardsPagedAsync(PageRequest request);
        Task<bool> AddWardToZoneAsync(long zoneId, long wardId);
        Task<bool> RemoveWardFromZoneAsync(long zoneId, long wardId);

        // Province methods
        Task<PagedResult<ProvinceDto>> GetProvincesPagedAsync(PageRequest request);

        // Ward methods
        Task<PagedResult<WardDto>> GetWardsPagedAsync(PageRequest request);

        // Vehicle Province methods
        Task<PagedResult<VehicleInProvinceDto>> GetVehicleInProvincesPagedAsync(PageRequest request);

        // Vehicle Zone Preference methods
        Task<PagedResult<VehicleZonePreferenceDto>> GetVehicleZonePreferencesPagedAsync(PageRequest request);

        // Model Price Province methods
        Task<PagedResult<ModelPriceProvinceDto>> GetModelPriceProvincesPagedAsync(PageRequest request);
        Task<ModelPriceProvinceDto> CreateModelPriceProvinceAsync(CreateModelPriceProvinceDto dto);
        Task<bool> DeleteModelPriceProvinceAsync(long id);

        // Driver Vehicle Assignment methods
        Task<DriverVehicleAssignmentDto> CreateDriverVehicleAssignmentAsync(CreateDriverVehicleAssignmentDto dto);
    }
}
