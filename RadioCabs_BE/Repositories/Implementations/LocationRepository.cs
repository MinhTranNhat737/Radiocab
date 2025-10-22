using Microsoft.EntityFrameworkCore;
using RadioCabs_BE.Data;
using RadioCabs_BE.Models;
using RadioCabs_BE.Repositories.Interfaces;

namespace RadioCabs_BE.Repositories.Implementations
{
    public class ProvinceRepository : GenericRepository<Province>, IProvinceRepository
    {
        public ProvinceRepository(RadiocabsDbContext context) : base(context) { }

        public async Task<Province?> GetByCodeAsync(string code, CancellationToken ct = default)
            => await _context.Provinces
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.Code == code, ct);

        public async Task<IReadOnlyList<Province>> SearchByNameAsync(string name, CancellationToken ct = default)
            => await _context.Provinces
                .AsNoTracking()
                .Where(x => x.Name.Contains(name))
                .OrderBy(x => x.Name)
                .ToListAsync(ct);
    }

    public class WardRepository : GenericRepository<Ward>, IWardRepository
    {
        public WardRepository(RadiocabsDbContext context) : base(context) { }

        public async Task<IReadOnlyList<Ward>> ListByProvinceAsync(long provinceId, CancellationToken ct = default)
            => await _context.Wards
                .AsNoTracking()
                .Where(x => x.ProvinceId == provinceId)
                .OrderBy(x => x.Name)
                .ToListAsync(ct);

        public async Task<IReadOnlyList<Ward>> SearchByNameAsync(string name, CancellationToken ct = default)
            => await _context.Wards
                .AsNoTracking()
                .Where(x => x.Name.Contains(name))
                .OrderBy(x => x.Name)
                .ToListAsync(ct);
    }

    public class ZoneRepository : GenericRepository<Zone>, IZoneRepository
    {
        public ZoneRepository(RadiocabsDbContext context) : base(context) { }

        public async Task<IReadOnlyList<Zone>> ListByCompanyAsync(long companyId, CancellationToken ct = default)
            => await _context.Zones
                .AsNoTracking()
                .Where(x => x.CompanyId == companyId)
                .OrderBy(x => x.Name)
                .ToListAsync(ct);

        public async Task<IReadOnlyList<Zone>> ListByProvinceAsync(long provinceId, CancellationToken ct = default)
            => await _context.Zones
                .AsNoTracking()
                .Where(x => x.ProvinceId == provinceId)
                .OrderBy(x => x.Name)
                .ToListAsync(ct);

        public async Task<IReadOnlyList<Zone>> ListActiveAsync(CancellationToken ct = default)
            => await _context.Zones
                .AsNoTracking()
                .Where(x => x.IsActive)
                .OrderBy(x => x.Name)
                .ToListAsync(ct);

        public async Task<Zone?> GetByCodeAsync(long companyId, long provinceId, string code, CancellationToken ct = default)
            => await _context.Zones
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.CompanyId == companyId 
                                       && x.ProvinceId == provinceId 
                                       && x.Code == code, ct);
    }

    public class ZoneWardRepository : GenericRepository<ZoneWard>, IZoneWardRepository
    {
        public ZoneWardRepository(RadiocabsDbContext context) : base(context) { }

        public async Task<IReadOnlyList<ZoneWard>> ListByZoneAsync(long zoneId, CancellationToken ct = default)
            => await _context.ZoneWards
                .AsNoTracking()
                .Where(x => x.ZoneId == zoneId)
                .Include(x => x.Ward)
                .ToListAsync(ct);

        public async Task<IReadOnlyList<ZoneWard>> ListByWardAsync(long wardId, CancellationToken ct = default)
            => await _context.ZoneWards
                .AsNoTracking()
                .Where(x => x.WardId == wardId)
                .Include(x => x.Zone)
                .ToListAsync(ct);

        public async Task<bool> IsWardInZoneAsync(long zoneId, long wardId, CancellationToken ct = default)
            => await _context.ZoneWards
                .AnyAsync(x => x.ZoneId == zoneId && x.WardId == wardId, ct);
    }
}
