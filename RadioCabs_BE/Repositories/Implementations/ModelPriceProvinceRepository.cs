using Microsoft.EntityFrameworkCore;
using RadioCabs_BE.Models;
using RadioCabs_BE.Repositories.Interfaces;
using Radiocabs_BE.Data;

namespace RadioCabs_BE.Repositories.Implementations
{
    public class ModelPriceProvinceRepository : GenericRepository<ModelPriceProvince>, IModelPriceProvinceRepository
    {
        public ModelPriceProvinceRepository(RadiocabsDbContext db) : base(db) { }

        public Task<ModelPriceProvince?> FindActivePriceAsync(long companyId, long provinceId, long modelId, DateOnly atDate, CancellationToken ct = default)
            => _set.AsNoTracking()
                   .Where(x => x.CompanyId == companyId
                            && x.ProvinceId == provinceId
                            && x.ModelId == modelId
                            && x.IsActive
                            && x.DateStart <= atDate && atDate <= x.DateEnd)
                   .OrderByDescending(x => x.DateStart)
                   .FirstOrDefaultAsync(ct);
    }
}
