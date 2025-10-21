using RadioCabs_BE.Models;

namespace RadioCabs_BE.Repositories.Interfaces
{
    public interface IVehicleModelRepository : IGenericRepository<VehicleModel>
    {
        Task<IReadOnlyList<VehicleModel>> ListByCompanyAsync(long companyId, CancellationToken ct = default);
    }
}
