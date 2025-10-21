using RadioCabs_BE.Models;
using RadioCabs_BE.Repositories.Interfaces;
using RadioCabs_BE.Services.Interfaces;

namespace RadioCabs_BE.Services
{
    public class VehicleModelService : IVehicleModelService
    {
        private readonly IVehicleModelRepository _repo;
        public VehicleModelService(IVehicleModelRepository repo) => _repo = repo;

        public Task<IReadOnlyList<VehicleModel>> ListByCompanyAsync(long companyId, CancellationToken ct = default)
            => _repo.ListByCompanyAsync(companyId, ct);
    }
}
