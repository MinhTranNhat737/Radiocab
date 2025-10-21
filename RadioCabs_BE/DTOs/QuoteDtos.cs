namespace RadioCabs_BE.DTOs
{
    // Request dùng để báo giá
    public sealed record QuoteRequest(
        long CompanyId,
        long ProvinceId,
        long ModelId,
        decimal TotalKm,
        decimal IntercityKm,
        decimal TrafficKm,
        bool IsRaining,
        DateTimeOffset? PickupTime
    );

    // Kết quả báo giá
    public sealed record QuoteResult(
        decimal BaseFare,
        decimal IntercityFee,
        decimal TrafficFee,
        decimal RainFee,
        decimal OtherFee,
        decimal TotalAmount,
        long    PriceRefId
    );
}
