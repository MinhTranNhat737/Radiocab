using RadioCabs_BE.Models;
using RadioCabs_BE.DTOs;
namespace RadioCabs_BE.Services.Interfaces
{
    public interface IDrivingOrderService
    {
        Task<DrivingOrder?> GetAsync(long id, CancellationToken ct = default);

        Task<IReadOnlyList<DrivingOrder>> ListByCompanyAsync(
            long companyId,
            OrderStatus? status = null,
            DateTimeOffset? from = null,
            DateTimeOffset? to = null,
            CancellationToken ct = default);

        Task<long> CreateAsync(DrivingOrder order, CancellationToken ct = default);

        Task UpdateStatusAsync(long orderId, OrderStatus status, CancellationToken ct = default);

        Task<QuoteResult> QuoteAsync(QuoteRequest req, CancellationToken ct = default);
    }
}
