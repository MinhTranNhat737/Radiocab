using RadioCabs_BE.DTOs;
using RadioCabs_BE.Models;

namespace RadioCabs_BE.Services.Interfaces
{
    public interface IProvinceService
    {
        Task<Province?> GetAsync(long id, CancellationToken ct = default);
        Task<Province?> GetByCodeAsync(string code, CancellationToken ct = default);
        Task<IReadOnlyList<Province>> ListAsync(CancellationToken ct = default);
        Task<IReadOnlyList<Province>> SearchByNameAsync(string name, CancellationToken ct = default);
        Task<Province> CreateAsync(CreateProvinceDto dto, CancellationToken ct = default);
        Task<bool> UpdateAsync(long id, UpdateProvinceDto dto, CancellationToken ct = default);
    }

    public interface IWardService
    {
        Task<Ward?> GetAsync(long id, CancellationToken ct = default);
        Task<IReadOnlyList<Ward>> ListByProvinceAsync(long provinceId, CancellationToken ct = default);
        Task<IReadOnlyList<Ward>> SearchByNameAsync(string name, CancellationToken ct = default);
        Task<Ward> CreateAsync(CreateWardDto dto, CancellationToken ct = default);
        Task<bool> UpdateAsync(long id, UpdateWardDto dto, CancellationToken ct = default);
    }

    public interface IZoneService
    {
        Task<Zone?> GetAsync(long id, CancellationToken ct = default);
        Task<IReadOnlyList<Zone>> ListByCompanyAsync(long companyId, CancellationToken ct = default);
        Task<IReadOnlyList<Zone>> ListByProvinceAsync(long provinceId, CancellationToken ct = default);
        Task<IReadOnlyList<Zone>> ListActiveAsync(CancellationToken ct = default);
        Task<Zone> CreateAsync(CreateZoneDto dto, CancellationToken ct = default);
        Task<bool> UpdateAsync(long id, UpdateZoneDto dto, CancellationToken ct = default);
        Task<bool> AssignWardAsync(AssignWardToZoneDto dto, CancellationToken ct = default);
        Task<bool> RemoveWardAsync(long zoneId, long wardId, CancellationToken ct = default);
    }
}
