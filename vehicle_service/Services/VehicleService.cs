using common.Repositories;
using Microsoft.EntityFrameworkCore;
using Npgsql;
using System.Security.Principal;
using vehicle_service.Data;
using common.Models;
using vehicle_service.DTOs;
using vehicle_service.Models;
using vehicle_service.Services.Interfaces;

namespace vehicle_service.Services
{
    public class VehicleService : IVehicleService
    {
        private readonly IUnitOfWork<vehicle_serviceDBContext> _unitOfWork;
        private readonly DbContext _context;
        private readonly ILogger<VehicleService> _logger;

        public VehicleService(IUnitOfWork<vehicle_serviceDBContext> unitOfWork, DbContext context, ILogger<VehicleService> logger)
        {
            _unitOfWork = unitOfWork;
            _context = context;
            _logger = logger;
        }

        // Vehicle methods
        public async Task<VehicleDto?> GetVehicleByIdAsync(long id)
        {
            var vehicles = await _unitOfWork.Repository<Vehicle>().Query()
             .Include(v => v.VehicleZonePreferences)
             .Include(v => v.VehicleInProvinces)
             .Include(v => v.Model)
             .FirstOrDefaultAsync(o => o.VehicleId == id);
            return vehicles != null ? MapToVehicleDto(vehicles) : null;
        }

