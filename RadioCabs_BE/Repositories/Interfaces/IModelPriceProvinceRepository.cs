using RadioCabs_BE.Models;

namespace RadioCabs_BE.Repositories.Interfaces
{
    public interface IModelPriceProvinceRepository : IGenericRepository<ModelPriceProvince>
    {
        Task<ModelPriceProvince?> FindActivePriceAsync(long companyId, long provinceId, long modelId, DateOnly atDate, CancellationToken ct = default);
    }
}
