using RadioCabs_BE.Models;

namespace RadioCabs_BE.Services.Interfaces
{
    public record QuoteRequest(
        long CompanyId,
        long ProvinceId,
        long ModelId,
        decimal TotalKm,
        decimal IntercityKm = 0,
        decimal TrafficKm   = 0,
        bool   IsRaining    = false,
        int    WaitMinutes  = 0,
        DateTimeOffset? PickupTime = null
    );

    public record QuoteResult(
        decimal BaseFare,
        decimal IntercityFee,
        decimal TrafficFee,
        decimal RainFee,
        decimal OtherFee,
        decimal TotalAmount,
        long?   PriceRefId
    );

    public interface IDrivingOrderService
    {
        Task<QuoteResult> QuoteAsync(QuoteRequest req, CancellationToken ct = default);

        Task<DrivingOrder> CreateOrderAsync(DrivingOrder order, CancellationToken ct = default);

        Task<IReadOnlyList<DrivingOrder>> ListByStatusAsync(
            long companyId, OrderStatus status, CancellationToken ct = default);

        Task<bool> AssignDriverAsync(long orderId, long driverAccountId, long? vehicleId, CancellationToken ct = default);

        Task<bool> CompleteOrderAsync(long orderId, DateTimeOffset dropoffTime, CancellationToken ct = default);

        Task<bool> MarkPaidAsync(long orderId, PaymentMethod method, DateTimeOffset paidAt, CancellationToken ct = default);
    }
}
