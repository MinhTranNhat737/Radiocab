using geo_service.DTOs;
using geo_service.Models;

namespace geo_service.Services.Interfaces
{
    public interface IGeoService
    {
        Task<PagedResult<ZoneDto>> GetZonesPagedAsync(PageRequest request, long? companyId = null);
        Task<ZoneDto> CreateZoneAsync(CreateZoneDto dto);
        Task<ZoneDto?> UpdateZoneAsync(long id, UpdateZoneDto dto);
        Task<bool> DeleteZoneAsync(long id);
        Task<bool> AddWardToZoneAsync(long zoneId, long wardId);
        Task<bool> RemoveWardFromZoneAsync(long zoneId, long wardId);
        Task<PagedResult<ProvinceDto>> GetProvincesPagedAsync(PageRequest request);
        Task<PagedResult<WardDto>> GetWardsPagedAsync(PageRequest request);
    }
}
