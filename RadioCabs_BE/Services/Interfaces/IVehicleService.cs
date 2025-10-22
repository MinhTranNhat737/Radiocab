using RadioCabs_BE.DTOs;

namespace RadioCabs_BE.Services.Interfaces
{
    public interface IVehicleService
    {
        // Vehicle methods
        Task<VehicleDto?> GetVehicleByIdAsync(long id);
        Task<PagedResult<VehicleDto>> GetVehiclesPagedAsync(PageRequest request);
        Task<VehicleDto> CreateVehicleAsync(CreateVehicleDto dto);
        Task<VehicleDto?> UpdateVehicleAsync(long id, UpdateVehicleDto dto);
        Task<bool> DeleteVehicleAsync(long id);

        // VehicleModel methods
        Task<VehicleModelDto?> GetModelByIdAsync(long id);
        Task<PagedResult<VehicleModelDto>> GetModelsPagedAsync(PageRequest request);
        Task<VehicleModelDto> CreateModelAsync(CreateVehicleModelDto dto);
        Task<VehicleModelDto?> UpdateModelAsync(long id, UpdateVehicleModelDto dto);
        Task<bool> DeleteModelAsync(long id);

        // VehicleSegment methods
        Task<VehicleSegmentDto?> GetSegmentByIdAsync(long id);
        Task<PagedResult<VehicleSegmentDto>> GetSegmentsPagedAsync(PageRequest request);
        Task<VehicleSegmentDto> CreateSegmentAsync(CreateVehicleSegmentDto dto);
        Task<VehicleSegmentDto?> UpdateSegmentAsync(long id, UpdateVehicleSegmentDto dto);
        Task<bool> DeleteSegmentAsync(long id);
    }
}
