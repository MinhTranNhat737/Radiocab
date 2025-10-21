using Microsoft.EntityFrameworkCore;
using RadioCabs_BE.Models;
using RadioCabs_BE.Repositories.Interfaces;
using RadioCabs_BE.Data;

namespace RadioCabs_BE.Repositories.Implementations
{
    public class VehicleModelRepository : GenericRepository<VehicleModel>, IVehicleModelRepository
    {
        public VehicleModelRepository(RadiocabsDbContext db) : base(db) { }

        public async Task<IReadOnlyList<VehicleModel>> ListByCompanyAsync(
            long companyId, CancellationToken ct = default)
        {
            var models = await _set.AsNoTracking()
                                   .Where(m => m.CompanyId == companyId && m.IsActive)
                                   .OrderBy(m => m.Brand).ThenBy(m => m.ModelName)
                                   .ToListAsync(ct);
            return models;
        }
    }
}
