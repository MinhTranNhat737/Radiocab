using Microsoft.EntityFrameworkCore;
using RadioCabs_BE.Data;
using RadioCabs_BE.DTOs;
using RadioCabs_BE.Models;
using RadioCabs_BE.Repositories;
using RadioCabs_BE.Repositories.Interfaces;
using RadioCabs_BE.Services.Interfaces;

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

        // ===== Interface methods =====

        public async Task<DrivingOrder?> GetAsync(long id, CancellationToken ct = default)
        {
            // Dùng repo nếu bạn muốn, ở đây mình gọi repo để tận dụng cache/hook (nếu có)
            return await _orderRepo.GetByIdAsync(id, ct);
        }

        public async Task<IReadOnlyList<DrivingOrder>> ListByCompanyAsync(
            long companyId,
            OrderStatus? status = null,
            DateTimeOffset? from = null,
            DateTimeOffset? to   = null,
            CancellationToken ct = default)
        {
            var q = _db.DrivingOrders.AsNoTracking()
                                     .Where(o => o.CompanyId == companyId);

            if (status.HasValue)
                q = q.Where(o => o.Status == status.Value);

            if (from.HasValue)
                q = q.Where(o => o.CreatedAt >= from.Value);

            if (to.HasValue)
                q = q.Where(o => o.CreatedAt <= to.Value);

            return await q.OrderByDescending(o => o.CreatedAt).ToListAsync(ct);
        }

        public async Task<long> CreateAsync(DrivingOrder order, CancellationToken ct = default)
        {
            // Nếu client chưa tính giá, tự quote trước khi lưu
            if (order.TotalAmount <= 0)
            {
                var quote = await QuoteAsync(new QuoteRequest(
                    CompanyId:   order.CompanyId,
                    ProvinceId:  order.FromProvinceId,
                    ModelId:     order.ModelId,
                    TotalKm:     order.TotalKm,
                    IntercityKm: order.IntercityKm,
                    TrafficKm:   order.TrafficKm,
                    IsRaining:   order.IsRaining,
                    PickupTime:  order.PickupTime
                ), ct);

                order.BaseFare     = quote.BaseFare;
                order.IntercityFee = quote.IntercityFee;
                order.TrafficFee   = quote.TrafficFee;
                order.RainFee      = quote.RainFee;
                order.OtherFee     = quote.OtherFee;
                order.TotalAmount  = quote.TotalAmount;
                order.PriceRefId   = quote.PriceRefId;
                order.CreatedAt    = DateTimeOffset.Now;
                order.Status       = OrderStatus.NEW;
            }

            await _orderRepo.AddAsync(order, ct);
            await _uow.SaveChangesAsync(ct);
            return order.OrderId;
        }

        public async Task UpdateStatusAsync(long orderId, OrderStatus status, CancellationToken ct = default)
        {
            var order = await _orderRepo.GetByIdAsync(orderId, ct);
            if (order == null) throw new KeyNotFoundException("Order not found");

            order.Status   = status;
            order.UpdatedAt = DateTimeOffset.Now;

            _orderRepo.Update(order);
            await _uow.SaveChangesAsync(ct);
        }

        public async Task<QuoteResult> QuoteAsync(QuoteRequest req, CancellationToken ct = default)
        {
            // Chuẩn hoá thời điểm đón về local DateOnly/TimeOnly để đối chiếu DATE/TIME trong DB
            var pickupLocal = (req.PickupTime ?? DateTimeOffset.Now).LocalDateTime;
            var day = DateOnly.FromDateTime(pickupLocal);
            var tod = TimeOnly.FromDateTime(pickupLocal);

            // Lấy bảng giá hiệu lực
            var q = _db.ModelPriceProvinces
                       .AsNoTracking()
                       .Where(x => x.CompanyId == req.CompanyId
                                && x.ProvinceId == req.ProvinceId
                                && x.ModelId == req.ModelId
                                && x.IsActive
                                && day >= x.DateStart && day <= x.DateEnd);

            // Theo khung giờ (hỗ trợ cả ca qua đêm)
            q = q.Where(x =>
                (x.TimeStart == null && x.TimeEnd == null)
                ||
                (x.TimeStart != null && x.TimeEnd != null &&
                 (
                     (x.TimeStart <= x.TimeEnd && tod >= x.TimeStart && tod <= x.TimeEnd) ||
                     (x.TimeStart  > x.TimeEnd && (tod >= x.TimeStart || tod <= x.TimeEnd))
                 ))
            );

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

            var otherFee = 0m; // nếu có phí chờ thì cộng tại đây
            var total    = baseFare + intercityFee + trafficFee + rainFee + otherFee;

            // Làm tròn (nếu muốn)
            baseFare     = decimal.Round(baseFare, 2);
            intercityFee = decimal.Round(intercityFee, 2);
            trafficFee   = decimal.Round(trafficFee, 2);
            rainFee      = decimal.Round(rainFee, 2);
            otherFee     = decimal.Round(otherFee, 2);
            total        = decimal.Round(total, 2);

            return new QuoteResult(
                BaseFare:     baseFare,
                IntercityFee: intercityFee,
                TrafficFee:   trafficFee,
                RainFee:      rainFee,
                OtherFee:     otherFee,
                TotalAmount:  total,
                PriceRefId:   price.ModelPriceId
            );
        }

        // ===== (Tuỳ chọn) Các helper ngoài interface, giữ lại nếu bạn còn dùng nơi khác =====

        public Task<IReadOnlyList<DrivingOrder>> ListByStatusAsync(
            long companyId, OrderStatus status, CancellationToken ct = default)
            => _orderRepo.ListByCompanyAndStatusAsync(companyId, status, ct);

        public async Task<bool> AssignDriverAsync(
            long orderId, long driverAccountId, long? vehicleId, CancellationToken ct = default)
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

        public async Task<bool> CompleteOrderAsync(
            long orderId, DateTimeOffset dropoffTime, CancellationToken ct = default)
        {
            var order = await _orderRepo.GetByIdAsync(orderId, ct);
            if (order == null) return false;

            order.DropoffTime = dropoffTime;
            order.Status = OrderStatus.DONE;
            order.UpdatedAt = DateTimeOffset.Now;

            _orderRepo.Update(order);
            return await _uow.SaveChangesAsync(ct) > 0;
        }

        public async Task<bool> MarkPaidAsync(
            long orderId, PaymentMethod method, DateTimeOffset paidAt, CancellationToken ct = default)
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
