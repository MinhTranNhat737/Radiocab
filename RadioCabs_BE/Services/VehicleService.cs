// Services/VehicleService.cs
using RadioCabs_BE.Models;
using RadioCabs_BE.Repositories.Interfaces;
using RadioCabs_BE.Services.Interfaces;
using RadioCabs_BE.Repositories;

namespace RadioCabs_BE.Services
{
    public class VehicleService : IVehicleService
    {
        private readonly IVehicleRepository _repo;
        private readonly IUnitOfWork _uow;

        public VehicleService(IVehicleRepository repo, IUnitOfWork uow)
        {
            _repo = repo; _uow = uow;
        }

        public Task<Vehicle?> GetAsync(long vehicleId, CancellationToken ct = default)
            => _repo.GetByIdAsync(vehicleId, ct);

        public Task<IReadOnlyList<Vehicle>> ListByCompanyAsync(long companyId, CancellationToken ct = default)
            => _repo.ListByCompanyAsync(companyId, ct);

        public async Task<Vehicle> CreateAsync(Vehicle vehicle, CancellationToken ct = default)
        {
            await _repo.AddAsync(vehicle, ct);
            await _uow.SaveChangesAsync(ct);
            return vehicle;
        }

        public async Task<bool> UpdateAsync(Vehicle vehicle, CancellationToken ct = default)
        {
            _repo.Update(vehicle);
            return await _uow.SaveChangesAsync(ct) > 0;
        }

        // ⬇️ Thêm method deactivate (soft delete)
        public async Task<bool> DeactivateAsync(long vehicleId, CancellationToken ct = default)
        {
            var v = await _repo.GetByIdAsync(vehicleId, ct);
            if (v == null) return false;

            v.Status = ActiveFlag.INACTIVE;
            _repo.Update(v);
            return await _uow.SaveChangesAsync(ct) > 0;
        }
    }
}
