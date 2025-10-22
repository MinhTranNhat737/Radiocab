using RadioCabs_BE.Models;

namespace RadioCabs_BE.Repositories.Interfaces
{
    public interface IProvinceRepository : IGenericRepository<Province>
    {
        Task<Province?> GetByCodeAsync(string code, CancellationToken ct = default);
        Task<IReadOnlyList<Province>> SearchByNameAsync(string name, CancellationToken ct = default);
    }

    public interface IWardRepository : IGenericRepository<Ward>
    {
        Task<IReadOnlyList<Ward>> ListByProvinceAsync(long provinceId, CancellationToken ct = default);
        Task<IReadOnlyList<Ward>> SearchByNameAsync(string name, CancellationToken ct = default);
    }

    public interface IZoneRepository : IGenericRepository<Zone>
    {
        Task<IReadOnlyList<Zone>> ListByCompanyAsync(long companyId, CancellationToken ct = default);
        Task<IReadOnlyList<Zone>> ListByProvinceAsync(long provinceId, CancellationToken ct = default);
        Task<IReadOnlyList<Zone>> ListActiveAsync(CancellationToken ct = default);
        Task<Zone?> GetByCodeAsync(long companyId, long provinceId, string code, CancellationToken ct = default);
    }

    public interface IZoneWardRepository : IGenericRepository<ZoneWard>
    {
        Task<IReadOnlyList<ZoneWard>> ListByZoneAsync(long zoneId, CancellationToken ct = default);
        Task<IReadOnlyList<ZoneWard>> ListByWardAsync(long wardId, CancellationToken ct = default);
        Task<bool> IsWardInZoneAsync(long zoneId, long wardId, CancellationToken ct = default);
    }
}
