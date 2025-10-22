using Microsoft.EntityFrameworkCore;
using RadioCabs_BE.DTOs;
using RadioCabs_BE.Models;
using RadioCabs_BE.Repositories;
using RadioCabs_BE.Services.Interfaces;

namespace RadioCabs_BE.Services
{
    public class DrivingOrderService : IDrivingOrderService
    {
        private readonly IUnitOfWork _unitOfWork;

        public DrivingOrderService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<DrivingOrderDto?> GetByIdAsync(long id)
        {
            var order = await _unitOfWork.Repository<DrivingOrder>().GetByIdAsync(id);
            return order != null ? MapToDrivingOrderDto(order) : null;
        }

        public async Task<PagedResult<DrivingOrderDto>> GetPagedAsync(PageRequest request)
        {
            var repository = _unitOfWork.Repository<DrivingOrder>();
            var query = repository.FindAsync(o => true).Result.AsQueryable();

            if (!string.IsNullOrEmpty(request.Search))
            {
                query = query.Where(o => o.PickupAddress!.Contains(request.Search) || o.DropoffAddress!.Contains(request.Search));
            }

            var totalCount = await repository.CountAsync();
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

        public async Task<DrivingOrderDto> CreateAsync(CreateDrivingOrderDto dto)
        {
            var order = new DrivingOrder
            {
                CompanyId = dto.CompanyId,
                CustomerAccountId = dto.CustomerAccountId,
                VehicleId = dto.VehicleId,
                DriverAccountId = dto.DriverAccountId,
                ModelId = dto.ModelId,
                FromProvinceId = dto.FromProvinceId,
                ToProvinceId = dto.ToProvinceId,
                PickupAddress = dto.PickupAddress,
                DropoffAddress = dto.DropoffAddress,
                PickupTime = dto.PickupTime,
                Status = OrderStatus.NEW,
                IsRaining = dto.IsRaining,
                WaitMinutes = dto.WaitMinutes,
                PaymentMethod = dto.PaymentMethod,
                CreatedAt = DateTimeOffset.UtcNow
            };

            // Calculate base fare (simplified calculation)
            order.BaseFare = await CalculateBaseFare(dto.ModelId, dto.FromProvinceId);

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

        public async Task<DrivingOrderDto?> AssignDriverAsync(long orderId, long driverId, long vehicleId)
        {
            var order = await _unitOfWork.Repository<DrivingOrder>().GetByIdAsync(orderId);
            if (order == null) return null;

            order.DriverAccountId = driverId;
            order.VehicleId = vehicleId;
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
            // Get the most recent price for this model in this province
            var price = await _unitOfWork.Repository<ModelPriceProvince>()
                .SingleOrDefaultAsync(p => p.ModelId == modelId && p.ProvinceId == provinceId && p.IsActive);

            return price?.OpeningFare ?? 0;
        }

        private async Task<decimal> CalculateTotalAmount(DrivingOrder order)
        {
            var price = await _unitOfWork.Repository<ModelPriceProvince>()
                .SingleOrDefaultAsync(p => p.ModelId == order.ModelId && p.ProvinceId == order.FromProvinceId && p.IsActive);

            if (price == null) return 0;

            var totalAmount = price.OpeningFare;
            
            // Add distance-based fare
            if (order.InnerCityKm > 0)
            {
                totalAmount += order.InnerCityKm * price.RateFirst20Km;
            }
            
            if (order.IntercityKm > 0)
            {
                totalAmount += order.IntercityKm * price.IntercityRatePerKm;
            }
            
            if (order.TrafficKm > 0)
            {
                totalAmount += order.TrafficKm * price.TrafficAddPerKm;
            }
            
            if (order.IsRaining)
            {
                totalAmount += price.RainAddPerTrip;
            }

            return totalAmount;
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
                Customer = order.Customer != null ? new AccountDto
                {
                    AccountId = order.Customer.AccountId,
                    CompanyId = order.Customer.CompanyId,
                    Username = order.Customer.Username,
                    FullName = order.Customer.FullName,
                    Phone = order.Customer.Phone,
                    Email = order.Customer.Email,
                    Role = order.Customer.Role,
                    Status = order.Customer.Status,
                    CreatedAt = order.Customer.CreatedAt,
                    UpdatedAt = order.Customer.UpdatedAt,
                    EmailVerifiedAt = order.Customer.EmailVerifiedAt
                } : null,
                Driver = order.Driver != null ? new AccountDto
                {
                    AccountId = order.Driver.AccountId,
                    CompanyId = order.Driver.CompanyId,
                    Username = order.Driver.Username,
                    FullName = order.Driver.FullName,
                    Phone = order.Driver.Phone,
                    Email = order.Driver.Email,
                    Role = order.Driver.Role,
                    Status = order.Driver.Status,
                    CreatedAt = order.Driver.CreatedAt,
                    UpdatedAt = order.Driver.UpdatedAt,
                    EmailVerifiedAt = order.Driver.EmailVerifiedAt
                } : null,
                Vehicle = order.Vehicle != null ? new VehicleDto
                {
                    VehicleId = order.Vehicle.VehicleId,
                    CompanyId = order.Vehicle.CompanyId,
                    ModelId = order.Vehicle.ModelId,
                    PlateNumber = order.Vehicle.PlateNumber,
                    Vin = order.Vehicle.Vin,
                    Color = order.Vehicle.Color,
                    YearManufactured = order.Vehicle.YearManufactured,
                    InServiceFrom = order.Vehicle.InServiceFrom,
                    OdometerKm = order.Vehicle.OdometerKm,
                    Status = order.Vehicle.Status
                } : null,
                Model = order.Model != null ? new VehicleModelDto
                {
                    ModelId = order.Model.ModelId,
                    CompanyId = order.Model.CompanyId,
                    SegmentId = order.Model.SegmentId,
                    Brand = order.Model.Brand,
                    ModelName = order.Model.ModelName,
                    FuelType = order.Model.FuelType,
                    SeatCategory = order.Model.SeatCategory,
                    ImageUrl = order.Model.ImageUrl,
                    Description = order.Model.Description,
                    IsActive = order.Model.IsActive
                } : null,
                FromProvince = order.FromProvince != null ? new ProvinceDto
                {
                    ProvinceId = order.FromProvince.ProvinceId,
                    Code = order.FromProvince.Code,
                    Name = order.FromProvince.Name
                } : null,
                ToProvince = order.ToProvince != null ? new ProvinceDto
                {
                    ProvinceId = order.ToProvince.ProvinceId,
                    Code = order.ToProvince.Code,
                    Name = order.ToProvince.Name
                } : null
            };
        }
    }
}