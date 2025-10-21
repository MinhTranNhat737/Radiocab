using Microsoft.EntityFrameworkCore;
using RadioCabs_BE.Models;
using RadioCabs_BE.Repositories.Interfaces;
using Radiocabs_BE.Data;

namespace RadioCabs_BE.Repositories.Implementations
{
    public class VehicleRepository : GenericRepository<Vehicle>, IVehicleRepository
    {
        public VehicleRepository(RadiocabsDbContext db) : base(db) { }

        public Task<Vehicle?> FindByPlateAsync(string plate, CancellationToken ct = default)
            => _set.AsNoTracking().FirstOrDefaultAsync(x => x.PlateNumber == plate, ct);
            public async Task<IReadOnlyList<Vehicle>> ListByCompanyAsync(long companyId, CancellationToken ct = default)
        {
            return await _set.AsNoTracking()
                .Where(v => v.CompanyId == companyId)
                .OrderBy(v => v.PlateNumber)
                .ToListAsync(ct);
        }
    }
}
