using RadioCabs_BE.Models;

namespace RadioCabs_BE.Repositories.Interfaces
{
    public interface IVehicleRepository : IGenericRepository<Vehicle>
    {
        Task<Vehicle?> FindByPlateAsync(string plate, CancellationToken ct = default);
         Task<IReadOnlyList<Vehicle>> ListByCompanyAsync(long companyId, CancellationToken ct = default);
    }
}
