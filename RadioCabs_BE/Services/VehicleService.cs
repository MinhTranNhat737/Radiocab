using Microsoft.EntityFrameworkCore;
using RadioCabs_BE.DTOs;
using RadioCabs_BE.Models;
using RadioCabs_BE.Repositories;
using RadioCabs_BE.Services.Interfaces;
using RadioCabs_BE.Data;

namespace RadioCabs_BE.Services
{
    public class VehicleService : IVehicleService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly RadiocabsDbContext _context;

        public VehicleService(IUnitOfWork unitOfWork, RadiocabsDbContext context)
        {
            _unitOfWork = unitOfWork;
            _context = context;
        }

        // Vehicle methods
        public async Task<VehicleDto?> GetVehicleByIdAsync(long id)
        {
            var vehicle = await _context.Vehicles
                .Include(v => v.Company)
                .Include(v => v.Model)
                .Include(v => v.VehicleInProvinces)
                    .ThenInclude(vip => vip.Province)
                .Include(v => v.VehicleZonePreferences)
                    .ThenInclude(vzp => vzp.Zone)
                .Include(v => v.DriverVehicleAssignments)
                    .ThenInclude(dva => dva.Driver)
                .Include(v => v.DriverSchedules.Where(ds => ds.WorkDate.Month == DateTime.Now.Month && ds.WorkDate.Year == DateTime.Now.Year))
                    .ThenInclude(ds => ds.Driver)
                .FirstOrDefaultAsync(v => v.VehicleId == id);
            
            return vehicle != null ? MapToVehicleDto(vehicle) : null;
        }

