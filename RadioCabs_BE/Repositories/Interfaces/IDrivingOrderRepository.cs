using RadioCabs_BE.Models;

namespace RadioCabs_BE.Repositories.Interfaces
{
    public interface IDrivingOrderRepository : IGenericRepository<DrivingOrder>
    {
        Task<IReadOnlyList<DrivingOrder>> ListByCompanyAndStatusAsync(long companyId, OrderStatus status, CancellationToken ct = default);
    }
}
