using Microsoft.EntityFrameworkCore;
using RadioCabs_BE.DTOs;
using RadioCabs_BE.Models;
using RadioCabs_BE.Repositories;
using RadioCabs_BE.Services.Interfaces;

namespace RadioCabs_BE.Services
{
    public class VehicleService : IVehicleService
    {
        private readonly IUnitOfWork _unitOfWork;

        public VehicleService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        // Vehicle methods
        public async Task<VehicleDto?> GetVehicleByIdAsync(long id)
        {
            var vehicle = await _unitOfWork.Repository<Vehicle>().GetByIdAsync(id);
            return vehicle != null ? MapToVehicleDto(vehicle) : null;
        }

        public async Task<PagedResult<VehicleDto>> GetVehiclesPagedAsync(PageRequest request)
        {
            var repository = _unitOfWork.Repository<Vehicle>();
            var query = repository.FindAsync(v => true).Result.AsQueryable();

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

            if (dto.ModelId.HasValue) vehicle.ModelId = dto.ModelId.Value;
            if (dto.PlateNumber != null) vehicle.PlateNumber = dto.PlateNumber;
            if (dto.Vin != null) vehicle.Vin = dto.Vin;
            if (dto.Color != null) vehicle.Color = dto.Color;
            if (dto.YearManufactured.HasValue) vehicle.YearManufactured = dto.YearManufactured.Value;
            if (dto.InServiceFrom.HasValue) vehicle.InServiceFrom = dto.InServiceFrom.Value;
            if (dto.OdometerKm.HasValue) vehicle.OdometerKm = dto.OdometerKm.Value;
            if (dto.Status.HasValue) vehicle.Status = dto.Status.Value;

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

        public async Task<PagedResult<VehicleModelDto>> GetModelsPagedAsync(PageRequest request)
        {
            var repository = _unitOfWork.Repository<VehicleModel>();
            var query = repository.FindAsync(m => true).Result.AsQueryable();

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
            if (dto.Brand != null) model.Brand = dto.Brand;
            if (dto.ModelName != null) model.ModelName = dto.ModelName;
            if (dto.FuelType.HasValue) model.FuelType = dto.FuelType.Value;
            if (dto.SeatCategory.HasValue) model.SeatCategory = dto.SeatCategory.Value;
            if (dto.ImageUrl != null) model.ImageUrl = dto.ImageUrl;
            if (dto.Description != null) model.Description = dto.Description;
            if (dto.IsActive.HasValue) model.IsActive = dto.IsActive.Value;

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

        public async Task<PagedResult<VehicleSegmentDto>> GetSegmentsPagedAsync(PageRequest request)
        {
            var repository = _unitOfWork.Repository<VehicleSegment>();
            var query = repository.FindAsync(s => true).Result.AsQueryable();

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

            if (dto.Code != null) segment.Code = dto.Code;
            if (dto.Name != null) segment.Name = dto.Name;
            if (dto.Description != null) segment.Description = dto.Description;
            if (dto.IsActive.HasValue) segment.IsActive = dto.IsActive.Value;

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
                Model = vehicle.Model != null ? MapToVehicleModelDto(vehicle.Model) : null
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
    }
}