        public async Task<PagedResult<VehicleDto>> GetVehiclesPagedAsync(PageRequest request, long? companyId = null)
        {
            var repository = _unitOfWork.Repository<Vehicle>();
            var query = repository.FindAsync(v => true).Result.AsQueryable();

            // Filter by company if provided
            if (companyId.HasValue)
            {
                query = query.Where(v => v.CompanyId == companyId.Value);
            }

            if (!string.IsNullOrEmpty(request.Search))
            {
                query = query.Where(v => v.PlateNumber.Contains(request.Search) || v.Vin!.Contains(request.Search));
            }

            var totalCount = await repository.CountAsync();
            var items = query
                .Skip((request.Page - 1) * request.PageSize)
                .Take(request.PageSize)
                .Select(v => MapToVehicleDto(v))
                .ToList();

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
            var repository = _unitOfWork.Repository<VehicleModel>();
            var query = repository.FindAsync(m => true).Result.AsQueryable();

            // Filter by company if provided
            if (companyId.HasValue)
            {
                query = query.Where(m => m.CompanyId == companyId.Value);
            }

            if (!string.IsNullOrEmpty(request.Search))
            {
                query = query.Where(m => m.Brand.Contains(request.Search) || m.ModelName.Contains(request.Search));
            }

            var totalCount = await repository.CountAsync();
            var items = query
                .Skip((request.Page - 1) * request.PageSize)
                .Take(request.PageSize)
                .Select(m => MapToVehicleModelDto(m))
                .ToList();

            return new PagedResult<VehicleModelDto>
            {
                Items = items,
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
                DriverVehicleAssignments = vehicle.DriverVehicleAssignments?.Select(dva => new DriverVehicleAssignmentDto
                {
                    AssignmentId = dva.AssignmentId,
                    DriverAccountId = dva.DriverAccountId,
                    VehicleId = dva.VehicleId,
                    StartAt = dva.StartAt,
                    EndAt = dva.EndAt,
                    Driver = dva.Driver != null ? new AccountDto
                    {
                        AccountId = dva.Driver.AccountId,
                        Username = dva.Driver.Username,
                        FullName = dva.Driver.FullName,
                        Email = dva.Driver.Email,
                        Phone = dva.Driver.Phone
                    } : null!
                }).ToList() ?? new List<DriverVehicleAssignmentDto>(),
                DriverSchedules = vehicle.DriverSchedules?.Select(ds => new DriverScheduleDto
                {
                    ScheduleId = ds.ScheduleId,
                    DriverAccountId = ds.DriverAccountId,
                    WorkDate = ds.WorkDate,
                    StartTime = ds.StartTime,
                    EndTime = ds.EndTime,
                    VehicleId = ds.VehicleId,
                    Status = ds.Status,
                    Note = ds.Note,
                    CreatedAt = ds.CreatedAt,
                    UpdatedAt = ds.UpdatedAt,
                    Driver = ds.Driver != null ? new AccountDto
                    {
                        AccountId = ds.Driver.AccountId,
                        Username = ds.Driver.Username,
                        FullName = ds.Driver.FullName,
                        Email = ds.Driver.Email,
                        Phone = ds.Driver.Phone
                    } : null!
                }).ToList() ?? new List<DriverScheduleDto>()
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
        public async Task<PagedResult<ZoneDto>> GetZonesPagedAsync(PageRequest request, long? companyId = null)
        {
            var query = _context.Zones.AsQueryable();

            // Filter by company if provided
            if (companyId.HasValue)
            {
                query = query.Where(z => z.CompanyId == companyId.Value);
            }

            if (!string.IsNullOrEmpty(request.Search))
            {
                query = query.Where(z => z.Name.Contains(request.Search) || 
                                       z.Code.Contains(request.Search) ||
                                       (z.Description != null && z.Description.Contains(request.Search)));
            }

            var totalCount = await query.CountAsync();
            var pagedZones = await query
                .Skip((request.Page - 1) * request.PageSize)
                .Take(request.PageSize)
                .Include(z => z.Province)
                .Include(z => z.ZoneWards)
                    .ThenInclude(zw => zw.Ward)
                        .ThenInclude(w => w.Province)
                .ToListAsync();

            var items = pagedZones.Select(z => new ZoneDto
            {
                ZoneId = z.ZoneId,
                CompanyId = z.CompanyId,
                ProvinceId = z.ProvinceId,
                Code = z.Code,
                Name = z.Name,
                Description = z.Description,
                IsActive = z.IsActive,
                Province = z.Province != null ? new ProvinceDto
                {
                    ProvinceId = z.Province.ProvinceId,
                    Code = z.Province.Code ?? string.Empty,
                    Name = z.Province.Name ?? string.Empty
                } : null!,
                ZoneWards = z.ZoneWards?.Select(zw => new ZoneWardDto
                {
                    ZoneId = zw.ZoneId,
                    WardId = zw.WardId,
                    Ward = zw.Ward != null ? new WardDto
                    {
                        WardId = zw.Ward.WardId,
                        ProvinceId = zw.Ward.ProvinceId,
                        Code = zw.Ward.Code ?? string.Empty,
                        Name = zw.Ward.Name ?? string.Empty,
                        Province = zw.Ward.Province != null ? new ProvinceDto
                        {
                            ProvinceId = zw.Ward.Province.ProvinceId,
                            Code = zw.Ward.Province.Code ?? string.Empty,
                            Name = zw.Ward.Province.Name ?? string.Empty
                        } : null!
                    } : null!
                }).ToList() ?? new List<ZoneWardDto>()
            }).ToList();

            return new PagedResult<ZoneDto>
            {
                Items = items,
                TotalCount = totalCount,
                Page = request.Page,
                PageSize = request.PageSize
            };
        }

        public async Task<ZoneDto> CreateZoneAsync(CreateZoneDto dto)
        {
            var zone = new Zone
            {
                CompanyId = dto.CompanyId,
                ProvinceId = dto.ProvinceId,
                Code = dto.Code,
                Name = dto.Name,
                Description = dto.Description,
                IsActive = dto.IsActive
            };

            var repository = _unitOfWork.Repository<Zone>();
            await repository.AddAsync(zone);
            await _unitOfWork.SaveChangesAsync();

            return new ZoneDto
            {
                ZoneId = zone.ZoneId,
                CompanyId = zone.CompanyId,
                ProvinceId = zone.ProvinceId,
                Code = zone.Code,
                Name = zone.Name,
                Description = zone.Description,
                IsActive = zone.IsActive,
                Province = new ProvinceDto
                {
                    ProvinceId = zone.Province.ProvinceId,
                    Code = zone.Province.Code,
                    Name = zone.Province.Name
                }
            };
        }

        public async Task<ZoneDto?> UpdateZoneAsync(long id, UpdateZoneDto dto)
        {
            var repository = _unitOfWork.Repository<Zone>();
            var zone = await repository.GetByIdAsync(id);
            if (zone == null) return null;

            zone.Code = dto.Code;
            zone.Name = dto.Name;
            zone.Description = dto.Description;
            zone.IsActive = dto.IsActive;

            await _unitOfWork.SaveChangesAsync();

            return new ZoneDto
            {
                ZoneId = zone.ZoneId,
                CompanyId = zone.CompanyId,
                ProvinceId = zone.ProvinceId,
                Code = zone.Code,
                Name = zone.Name,
                Description = zone.Description,
                IsActive = zone.IsActive,
                Province = new ProvinceDto
                {
                    ProvinceId = zone.Province.ProvinceId,
                    Code = zone.Province.Code,
                    Name = zone.Province.Name
                }
            };
        }

        public async Task<bool> DeleteZoneAsync(long id)
        {
            var repository = _unitOfWork.Repository<Zone>();
            var zone = await repository.GetByIdAsync(id);
            if (zone == null) return false;

            repository.Remove(zone);
            await _unitOfWork.SaveChangesAsync();
            return true;
        }

        public async Task<PagedResult<ZoneWardDto>> GetZoneWardsPagedAsync(PageRequest request)
        {
            var repository = _unitOfWork.Repository<ZoneWard>();
            var query = repository.FindAsync(zw => true).Result.AsQueryable();

            if (!string.IsNullOrEmpty(request.Search))
            {
                query = query.Where(zw => zw.Zone.Name.Contains(request.Search) ||
                                        zw.Ward.Name.Contains(request.Search));
            }

            var totalCount = await repository.CountAsync();
            var items = query
                .Skip((request.Page - 1) * request.PageSize)
                .Take(request.PageSize)
                .Select(zw => new ZoneWardDto
                {
                    ZoneId = zw.ZoneId,
                    WardId = zw.WardId,
                    Zone = new ZoneDto
                    {
                        ZoneId = zw.Zone.ZoneId,
                        CompanyId = zw.Zone.CompanyId,
                        ProvinceId = zw.Zone.ProvinceId,
                        Code = zw.Zone.Code,
                        Name = zw.Zone.Name,
                        Description = zw.Zone.Description,
                        IsActive = zw.Zone.IsActive,
                        Province = new ProvinceDto
                        {
                            ProvinceId = zw.Zone.Province.ProvinceId,
                            Code = zw.Zone.Province.Code,
                            Name = zw.Zone.Province.Name
                        }
                    },
                    Ward = new WardDto
                    {
                        WardId = zw.Ward.WardId,
                        ProvinceId = zw.Ward.ProvinceId,
                        Code = zw.Ward.Code,
                        Name = zw.Ward.Name,
                        Province = new ProvinceDto
                        {
                            ProvinceId = zw.Ward.Province.ProvinceId,
                            Code = zw.Ward.Province.Code,
                            Name = zw.Ward.Province.Name
                        }
                    }
                })
                .ToList();

            return new PagedResult<ZoneWardDto>
            {
                Items = items,
                TotalCount = totalCount,
                Page = request.Page,
                PageSize = request.PageSize
            };
        }

        public async Task<bool> AddWardToZoneAsync(long zoneId, long wardId)
        {
            // Check if zone and ward exist
            var zoneRepository = _unitOfWork.Repository<Zone>();
            var wardRepository = _unitOfWork.Repository<Ward>();
            
            var zone = await zoneRepository.GetByIdAsync(zoneId);
            var ward = await wardRepository.GetByIdAsync(wardId);
            
            if (zone == null || ward == null) return false;

            // Check if ward belongs to the same province as zone
            if (ward.ProvinceId != zone.ProvinceId) return false;

            // Check if relationship already exists
            var zoneWardRepository = _unitOfWork.Repository<ZoneWard>();
            var existing = await zoneWardRepository.FindAsync(zw => zw.ZoneId == zoneId && zw.WardId == wardId);
            if (existing.Any()) return false;

            var zoneWard = new ZoneWard
            {
                ZoneId = zoneId,
                WardId = wardId
            };

            await zoneWardRepository.AddAsync(zoneWard);
            await _unitOfWork.SaveChangesAsync();
            return true;
        }

        public async Task<bool> RemoveWardFromZoneAsync(long zoneId, long wardId)
        {
            var repository = _unitOfWork.Repository<ZoneWard>();
            var zoneWard = await repository.FindAsync(zw => zw.ZoneId == zoneId && zw.WardId == wardId);
            
            if (!zoneWard.Any()) return false;

            repository.Remove(zoneWard.First());
            await _unitOfWork.SaveChangesAsync();
            return true;
        }

        public async Task<PagedResult<ProvinceDto>> GetProvincesPagedAsync(PageRequest request)
        {
            var repository = _unitOfWork.Repository<Province>();
            var query = repository.FindAsync(p => true).Result.AsQueryable();

            if (!string.IsNullOrEmpty(request.Search))
            {
                query = query.Where(p => p.Name.Contains(request.Search) || (p.Code != null && p.Code.Contains(request.Search)));
            }

            var totalCount = await repository.CountAsync();
            var items = query
                .Skip((request.Page - 1) * request.PageSize)
                .Take(request.PageSize)
                .Select(p => new ProvinceDto
                {
                    ProvinceId = p.ProvinceId,
                    Code = p.Code,
                    Name = p.Name
                })
                .ToList();

            return new PagedResult<ProvinceDto>
            {
                Items = items,
                TotalCount = totalCount,
                Page = request.Page,
                PageSize = request.PageSize
            };
        }

        public async Task<PagedResult<WardDto>> GetWardsPagedAsync(PageRequest request)
        {
            var repository = _unitOfWork.Repository<Ward>();
            var query = repository.FindAsync(w => true).Result.AsQueryable();

            if (!string.IsNullOrEmpty(request.Search))
            {
                query = query.Where(w => w.Name.Contains(request.Search) || 
                                        (w.Code != null && w.Code.Contains(request.Search)));
            }

            var totalCount = await repository.CountAsync();
            
            // Load wards with their provinces using Include
            var wards = query
                .Skip((request.Page - 1) * request.PageSize)
                .Take(request.PageSize)
                .Include(w => w.Province)
                .ToList();

            var items = wards.Select(w => new WardDto
            {
                WardId = w.WardId,
                ProvinceId = w.ProvinceId,
                Code = w.Code ?? string.Empty,
                Name = w.Name ?? string.Empty,
                Province = w.Province != null ? new ProvinceDto
                {
                    ProvinceId = w.Province.ProvinceId,
                    Code = w.Province.Code ?? string.Empty,
                    Name = w.Province.Name ?? string.Empty
                } : null
            }).ToList();

            return new PagedResult<WardDto>
            {
                Items = items,
                TotalCount = totalCount,
                Page = request.Page,
                PageSize = request.PageSize
            };
        }

        public async Task<PagedResult<ModelPriceProvinceDto>> GetModelPriceProvincesPagedAsync(PageRequest request)
        {
            var repository = _unitOfWork.Repository<ModelPriceProvince>();
            var query = repository.FindAsync(mpp => true).Result.AsQueryable();

            var totalCount = await repository.CountAsync();
            var items = query
                .Skip((request.Page - 1) * request.PageSize)
                .Take(request.PageSize)
                .Select(mpp => new ModelPriceProvinceDto
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
                    Note = mpp.Note
                })
                .ToList();

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

        public async Task<DriverVehicleAssignmentDto> CreateDriverVehicleAssignmentAsync(CreateDriverVehicleAssignmentDto dto)
        {
            var assignment = new DriverVehicleAssignment
            {
                DriverAccountId = dto.DriverId,
                VehicleId = dto.VehicleId,
                StartAt = dto.AssignedFrom.ToDateTime(TimeOnly.MinValue),
                EndAt = dto.AssignedTo?.ToDateTime(TimeOnly.MinValue)
            };

            _context.DriverVehicleAssignments.Add(assignment);
            await _context.SaveChangesAsync();

            return new DriverVehicleAssignmentDto
            {
                AssignmentId = assignment.AssignmentId,
                DriverAccountId = assignment.DriverAccountId,
                VehicleId = assignment.VehicleId,
                StartAt = assignment.StartAt,
                EndAt = assignment.EndAt
            };
        }
    }
}