        public async Task<PagedResult<VehicleDto>> GetVehiclesPagedAsync(PageRequest request, long? companyId = null)
        {
            var query = _unitOfWork.Repository<Vehicle>().Query();

            // Include the Model navigation property with Segment
            query = query.Include(v => v.Model).ThenInclude(m => m.Segment);

            // Include VehicleZonePreferences for zone filtering and display
            query = query.Include(v => v.VehicleZonePreferences);
            

            // Filter by company if provided
            if (companyId.HasValue)
            {
                query = query.Where(v => v.CompanyId == companyId.Value);
            }

            if (!string.IsNullOrEmpty(request.Search))
            {
                query = query.Where(v => v.PlateNumber.Contains(request.Search) || v.Vin!.Contains(request.Search));
            }

            // Filter by province
            if (request.ProvinceId.HasValue)
            {
                query = query.Where(v => v.VehicleInProvinces.Any(vip => vip.ProvinceId == request.ProvinceId.Value));
            }

            // Filter by zone
            if (request.ZoneId.HasValue)
            {
                query = query.Where(v => v.VehicleZonePreferences.Any(vzp => vzp.ZoneId == request.ZoneId.Value));
            }


            var totalCount = await query.CountAsync();
            
            // Materialize the query first
            var vehicles = await query
                .Skip((request.Page - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync();

            // Then map to DTOs
            var items = vehicles.Select(v => MapToVehicleDto(v)).ToList();

            return new PagedResult<VehicleDto>
            {
                Items = items,
                TotalCount = totalCount,
                Page = request.Page,
                PageSize = request.PageSize
            };
        }

        public async Task<VehicleDto> CreateVehicleAsync(CreateVehicleDto dto)
        {
            var vehicle = new Vehicle
            {
                CompanyId = dto.CompanyId,
                ModelId = dto.ModelId,
                PlateNumber = dto.PlateNumber,
                Vin = dto.Vin,
                Color = dto.Color,
                YearManufactured = dto.YearManufactured,
                InServiceFrom = dto.InServiceFrom,
                OdometerKm = dto.OdometerKm,
                Status = ActiveFlag.ACTIVE
            };

            await _unitOfWork.Repository<Vehicle>().AddAsync(vehicle);
            await _unitOfWork.SaveChangesAsync();

            return MapToVehicleDto(vehicle);
        }

        public async Task<VehicleDto?> UpdateVehicleAsync(long id, UpdateVehicleDto dto)
        {
            var vehicle = await _unitOfWork.Repository<Vehicle>().GetByIdAsync(id);
            if (vehicle == null) return null;

            vehicle.ModelId = dto.ModelId;
            vehicle.PlateNumber = dto.PlateNumber;
            if (dto.Vin != null) vehicle.Vin = dto.Vin;
            if (dto.Color != null) vehicle.Color = dto.Color;
            if (dto.YearManufactured.HasValue) vehicle.YearManufactured = dto.YearManufactured.Value;
            vehicle.InServiceFrom = dto.InServiceFrom;
            vehicle.OdometerKm = dto.OdometerKm;
            vehicle.Status = dto.Status;

            _unitOfWork.Repository<Vehicle>().Update(vehicle);
            await _unitOfWork.SaveChangesAsync();

            return MapToVehicleDto(vehicle);
        }

        public async Task<bool> DeleteVehicleAsync(long id)
        {
            var vehicle = await _unitOfWork.Repository<Vehicle>().GetByIdAsync(id);
            if (vehicle == null) return false;

            _unitOfWork.Repository<Vehicle>().Remove(vehicle);
            await _unitOfWork.SaveChangesAsync();

            return true;
        }

        // VehicleModel methods
        public async Task<VehicleModelDto?> GetModelByIdAsync(long id)
        {
            var model = await _unitOfWork.Repository<VehicleModel>().GetByIdAsync(id);
            return model != null ? MapToVehicleModelDto(model) : null;
        }

        public async Task<PagedResult<VehicleModelDto>> GetModelsPagedAsync(PageRequest request, long? companyId = null)
        {

            var query = _unitOfWork.Repository<VehicleModel>().Query().AsQueryable();


            if (!string.IsNullOrEmpty(request.Search))
            {
                query = query.Where(m => m.Brand.Contains(request.Search) || m.ModelName.Contains(request.Search));
            }

            var totalCount = await query.CountAsync();
            var items = await query
                .Skip((request.Page - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync();

            var dtos = items.Select(m => MapToVehicleModelDto(m)).ToList();

            return new PagedResult<VehicleModelDto>
            {
                Items = dtos,
                TotalCount = totalCount,
                Page = request.Page,
                PageSize = request.PageSize
            };
        }

        public async Task<VehicleModelDto> CreateModelAsync(CreateVehicleModelDto dto)
        {
            var model = new VehicleModel
            {
                CompanyId = dto.CompanyId,
                SegmentId = dto.SegmentId,
                Brand = dto.Brand,
                ModelName = dto.ModelName,
                FuelType = dto.FuelType,
                SeatCategory = dto.SeatCategory,
                ImageUrl = dto.ImageUrl,
                Description = dto.Description,
                IsActive = true
            };

            await _unitOfWork.Repository<VehicleModel>().AddAsync(model);
            await _unitOfWork.SaveChangesAsync();

            return MapToVehicleModelDto(model);
        }

        public async Task<VehicleModelDto?> UpdateModelAsync(long id, UpdateVehicleModelDto dto)
        {
            var model = await _unitOfWork.Repository<VehicleModel>().GetByIdAsync(id);
            if (model == null) return null;

            if (dto.SegmentId.HasValue) model.SegmentId = dto.SegmentId.Value;
            model.Brand = dto.Brand;
            model.ModelName = dto.ModelName;
            model.FuelType = dto.FuelType;
            model.SeatCategory = dto.SeatCategory;
            if (dto.ImageUrl != null) model.ImageUrl = dto.ImageUrl;
            if (dto.Description != null) model.Description = dto.Description;
            model.IsActive = dto.IsActive;

            _unitOfWork.Repository<VehicleModel>().Update(model);
            await _unitOfWork.SaveChangesAsync();

            return MapToVehicleModelDto(model);
        }

        public async Task<bool> DeleteModelAsync(long id)
        {
            var model = await _unitOfWork.Repository<VehicleModel>().GetByIdAsync(id);
            if (model == null) return false;

            _unitOfWork.Repository<VehicleModel>().Remove(model);
            await _unitOfWork.SaveChangesAsync();

            return true;
        }

        // VehicleSegment methods
        public async Task<VehicleSegmentDto?> GetSegmentByIdAsync(long id)
        {
            var segment = await _unitOfWork.Repository<VehicleSegment>().GetByIdAsync(id);
            return segment != null ? MapToVehicleSegmentDto(segment) : null;
        }

        public async Task<PagedResult<VehicleSegmentDto>> GetSegmentsPagedAsync(PageRequest request, long? companyId = null)
        {
            var repository = _unitOfWork.Repository<VehicleSegment>();
            var query = repository.FindAsync(s => true).Result.AsQueryable();

            // Filter by company if provided
            if (companyId.HasValue)
            {
                query = query.Where(s => s.CompanyId == companyId.Value);
            }

            if (!string.IsNullOrEmpty(request.Search))
            {
                query = query.Where(s => s.Name.Contains(request.Search) || s.Code.Contains(request.Search));
            }

            var totalCount = await repository.CountAsync();
            var items = query
                .Skip((request.Page - 1) * request.PageSize)
                .Take(request.PageSize)
                .Select(s => MapToVehicleSegmentDto(s))
                .ToList();

            return new PagedResult<VehicleSegmentDto>
            {
                Items = items,
                TotalCount = totalCount,
                Page = request.Page,
                PageSize = request.PageSize
            };
        }

        public async Task<VehicleSegmentDto> CreateSegmentAsync(CreateVehicleSegmentDto dto)
        {
            var segment = new VehicleSegment
            {
                CompanyId = dto.CompanyId,
                Code = dto.Code,
                Name = dto.Name,
                Description = dto.Description,
                IsActive = true
            };

            await _unitOfWork.Repository<VehicleSegment>().AddAsync(segment);
            await _unitOfWork.SaveChangesAsync();

            return MapToVehicleSegmentDto(segment);
        }

        public async Task<VehicleSegmentDto?> UpdateSegmentAsync(long id, UpdateVehicleSegmentDto dto)
        {
            var segment = await _unitOfWork.Repository<VehicleSegment>().GetByIdAsync(id);
            if (segment == null) return null;

            segment.Code = dto.Code;
            segment.Name = dto.Name;
            if (dto.Description != null) segment.Description = dto.Description;
            segment.IsActive = dto.IsActive;

            _unitOfWork.Repository<VehicleSegment>().Update(segment);
            await _unitOfWork.SaveChangesAsync();

            return MapToVehicleSegmentDto(segment);
        }

        public async Task<bool> DeleteSegmentAsync(long id)
        {
            var segment = await _unitOfWork.Repository<VehicleSegment>().GetByIdAsync(id);
            if (segment == null) return false;

            _unitOfWork.Repository<VehicleSegment>().Remove(segment);
            await _unitOfWork.SaveChangesAsync();

            return true;
        }

        private VehicleDto MapToVehicleDto(Vehicle vehicle)
        {
            return new VehicleDto
            {
                VehicleId = vehicle.VehicleId,
                CompanyId = vehicle.CompanyId,
                ModelId = vehicle.ModelId,
                PlateNumber = vehicle.PlateNumber,
                Vin = vehicle.Vin,
                Color = vehicle.Color,
                YearManufactured = vehicle.YearManufactured,
                InServiceFrom = vehicle.InServiceFrom,
                OdometerKm = vehicle.OdometerKm,
                Status = vehicle.Status,
                Model = vehicle.Model != null ? MapToVehicleModelDto(vehicle.Model) : null,
                VehicleZonePreferences = vehicle.VehicleZonePreferences?.Select(vzp => new VehicleZonePreferenceDto
                {
                    VehicleId = vzp.VehicleId,
                    ZoneId = vzp.ZoneId,
                    Priority = vzp.Priority
                }).ToList() ?? new List<VehicleZonePreferenceDto>()

            };
        }

        private VehicleModelDto MapToVehicleModelDto(VehicleModel model)
        {
            return new VehicleModelDto
            {
                ModelId = model.ModelId,
                CompanyId = model.CompanyId,
                SegmentId = model.SegmentId,
                Brand = model.Brand,
                ModelName = model.ModelName,
                FuelType = model.FuelType,
                SeatCategory = model.SeatCategory,
                ImageUrl = model.ImageUrl,
                Description = model.Description,
                IsActive = model.IsActive,
                Segment = model.Segment != null ? MapToVehicleSegmentDto(model.Segment) : null
            };
        }

        private VehicleSegmentDto MapToVehicleSegmentDto(VehicleSegment segment)
        {
            return new VehicleSegmentDto
            {
                SegmentId = segment.SegmentId,
                CompanyId = segment.CompanyId,
                Code = segment.Code,
                Name = segment.Name,
                Description = segment.Description,
                IsActive = segment.IsActive
            };
        }

        // Zone methods
        
        public async Task<PagedResult<ModelPriceProvinceDto>> GetModelPriceProvincesPagedAsync(PageRequest request)
        {
            var repository = _unitOfWork.Repository<ModelPriceProvince>();
            
            var totalCount = await repository.CountAsync();
            
            var rawItems = await repository.Query()
                .Include(mpp => mpp.Model)
                    .ThenInclude(m => m.Segment)
                .Skip((request.Page - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync();

            _logger.LogInformation($"GetModelPriceProvincesPagedAsync: Found {rawItems.Count} items");
            if (rawItems.Any())
            {
                var firstItem = rawItems.First();
                _logger.LogInformation($"First item ModelId: {firstItem.ModelId}, Model: {firstItem.Model?.ModelId}");
            }

            var items = rawItems.Select(static mpp => new ModelPriceProvinceDto
            {
                ModelPriceId = mpp.ModelPriceId,
                CompanyId = mpp.CompanyId,
                ModelId = mpp.ModelId,
                ProvinceId = mpp.ProvinceId,
                OpeningFare = mpp.OpeningFare,
                RateFirst20Km = mpp.RateFirst20Km,
                RateOver20Km = mpp.RateOver20Km,
                TrafficAddPerKm = mpp.TrafficAddPerKm,
                RainAddPerTrip = mpp.RainAddPerTrip,
                IntercityRatePerKm = mpp.IntercityRatePerKm,
                TimeStart = mpp.TimeStart,
                TimeEnd = mpp.TimeEnd,
                ParentId = mpp.ParentId,
                DateStart = mpp.DateStart,
                DateEnd = mpp.DateEnd,
                IsActive = mpp.IsActive,
                Note = mpp.Note,
                Model = mpp.Model != null ? new VehicleModelDto
                {
                    ModelId = mpp.Model.ModelId,
                    CompanyId = mpp.Model.CompanyId,
                    SegmentId = mpp.Model.SegmentId,
                    Brand = mpp.Model.Brand,
                    ModelName = mpp.Model.ModelName,
                    FuelType = mpp.Model.FuelType,
                    SeatCategory = mpp.Model.SeatCategory,
                    ImageUrl = mpp.Model.ImageUrl,
                    Description = mpp.Model.Description,
                    IsActive = mpp.Model.IsActive,
                    Segment = mpp.Model.Segment != null ? new VehicleSegmentDto
                    {
                        SegmentId = mpp.Model.Segment.SegmentId,
                        Code = mpp.Model.Segment.Code,
                        Name = mpp.Model.Segment.Name,
                        Description = mpp.Model.Segment.Description,
                        IsActive = mpp.Model.Segment.IsActive
                    } : null
                } : null
            }).ToList();

            return new PagedResult<ModelPriceProvinceDto>
            {
                Items = items,
                TotalCount = totalCount,
                Page = request.Page,
                PageSize = request.PageSize
            };
        }

        public async Task<ModelPriceProvinceDto> CreateModelPriceProvinceAsync(CreateModelPriceProvinceDto dto)
        {
            var repository = _unitOfWork.Repository<ModelPriceProvince>();
            var modelPriceProvince = new ModelPriceProvince
            {
                CompanyId = dto.CompanyId,
                ModelId = dto.ModelId,
                ProvinceId = dto.ProvinceId,
                OpeningFare = dto.OpeningFare,
                RateFirst20Km = dto.RateFirst20Km,
                RateOver20Km = dto.RateOver20Km,
                TrafficAddPerKm = dto.TrafficAddPerKm,
                RainAddPerTrip = dto.RainAddPerTrip,
                IntercityRatePerKm = dto.IntercityRatePerKm,
                TimeStart = dto.TimeStart,
                TimeEnd = dto.TimeEnd,
                ParentId = dto.ParentId,
                DateStart = dto.DateStart,
                DateEnd = dto.DateEnd,
                IsActive = dto.IsActive,
                Note = dto.Note
            };

            await repository.AddAsync(modelPriceProvince);
            await _unitOfWork.SaveChangesAsync();

            return new ModelPriceProvinceDto
            {
                ModelPriceId = modelPriceProvince.ModelPriceId,
                CompanyId = modelPriceProvince.CompanyId,
                ModelId = modelPriceProvince.ModelId,
                ProvinceId = modelPriceProvince.ProvinceId,
                OpeningFare = modelPriceProvince.OpeningFare,
                RateFirst20Km = modelPriceProvince.RateFirst20Km,
                RateOver20Km = modelPriceProvince.RateOver20Km,
                TrafficAddPerKm = modelPriceProvince.TrafficAddPerKm,
                RainAddPerTrip = modelPriceProvince.RainAddPerTrip,
                IntercityRatePerKm = modelPriceProvince.IntercityRatePerKm,
                TimeStart = modelPriceProvince.TimeStart,
                TimeEnd = modelPriceProvince.TimeEnd,
                ParentId = modelPriceProvince.ParentId,
                DateStart = modelPriceProvince.DateStart,
                DateEnd = modelPriceProvince.DateEnd,
                IsActive = modelPriceProvince.IsActive,
                Note = modelPriceProvince.Note
            };
        }

        public async Task<ModelPriceProvinceDto?> UpdateModelPriceProvinceAsync(long id, UpdateModelPriceProvinceDto dto)
        {
            var repository = _unitOfWork.Repository<ModelPriceProvince>();
            var modelPriceProvince = await repository.GetByIdAsync(id);
            if (modelPriceProvince == null) return null;

            modelPriceProvince.ProvinceId = dto.ProvinceId;
            modelPriceProvince.OpeningFare = dto.OpeningFare;
            modelPriceProvince.RateFirst20Km = dto.RateFirst20Km;
            modelPriceProvince.RateOver20Km = dto.RateOver20Km;
            modelPriceProvince.TrafficAddPerKm = dto.TrafficAddPerKm;
            modelPriceProvince.RainAddPerTrip = dto.RainAddPerTrip;
            modelPriceProvince.IntercityRatePerKm = dto.IntercityRatePerKm;
            modelPriceProvince.TimeStart = dto.TimeStart;
            modelPriceProvince.TimeEnd = dto.TimeEnd;
            modelPriceProvince.ParentId = dto.ParentId;
            modelPriceProvince.DateStart = dto.DateStart;
            modelPriceProvince.DateEnd = dto.DateEnd;
            modelPriceProvince.IsActive = dto.IsActive;
            if (dto.Note != null) modelPriceProvince.Note = dto.Note;

            repository.Update(modelPriceProvince);
            await _unitOfWork.SaveChangesAsync();

            return new ModelPriceProvinceDto
            {
                ModelPriceId = modelPriceProvince.ModelPriceId,
                CompanyId = modelPriceProvince.CompanyId,
                ModelId = modelPriceProvince.ModelId,
                ProvinceId = modelPriceProvince.ProvinceId,
                OpeningFare = modelPriceProvince.OpeningFare,
                RateFirst20Km = modelPriceProvince.RateFirst20Km,
                RateOver20Km = modelPriceProvince.RateOver20Km,
                TrafficAddPerKm = modelPriceProvince.TrafficAddPerKm,
                RainAddPerTrip = modelPriceProvince.RainAddPerTrip,
                IntercityRatePerKm = modelPriceProvince.IntercityRatePerKm,
                TimeStart = modelPriceProvince.TimeStart,
                TimeEnd = modelPriceProvince.TimeEnd,
                ParentId = modelPriceProvince.ParentId,
                DateStart = modelPriceProvince.DateStart,
                DateEnd = modelPriceProvince.DateEnd,
                IsActive = modelPriceProvince.IsActive,
                Note = modelPriceProvince.Note
            };
        }

        public async Task<bool> DeleteModelPriceProvinceAsync(long id)
        {
            try
            {
                var repository = _unitOfWork.Repository<ModelPriceProvince>();
                var modelPriceProvince = await repository.GetByIdAsync(id);
                if (modelPriceProvince == null) return false;

                repository.Remove(modelPriceProvince);
                await _unitOfWork.SaveChangesAsync();
                return true;
            }
            catch
            {
                return false;
            }
        }

        // Note: DeleteVehicleAsync method is already defined above

        public async Task<PagedResult<VehicleInProvinceDto>> GetVehicleInProvincesPagedAsync(PageRequest request)
        {
            var repository = _unitOfWork.Repository<VehicleInProvince>();
            var query = repository.FindAsync(vp => true).Result.AsQueryable();

            var totalCount = await repository.CountAsync();
            var items = query
                .Skip((request.Page - 1) * request.PageSize)
                .Take(request.PageSize)
                .Select(vp => new VehicleInProvinceDto
                {
                    VehicleId = vp.VehicleId,
                    ProvinceId = vp.ProvinceId,
                    Allowed = vp.Allowed,
                    SinceDate = vp.SinceDate
                })
                .ToList();

            return new PagedResult<VehicleInProvinceDto>
            {
                Items = items,
                TotalCount = totalCount,
                Page = request.Page,
                PageSize = request.PageSize
            };
        }

        public async Task<PagedResult<VehicleZonePreferenceDto>> GetVehicleZonePreferencesPagedAsync(PageRequest request)
        {
            var repository = _unitOfWork.Repository<VehicleZonePreference>();
            var query = repository.FindAsync(vzp => true).Result.AsQueryable();

            var totalCount = await repository.CountAsync();
            var items = query
                .Skip((request.Page - 1) * request.PageSize)
                .Take(request.PageSize)
                .Select(vzp => new VehicleZonePreferenceDto
                {
                    VehicleId = vzp.VehicleId,
                    ZoneId = vzp.ZoneId,
                    Priority = vzp.Priority
                })
                .ToList();

            return new PagedResult<VehicleZonePreferenceDto>
            {
                Items = items,
                TotalCount = totalCount,
                Page = request.Page,
                PageSize = request.PageSize
            };
        }
        public async Task<bool> AddVehicleToZoneAsync(long vehicleId, long zoneId, short priority = 100)
        {
            try
            {
                var vehiclesZone = await _unitOfWork.Repository<VehicleZonePreference>().Query()
                    .FirstOrDefaultAsync(vzp => vzp.VehicleId == vehicleId && vzp.ZoneId == zoneId);
                // Check if relationship already exists

                if (vehiclesZone != null)
                {
                    // Update priority if already exists
                    vehiclesZone.Priority = priority;
                }
                else
                {
                    // Create new relationship
                    var vehicleZonePreference = new VehicleZonePreference
                    {
                        VehicleId = vehicleId,
                        ZoneId = zoneId,
                        Priority = priority
                    };
                    await _unitOfWork.Repository<VehicleZonePreference>().AddAsync(vehiclesZone);

                }

                await _context.SaveChangesAsync();
                return true;
            }
            catch
            {
                return false;
            }
        }

        public async Task<bool> RemoveVehicleFromZoneAsync(long vehicleId, long zoneId)
        {
            try
            {
                var vehiclesZone = await _unitOfWork.Repository<VehicleZonePreference>().Query()
                   .FirstOrDefaultAsync(vzp => vzp.VehicleId == vehicleId && vzp.ZoneId == zoneId);

                if (vehiclesZone == null)
                    return false;

                _unitOfWork.Repository<VehicleZonePreference>().Remove(vehiclesZone);
                await _context.SaveChangesAsync();
                return true;
            }
            catch
            {
                return false;
            }
        }
    }
}