using vehicle_service.DTOs;

namespace vehicle_service.Services.Interfaces
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
       

        // Vehicle Province methods
        Task<PagedResult<VehicleInProvinceDto>> GetVehicleInProvincesPagedAsync(PageRequest request);

        // Vehicle Zone Preference methods
        Task<PagedResult<VehicleZonePreferenceDto>> GetVehicleZonePreferencesPagedAsync(PageRequest request);
        Task<bool> AddVehicleToZoneAsync(long vehicleId, long zoneId, short priority = 100);
        Task<bool> RemoveVehicleFromZoneAsync(long vehicleId, long zoneId);

        // Model Price Province methods
        Task<PagedResult<ModelPriceProvinceDto>> GetModelPriceProvincesPagedAsync(PageRequest request);
        Task<ModelPriceProvinceDto> CreateModelPriceProvinceAsync(CreateModelPriceProvinceDto dto);
        Task<ModelPriceProvinceDto?> UpdateModelPriceProvinceAsync(long id, UpdateModelPriceProvinceDto dto);
        Task<bool> DeleteModelPriceProvinceAsync(long id);
    }
}
