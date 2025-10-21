using Microsoft.EntityFrameworkCore;
using RadioCabs_BE.Models;
using RadioCabs_BE.Repositories.Interfaces;
using Radiocabs_BE.Data;

namespace RadioCabs_BE.Repositories.Implementations
{
    public class VehicleModelRepository : GenericRepository<VehicleModel>, IVehicleModelRepository
    {
        public VehicleModelRepository(RadiocabsDbContext db) : base(db) { }

        public Task<IReadOnlyList<VehicleModel>> ListByCompanyAsync(long companyId, CancellationToken ct = default)
            => _set.AsNoTracking().Where(x => x.CompanyId == companyId).ToListAsync(ct);
    }
}
