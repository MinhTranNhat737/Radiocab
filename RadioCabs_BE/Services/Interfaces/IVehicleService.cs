// Services/Interfaces/IVehicleService.cs
using RadioCabs_BE.Models;

namespace RadioCabs_BE.Services.Interfaces
{
    public interface IVehicleService
    {
        Task<IReadOnlyList<Vehicle>> ListByCompanyAsync(long companyId, CancellationToken ct = default);
        Task<Vehicle?> GetAsync(long vehicleId, CancellationToken ct = default);
        Task<Vehicle>  CreateAsync(Vehicle vehicle, CancellationToken ct = default);
        Task<bool>     UpdateAsync(Vehicle vehicle, CancellationToken ct = default);

        // ⬇️ Thêm hàm này để khớp controller
        Task<bool>     DeactivateAsync(long vehicleId, CancellationToken ct = default);
    }
}
