using common.Models;
using common.Repositories;
using driving_service.Data;
using driving_service.DTOs;
using driving_service.Models;
using driving_service.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace driving_service.Services
{
    public class DrivingOrderService : IDrivingOrderService
    {
        private readonly IUnitOfWork<driving_serviceDBContext> _unitOfWork;

        public DrivingOrderService(IUnitOfWork<driving_serviceDBContext> unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<DrivingOrderDto?> GetByIdAsync(long id)
        {
            var order = await _unitOfWork.Repository<DrivingOrder>().Query()
                .Include(o => o.DriverSchedule)
                .FirstOrDefaultAsync(o => o.OrderId == id);
            
            return order != null ? MapToDrivingOrderDto(order) : null;
        }

        public async Task<PagedResult<DrivingOrderDto>> GetPagedAsync(PageRequest request)
        {
            var repository = _unitOfWork.Repository<DrivingOrder>();
            IQueryable<DrivingOrder> query = repository.Query()
                .Include(o => o.DriverSchedule);

            if (!string.IsNullOrEmpty(request.Search))
            {
                query = query.Where(o => o.PickupAddress!.Contains(request.Search) || o.DropoffAddress!.Contains(request.Search));
            }

            // Apply company filter if provided
            if (request.CompanyId.HasValue)
            {
                query = query.Where(o => o.CompanyId == request.CompanyId.Value);
            }

            var totalCount = await query.CountAsync();
            var items = await query
                .OrderByDescending(o => o.CreatedAt)
                .Skip((request.Page - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync();

            var dtoItems = items.Select(o => MapToDrivingOrderDto(o)).ToList();

            return new PagedResult<DrivingOrderDto>
            {
                Items = dtoItems,
                TotalCount = totalCount,
                Page = request.Page,
                PageSize = request.PageSize
            };
        }

        public async Task<DrivingOrderDto> CreateAsync(CreateDrivingOrderDto dto)
        {
            var order = new DrivingOrder
            {
                CompanyId = dto.CompanyId,
                CustomerAccountId = dto.CustomerAccountId,
                VehicleId = dto.VehicleId,
                DriverAccountId = dto.DriverAccountId,
                ModelId = dto.ModelId,
                PriceRefId = dto.PriceRefId,
                DriverScheduleId = dto.DriverScheduleId,
                FromProvinceId = dto.FromProvinceId,
                ToProvinceId = dto.ToProvinceId,
                PickupAddress = dto.PickupAddress,
                DropoffAddress = dto.DropoffAddress,
                PickupTime = dto.PickupTime,
                Status = OrderStatus.NEW,
                TotalKm = dto.TotalKm ?? 0,
                InnerCityKm = dto.InnerCityKm ?? 0,
                IntercityKm = dto.IntercityKm ?? 0,
                TrafficKm = dto.TrafficKm ?? 0,
                IsRaining = dto.IsRaining,
                WaitMinutes = dto.WaitMinutes,
                BaseFare = dto.BaseFare ?? 0,
                TrafficUnitPrice = dto.TrafficUnitPrice ?? 0,
                TrafficFee = dto.TrafficFee ?? 0,
                RainFee = dto.RainFee ?? 0,
                IntercityUnitPrice = dto.IntercityUnitPrice ?? 0,
                IntercityFee = dto.IntercityFee ?? 0,
                OtherFee = dto.OtherFee ?? 0,
                TotalAmount = dto.TotalAmount ?? 0,
                PaymentMethod = dto.PaymentMethod,
                CreatedAt = DateTimeOffset.UtcNow
            };

            // If price not provided, calculate it
            if (order.BaseFare == 0 && order.PriceRefId == null)
            {
                order.BaseFare = await CalculateBaseFare(dto.ModelId, dto.FromProvinceId);
            }

            await _unitOfWork.Repository<DrivingOrder>().AddAsync(order);
            await _unitOfWork.SaveChangesAsync();

            return MapToDrivingOrderDto(order);
        }

        public async Task<DrivingOrderDto?> UpdateAsync(long id, UpdateDrivingOrderDto dto)
        {
            var order = await _unitOfWork.Repository<DrivingOrder>().GetByIdAsync(id);
            if (order == null) return null;

            if (dto.VehicleId.HasValue) order.VehicleId = dto.VehicleId.Value;
            if (dto.DriverAccountId.HasValue) order.DriverAccountId = dto.DriverAccountId.Value;
            if (dto.PickupAddress != null) order.PickupAddress = dto.PickupAddress;
            if (dto.DropoffAddress != null) order.DropoffAddress = dto.DropoffAddress;
            if (dto.PickupTime.HasValue) order.PickupTime = dto.PickupTime.Value;
            if (dto.DropoffTime.HasValue) order.DropoffTime = dto.DropoffTime.Value;
            if (dto.Status.HasValue) order.Status = dto.Status.Value;
            if (dto.TotalKm.HasValue) order.TotalKm = dto.TotalKm.Value;
            if (dto.InnerCityKm.HasValue) order.InnerCityKm = dto.InnerCityKm.Value;
            if (dto.IntercityKm.HasValue) order.IntercityKm = dto.IntercityKm.Value;
            if (dto.TrafficKm.HasValue) order.TrafficKm = dto.TrafficKm.Value;
            if (dto.IsRaining.HasValue) order.IsRaining = dto.IsRaining.Value;
            if (dto.WaitMinutes.HasValue) order.WaitMinutes = dto.WaitMinutes.Value;
            if (dto.BaseFare.HasValue) order.BaseFare = dto.BaseFare.Value;
            if (dto.TrafficUnitPrice.HasValue) order.TrafficUnitPrice = dto.TrafficUnitPrice.Value;
            if (dto.TrafficFee.HasValue) order.TrafficFee = dto.TrafficFee.Value;
            if (dto.RainFee.HasValue) order.RainFee = dto.RainFee.Value;
            if (dto.IntercityUnitPrice.HasValue) order.IntercityUnitPrice = dto.IntercityUnitPrice.Value;
            if (dto.IntercityFee.HasValue) order.IntercityFee = dto.IntercityFee.Value;
            if (dto.OtherFee.HasValue) order.OtherFee = dto.OtherFee.Value;
            if (dto.TotalAmount.HasValue) order.TotalAmount = dto.TotalAmount.Value;
            if (dto.FareBreakdown != null) order.FareBreakdown = dto.FareBreakdown;
            if (dto.PaymentMethod.HasValue) order.PaymentMethod = dto.PaymentMethod.Value;
            if (dto.PaidAt.HasValue) order.PaidAt = dto.PaidAt.Value;
            order.UpdatedAt = DateTimeOffset.UtcNow;

            _unitOfWork.Repository<DrivingOrder>().Update(order);
            await _unitOfWork.SaveChangesAsync();

            return MapToDrivingOrderDto(order);
        }

        public async Task<bool> DeleteAsync(long id)
        {
            var order = await _unitOfWork.Repository<DrivingOrder>().GetByIdAsync(id);
            if (order == null) return false;

            _unitOfWork.Repository<DrivingOrder>().Remove(order);
            await _unitOfWork.SaveChangesAsync();

            return true;
        }

        public async Task<PagedResult<DrivingOrderDto>> GetByDriverAsync(long driverId, PageRequest request)
        {
            var repository = _unitOfWork.Repository<DrivingOrder>();
            var query = repository.FindAsync(o => o.DriverAccountId == driverId).Result.AsQueryable();

            var totalCount = await repository.CountAsync(o => o.DriverAccountId == driverId);
            var items = query
                .OrderByDescending(o => o.CreatedAt)
                .Skip((request.Page - 1) * request.PageSize)
                .Take(request.PageSize)
                .Select(o => MapToDrivingOrderDto(o))
                .ToList();

            return new PagedResult<DrivingOrderDto>
            {
                Items = items,
                TotalCount = totalCount,
                Page = request.Page,
                PageSize = request.PageSize
            };
        }

        public async Task<PagedResult<DrivingOrderDto>> GetByCustomerAsync(long customerId, PageRequest request)
        {
            var repository = _unitOfWork.Repository<DrivingOrder>();
            var query = repository.FindAsync(o => o.CustomerAccountId == customerId).Result.AsQueryable();

            var totalCount = await repository.CountAsync(o => o.CustomerAccountId == customerId);
            var items = query
                .OrderByDescending(o => o.CreatedAt)
                .Skip((request.Page - 1) * request.PageSize)
                .Take(request.PageSize)
                .Select(o => MapToDrivingOrderDto(o))
                .ToList();

            return new PagedResult<DrivingOrderDto>
            {
                Items = items,
                TotalCount = totalCount,
                Page = request.Page,
                PageSize = request.PageSize
            };
        }

        public async Task<DrivingOrderDto?> AssignDriverAsync(long orderId, long driverId, long vehicleId, long? driverScheduleId = null)
        {
            var order = await _unitOfWork.Repository<DrivingOrder>().GetByIdAsync(orderId);
            if (order == null) return null;

            // If driverScheduleId is provided, use it; otherwise find the schedule
            if (!driverScheduleId.HasValue)
            {
                var today = DateOnly.FromDateTime(DateTime.Today);
                var driverSchedule = await _unitOfWork.Repository<DriverSchedule>()
                    .SingleOrDefaultAsync(ds => 
                        ds.DriverAccountId == driverId &&
                        ds.VehicleId == vehicleId &&
                        ds.WorkDate == today &&
                        (ds.Status == ShiftStatus.ON || ds.Status == ShiftStatus.PLANNED)
                    );
                driverScheduleId = driverSchedule?.ScheduleId;
            }

            order.DriverAccountId = driverId;
            order.VehicleId = vehicleId;
            order.DriverScheduleId = driverScheduleId;
            order.Status = OrderStatus.ASSIGNED;
            order.UpdatedAt = DateTimeOffset.UtcNow;

            _unitOfWork.Repository<DrivingOrder>().Update(order);
            await _unitOfWork.SaveChangesAsync();

            return MapToDrivingOrderDto(order);
        }

        public async Task<DrivingOrderDto?> UpdateStatusAsync(long orderId, OrderStatus status)
        {
            var order = await _unitOfWork.Repository<DrivingOrder>().GetByIdAsync(orderId);
            if (order == null) return null;

            order.Status = status;
            order.UpdatedAt = DateTimeOffset.UtcNow;

            _unitOfWork.Repository<DrivingOrder>().Update(order);
            await _unitOfWork.SaveChangesAsync();

            return MapToDrivingOrderDto(order);
        }

        public async Task<DrivingOrderDto?> CompleteOrderAsync(long orderId, decimal totalKm, decimal innerCityKm, decimal intercityKm, decimal trafficKm, bool isRaining, int waitMinutes)
        {
            var order = await _unitOfWork.Repository<DrivingOrder>().GetByIdAsync(orderId);
            if (order == null) return null;

            order.TotalKm = totalKm;
            order.InnerCityKm = innerCityKm;
            order.IntercityKm = intercityKm;
            order.TrafficKm = trafficKm;
            order.IsRaining = isRaining;
            order.WaitMinutes = waitMinutes;
            order.Status = OrderStatus.DONE;
            order.DropoffTime = DateTimeOffset.UtcNow;
            order.UpdatedAt = DateTimeOffset.UtcNow;

            // Calculate total amount
            order.TotalAmount = await CalculateTotalAmount(order);

            _unitOfWork.Repository<DrivingOrder>().Update(order);
            await _unitOfWork.SaveChangesAsync();

            return MapToDrivingOrderDto(order);
        }

        public async Task<DrivingOrderDto?> CancelOrderAsync(long orderId, string reason)
        {
            var order = await _unitOfWork.Repository<DrivingOrder>().GetByIdAsync(orderId);
            if (order == null) return null;

            order.Status = OrderStatus.CANCELLED;
            order.UpdatedAt = DateTimeOffset.UtcNow;

            _unitOfWork.Repository<DrivingOrder>().Update(order);
            await _unitOfWork.SaveChangesAsync();

            return MapToDrivingOrderDto(order);
        }

        private async Task<decimal> CalculateBaseFare(long modelId, long provinceId)
        {
            //// Get the most recent price for this model in this province
            //var price = await _unitOfWork.Repository<ModelPriceProvince>()
            //    .SingleOrDefaultAsync(p => p.ModelId == modelId && p.ProvinceId == provinceId && p.IsActive);

            //return "price" ?.OpeningFare ?? 0;
            return 0;
        }

        private async Task<decimal> CalculateTotalAmount(DrivingOrder order)
        {
            //var price = await _unitOfWork.Repository<ModelPriceProvince>()
            //    .SingleOrDefaultAsync(p => p.ModelId == order.ModelId && p.ProvinceId == order.FromProvinceId && p.IsActive);

            //if (price == null) return 0;

            //var totalAmount = price.OpeningFare;

            //// Add distance-based fare
            //if (order.InnerCityKm > 0)
            //{
            //    totalAmount += order.InnerCityKm * price.RateFirst20Km;
            //}

            //if (order.IntercityKm > 0)
            //{
            //    totalAmount += order.IntercityKm * price.IntercityRatePerKm;
            //}

            //if (order.TrafficKm > 0)
            //{
            //    totalAmount += order.TrafficKm * price.TrafficAddPerKm;
            //}

            //if (order.IsRaining)
            //{
            //    totalAmount += price.RainAddPerTrip;
            //}

            //return totalAmount;
            return 0;
        }

        private DrivingOrderDto MapToDrivingOrderDto(DrivingOrder order)
        {
            return new DrivingOrderDto
            {
                OrderId = order.OrderId,
                CompanyId = order.CompanyId,
                CustomerAccountId = order.CustomerAccountId,
                VehicleId = order.VehicleId,
                DriverAccountId = order.DriverAccountId,
                ModelId = order.ModelId,
                PriceRefId = order.PriceRefId,
                DriverScheduleId = order.DriverScheduleId,
                FromProvinceId = order.FromProvinceId,
                ToProvinceId = order.ToProvinceId,
                PickupAddress = order.PickupAddress,
                DropoffAddress = order.DropoffAddress,
                PickupTime = order.PickupTime,
                DropoffTime = order.DropoffTime,
                Status = order.Status,
                TotalKm = order.TotalKm,
                InnerCityKm = order.InnerCityKm,
                IntercityKm = order.IntercityKm,
                TrafficKm = order.TrafficKm,
                IsRaining = order.IsRaining,
                WaitMinutes = order.WaitMinutes,
                BaseFare = order.BaseFare,
                TrafficUnitPrice = order.TrafficUnitPrice,
                TrafficFee = order.TrafficFee,
                RainFee = order.RainFee,
                IntercityUnitPrice = order.IntercityUnitPrice,
                IntercityFee = order.IntercityFee,
                OtherFee = order.OtherFee,
                TotalAmount = order.TotalAmount,
                FareBreakdown = order.FareBreakdown,
                PaymentMethod = order.PaymentMethod,
                PaidAt = order.PaidAt,
                CreatedAt = order.CreatedAt,
                UpdatedAt = order.UpdatedAt,
                DriverSchedule = order.DriverSchedule != null ? new DriverScheduleDto
                {
                    ScheduleId = order.DriverSchedule.ScheduleId,
                    DriverAccountId = order.DriverSchedule.DriverAccountId,
                    WorkDate = order.DriverSchedule.WorkDate,
                    StartTime = order.DriverSchedule.StartTime,
                    EndTime = order.DriverSchedule.EndTime,
                    VehicleId = order.DriverSchedule.VehicleId,
                    Status = order.DriverSchedule.Status,
                    Note = order.DriverSchedule.Note,
                    CreatedAt = order.DriverSchedule.CreatedAt,
                    UpdatedAt = order.DriverSchedule.UpdatedAt,
                } : null
            };
        }
    }
}