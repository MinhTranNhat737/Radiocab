using Microsoft.EntityFrameworkCore;
using RadioCabs_BE.Models;
using RadioCabs_BE.Repositories.Interfaces;
using RadioCabs_BE.Repositories;
using RadioCabs_BE.Services.Interfaces;
using Radiocabs_BE.Data;

namespace RadioCabs_BE.Services
{
    public class DrivingOrderService : IDrivingOrderService
    {
        private readonly IModelPriceProvinceRepository _priceRepo;
        private readonly IDrivingOrderRepository _orderRepo;
        private readonly IVehicleRepository _vehicleRepo;
        private readonly IUnitOfWork _uow;
        private readonly RadiocabsDbContext _db;

        public DrivingOrderService(
            IModelPriceProvinceRepository priceRepo,
            IDrivingOrderRepository orderRepo,
            IVehicleRepository vehicleRepo,
            IUnitOfWork uow,
            RadiocabsDbContext db)
        {
            _priceRepo = priceRepo;
            _orderRepo = orderRepo;
            _vehicleRepo = vehicleRepo;
            _uow = uow;
            _db = db;
        }

       public async Task<QuoteResult> QuoteAsync(QuoteRequest req, CancellationToken ct = default)
{
    // Chuẩn hoá mốc thời gian đón về local DateOnly/TimeOnly để so sánh với cột DATE/TIME trong DB
    var pickupLocal = (req.PickupTime ?? DateTimeOffset.Now).LocalDateTime;
    var day = DateOnly.FromDateTime(pickupLocal);
    var tod = TimeOnly.FromDateTime(pickupLocal);

    // Query bảng giá: đúng company/province/model, đang active và nằm trong khoảng ngày hiệu lực
    var q = _db.ModelPriceProvinces
               .AsNoTracking()
               .Where(x => x.CompanyId == req.CompanyId
                        && x.ProvinceId == req.ProvinceId
                        && x.ModelId == req.ModelId
                        && x.IsActive
                        && day >= x.DateStart && day <= x.DateEnd);

    // Lọc theo khung giờ (nếu bảng giá có cấu hình giờ)
    q = q.Where(x =>
        // Không cấu hình giờ -> áp dụng mọi lúc
        (x.TimeStart == null && x.TimeEnd == null)
        ||
        // Có đủ start & end:
        (
            x.TimeStart != null && x.TimeEnd != null &&
            (
                // Khung giờ bình thường: start <= end (vd 08:00-20:00)
                (x.TimeStart <= x.TimeEnd && tod >= x.TimeStart && tod <= x.TimeEnd)
                ||
                // Khung giờ qua đêm: start > end (vd 22:00-06:00)
                (x.TimeStart > x.TimeEnd && (tod >= x.TimeStart || tod <= x.TimeEnd))
            )
        )
    );

    // Ưu tiên record mới nhất theo DateStart
    var price = await q.OrderByDescending(x => x.DateStart).FirstOrDefaultAsync(ct);
    if (price == null)
        throw new InvalidOperationException("Không tìm thấy bảng giá phù hợp.");

    // Tính giá
    var kmFirst = Math.Min(req.TotalKm, 20m);
    var kmOver  = Math.Max(0m, req.TotalKm - 20m);

    var baseFare = price.OpeningFare
                  + kmFirst * price.RateFirst20Km
                  + kmOver  * price.RateOver20Km;

    var intercityFee = req.IntercityKm * price.IntercityRatePerKm;
    var trafficFee   = req.TrafficKm   * price.TrafficAddPerKm;
    var rainFee      = req.IsRaining   ? price.RainAddPerTrip : 0m;

    var otherFee = 0m; // nếu có phí chờ/phí khác thì cộng tại đây
    var total    = baseFare + intercityFee + trafficFee + rainFee + otherFee;

    // (tuỳ chọn) làm tròn 2 chữ số
    baseFare     = decimal.Round(baseFare, 2);
    intercityFee = decimal.Round(intercityFee, 2);
    trafficFee   = decimal.Round(trafficFee, 2);
    rainFee      = decimal.Round(rainFee, 2);
    otherFee     = decimal.Round(otherFee, 2);
    total        = decimal.Round(total, 2);

    return new QuoteResult(
        BaseFare: baseFare,
        IntercityFee: intercityFee,
        TrafficFee: trafficFee,
        RainFee: rainFee,
        OtherFee: otherFee,
        TotalAmount: total,
        PriceRefId: price.ModelPriceId
    );
}


        public async Task<DrivingOrder> CreateOrderAsync(DrivingOrder order, CancellationToken ct = default)
        {
            // Nếu client chưa tính giá, service tự tính
            if (order.TotalAmount <= 0)
            {
                var q = await QuoteAsync(new QuoteRequest(
                    order.CompanyId,
                    order.FromProvinceId,
                    order.ModelId,
                    order.TotalKm,
                    order.IntercityKm,
                    order.TrafficKm,
                    order.IsRaining,
                    order.WaitMinutes,
                    order.PickupTime
                ), ct);

                order.BaseFare            = q.BaseFare;
                order.IntercityFee        = q.IntercityFee;
                order.TrafficFee          = q.TrafficFee;
                order.RainFee             = q.RainFee;
                order.OtherFee            = q.OtherFee;
                order.TotalAmount         = q.TotalAmount;
                order.PriceRefId          = q.PriceRefId;
                order.CreatedAt           = DateTimeOffset.Now;
                order.Status              = OrderStatus.NEW;
            }

            await _orderRepo.AddAsync(order, ct);
            await _uow.SaveChangesAsync(ct);
            return order;
        }

        public Task<IReadOnlyList<DrivingOrder>> ListByStatusAsync(long companyId, OrderStatus status, CancellationToken ct = default)
            => _orderRepo.ListByCompanyAndStatusAsync(companyId, status, ct);

        public async Task<bool> AssignDriverAsync(long orderId, long driverAccountId, long? vehicleId, CancellationToken ct = default)
        {
            var order = await _orderRepo.GetByIdAsync(orderId, ct);
            if (order == null) return false;

            order.DriverAccountId = driverAccountId;
            order.VehicleId = vehicleId;
            order.Status = OrderStatus.ASSIGNED;
            order.UpdatedAt = DateTimeOffset.Now;

            _orderRepo.Update(order);
            return await _uow.SaveChangesAsync(ct) > 0;
        }

        public async Task<bool> CompleteOrderAsync(long orderId, DateTimeOffset dropoffTime, CancellationToken ct = default)
        {
            var order = await _orderRepo.GetByIdAsync(orderId, ct);
            if (order == null) return false;

            order.DropoffTime = dropoffTime;
            order.Status = OrderStatus.DONE;
            order.UpdatedAt = DateTimeOffset.Now;

            _orderRepo.Update(order);
            return await _uow.SaveChangesAsync(ct) > 0;
        }

        public async Task<bool> MarkPaidAsync(long orderId, PaymentMethod method, DateTimeOffset paidAt, CancellationToken ct = default)
        {
            var order = await _orderRepo.GetByIdAsync(orderId, ct);
            if (order == null) return false;

            order.PaymentMethod = method;
            order.PaidAt = paidAt;
            order.UpdatedAt = DateTimeOffset.Now;

            _orderRepo.Update(order);
            return await _uow.SaveChangesAsync(ct) > 0;
        }
    }
}
