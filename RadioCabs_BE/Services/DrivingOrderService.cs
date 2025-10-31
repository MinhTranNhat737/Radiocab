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
            var order = await _unitOfWork.Repository<DrivingOrder>().Query()
                .Include(o => o.Customer)
                .Include(o => o.Driver)
                .Include(o => o.Vehicle)
                .Include(o => o.Model)
                .Include(o => o.FromProvince)
                .Include(o => o.ToProvince)
                .Include(o => o.PriceRef)
                    .ThenInclude(p => p.Province)
                .Include(o => o.PriceRef)
                    .ThenInclude(p => p.Model)
                .Include(o => o.DriverSchedule)
                    .ThenInclude(s => s.Driver)
                .Include(o => o.DriverSchedule)
                    .ThenInclude(s => s.Vehicle)
                .FirstOrDefaultAsync(o => o.OrderId == id);
            
            return order != null ? MapToDrivingOrderDto(order) : null;
        }

        public async Task<PagedResult<DrivingOrderDto>> GetPagedAsync(PageRequest request)
        {
            var repository = _unitOfWork.Repository<DrivingOrder>();
            IQueryable<DrivingOrder> query = repository.Query()
                .Include(o => o.Customer)
                .Include(o => o.Driver)
                .Include(o => o.Vehicle)
                .Include(o => o.Model)
                .Include(o => o.FromProvince)
                .Include(o => o.ToProvince)
                .Include(o => o.PriceRef)
                    .ThenInclude(p => p.Province)
                .Include(o => o.PriceRef)
                    .ThenInclude(p => p.Model)
                .Include(o => o.DriverSchedule)
                    .ThenInclude(s => s.Driver)
                .Include(o => o.DriverSchedule)
                    .ThenInclude(s => s.Vehicle);

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
                        ds.Status == RadioCabs_BE.Models.ShiftStatus.ON
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
            // If driver starts the trip, stamp pickup time when transitioning to ONGOING
            if (status == OrderStatus.ONGOING && !order.PickupTime.HasValue)
            {
                order.PickupTime = DateTimeOffset.UtcNow;
            }

            // When driver accepts an order, mark the driver schedule as WORKING
            if (status == OrderStatus.ACCEPTED && order.DriverScheduleId.HasValue)
            {
                var schedule = await _unitOfWork.Repository<DriverSchedule>().GetByIdAsync(order.DriverScheduleId.Value);
                if (schedule != null)
                {
                    schedule.Status = ShiftStatus.WORKING;
                    _unitOfWork.Repository<DriverSchedule>().Update(schedule);
                }
            }
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

            // When completing, set schedule to ON if still within shift; COMPLETED if after shift
            if (order.DriverScheduleId.HasValue)
            {
                var schedule = await _unitOfWork.Repository<DriverSchedule>().GetByIdAsync(order.DriverScheduleId.Value);
                if (schedule != null)
                {
                    var now = DateTime.Now; // local time
                    var scheduleDate = new DateTime(schedule.WorkDate.Year, schedule.WorkDate.Month, schedule.WorkDate.Day,
                        0, 0, 0, DateTimeKind.Local);
                    var startDt = scheduleDate.AddHours(schedule.StartTime.Hour).AddMinutes(schedule.StartTime.Minute).AddSeconds(schedule.StartTime.Second);
                    var endDt = scheduleDate.AddHours(schedule.EndTime.Hour).AddMinutes(schedule.EndTime.Minute).AddSeconds(schedule.EndTime.Second);

                    if (now < startDt) schedule.Status = ShiftStatus.PLANNED;
                    else if (now >= startDt && now < endDt) schedule.Status = ShiftStatus.ON;
                    else schedule.Status = ShiftStatus.COMPLETED;
                    _unitOfWork.Repository<DriverSchedule>().Update(schedule);
                }
            }

            _unitOfWork.Repository<DrivingOrder>().Update(order);
            await _unitOfWork.SaveChangesAsync();

            return MapToDrivingOrderDto(order);
        }

        public async Task<DrivingOrderDto?> CancelOrderAsync(long orderId, string reason)
        {
            var order = await _unitOfWork.Repository<DrivingOrder>().GetByIdAsync(orderId);
            if (order == null) return null;

            order.Status = OrderStatus.CANCELLED;
            // Business rule: canceled orders should have zero total amount
            order.TotalAmount = 0;
            order.UpdatedAt = DateTimeOffset.UtcNow;

            // When canceling, set schedule based on current time vs shift
            if (order.DriverScheduleId.HasValue)
            {
                var schedule = await _unitOfWork.Repository<DriverSchedule>().GetByIdAsync(order.DriverScheduleId.Value);
                if (schedule != null)
                {
                    var now = DateTime.Now; // local time
                    var scheduleDate = new DateTime(schedule.WorkDate.Year, schedule.WorkDate.Month, schedule.WorkDate.Day,
                        0, 0, 0, DateTimeKind.Local);
                    var startDt = scheduleDate.AddHours(schedule.StartTime.Hour).AddMinutes(schedule.StartTime.Minute).AddSeconds(schedule.StartTime.Second);
                    var endDt = scheduleDate.AddHours(schedule.EndTime.Hour).AddMinutes(schedule.EndTime.Minute).AddSeconds(schedule.EndTime.Second);

                    if (now < startDt) schedule.Status = ShiftStatus.PLANNED;
                    else if (now >= startDt && now < endDt) schedule.Status = ShiftStatus.ON;
                    else schedule.Status = ShiftStatus.COMPLETED;
                    _unitOfWork.Repository<DriverSchedule>().Update(schedule);
                }
            }

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
            ModelPriceProvince? price = null;

            // 1) Prefer explicitly selected price reference if available
            if (order.PriceRefId.HasValue)
            {
                price = await _unitOfWork.Repository<ModelPriceProvince>()
                    .GetByIdAsync(order.PriceRefId.Value);
            }

            // 2) Fallback to current active price by model/province
            if (price == null)
            {
                price = await _unitOfWork.Repository<ModelPriceProvince>()
                    .SingleOrDefaultAsync(p => p.ModelId == order.ModelId && p.ProvinceId == order.FromProvinceId && p.IsActive);
            }

            // 3) If still missing, fallback to order.BaseFare only
            if (price == null)
            {
                return order.BaseFare;
            }

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
                } : null,
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
                    Driver = order.DriverSchedule.Driver != null ? new AccountDto
                    {
                        AccountId = order.DriverSchedule.Driver.AccountId,
                        CompanyId = order.DriverSchedule.Driver.CompanyId,
                        Username = order.DriverSchedule.Driver.Username,
                        FullName = order.DriverSchedule.Driver.FullName,
                        Phone = order.DriverSchedule.Driver.Phone,
                        Email = order.DriverSchedule.Driver.Email,
                        Role = order.DriverSchedule.Driver.Role,
                        Status = order.DriverSchedule.Driver.Status,
                        CreatedAt = order.DriverSchedule.Driver.CreatedAt,
                        UpdatedAt = order.DriverSchedule.Driver.UpdatedAt,
                        EmailVerifiedAt = order.DriverSchedule.Driver.EmailVerifiedAt
                    } : null,
                    Vehicle = order.DriverSchedule.Vehicle != null ? new VehicleDto
                    {
                        VehicleId = order.DriverSchedule.Vehicle.VehicleId,
                        CompanyId = order.DriverSchedule.Vehicle.CompanyId,
                        ModelId = order.DriverSchedule.Vehicle.ModelId,
                        PlateNumber = order.DriverSchedule.Vehicle.PlateNumber,
                        Vin = order.DriverSchedule.Vehicle.Vin,
                        Color = order.DriverSchedule.Vehicle.Color,
                        YearManufactured = order.DriverSchedule.Vehicle.YearManufactured,
                        InServiceFrom = order.DriverSchedule.Vehicle.InServiceFrom,
                        OdometerKm = order.DriverSchedule.Vehicle.OdometerKm,
                        Status = order.DriverSchedule.Vehicle.Status
                    } : null
                } : null,
                PriceRef = order.PriceRef != null ? new ModelPriceProvinceDto
                {
                    ModelPriceId = order.PriceRef.ModelPriceId,
                    CompanyId = order.PriceRef.CompanyId,
                    ProvinceId = order.PriceRef.ProvinceId,
                    ModelId = order.PriceRef.ModelId,
                    OpeningFare = order.PriceRef.OpeningFare,
                    RateFirst20Km = order.PriceRef.RateFirst20Km,
                    RateOver20Km = order.PriceRef.RateOver20Km,
                    TrafficAddPerKm = order.PriceRef.TrafficAddPerKm,
                    RainAddPerTrip = order.PriceRef.RainAddPerTrip,
                    IntercityRatePerKm = order.PriceRef.IntercityRatePerKm,
                    TimeStart = order.PriceRef.TimeStart,
                    TimeEnd = order.PriceRef.TimeEnd,
                    DateStart = order.PriceRef.DateStart,
                    DateEnd = order.PriceRef.DateEnd,
                    IsActive = order.PriceRef.IsActive,
                    Note = order.PriceRef.Note,
                    Province = order.PriceRef.Province != null ? new ProvinceDto
                    {
                        ProvinceId = order.PriceRef.Province.ProvinceId,
                        Code = order.PriceRef.Province.Code,
                        Name = order.PriceRef.Province.Name
                    } : null,
                    Model = order.PriceRef.Model != null ? new VehicleModelDto
                    {
                        ModelId = order.PriceRef.Model.ModelId,
                        CompanyId = order.PriceRef.Model.CompanyId,
                        SegmentId = order.PriceRef.Model.SegmentId,
                        Brand = order.PriceRef.Model.Brand,
                        ModelName = order.PriceRef.Model.ModelName,
                        FuelType = order.PriceRef.Model.FuelType,
                        SeatCategory = order.PriceRef.Model.SeatCategory,
                        ImageUrl = order.PriceRef.Model.ImageUrl,
                        Description = order.PriceRef.Model.Description,
                        IsActive = order.PriceRef.Model.IsActive
                    } : null
                } : null
            };
        }
    }
}