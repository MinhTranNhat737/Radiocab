using RadioCabs_BE.Models;

namespace RadioCabs_BE.Services.Interfaces
{
    public interface IVehicleModelService
    {
        Task<IReadOnlyList<VehicleModel>> ListByCompanyAsync(long companyId, CancellationToken ct = default);
    }
}
