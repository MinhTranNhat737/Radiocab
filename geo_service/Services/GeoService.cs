using common.Models;
using common.Repositories;
using geo_service.Data;
using geo_service.DTOs;
using geo_service.Models;
using geo_service.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Security.Principal;

namespace geo_service.Services
{
    public class GeoService : IGeoService
    {
        private readonly IUnitOfWork<geo_serviceDbContext> _unitOfWork;
        private readonly IConfiguration _configuration;

        public GeoService(IUnitOfWork<geo_serviceDbContext> unitOfWork, IConfiguration configuration)
        {
            _unitOfWork = unitOfWork;
            _configuration = configuration;
        }


       public async Task<PagedResult<ZoneDto>> GetZonesPagedAsync(PageRequest request, long? companyId = null)
        {
            var repository = _unitOfWork.Repository<Zone>();
            var query = repository.FindAsync(a => true).Result.AsQueryable();

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

            var totalCount = await repository.CountAsync();
            var pagedZones = query
                .Include(z => z.Province)
                .Include(z => z.ZoneWards)
                    .ThenInclude(zw => zw.Ward)
                        .ThenInclude(w => w.Province)
                .Skip((request.Page - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToList();

            var items = pagedZones.Select(z => new ZoneDto
            {
                ZoneId = z.ZoneId,
                CompanyId = z.CompanyId,
                ProvinceId = z.ProvinceId,
                Code = z.Code,
                Name = z.Name,
                Description = z.Description,
                IsActive = z.IsActive,
                Province = z.Province != null ? MapProvinceDto(z.Province) : null!,
                ZoneWards = z.ZoneWards?.Select(zw => new ZoneWardDto
                {
                    Ward = zw.Ward != null ? new WardDto
                    {
                        WardId = zw.Ward.WardId,
                        Code = zw.Ward.Code ?? string.Empty,
                        Name = zw.Ward.Name ?? string.Empty,
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


            return MapZoneDto(zone);
        }

        
        public async Task<ZoneDto?> UpdateZoneAsync(long id, UpdateZoneDto dto)
        {
            var zone = await _unitOfWork.Repository<Zone>().GetByIdAsync(id);

            if (zone == null) return null;

            zone.Code = dto.Code;
            zone.Name = dto.Name;
            zone.Description = dto.Description;
            zone.IsActive = dto.IsActive;

            _unitOfWork.Repository<Zone>().Update(zone);
            await _unitOfWork.SaveChangesAsync();

            return MapZoneDto(zone);
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

            var items = wards.Select(w => MapWardDto(w)).ToList();

            return new PagedResult<WardDto>
            {
                Items = items,
                TotalCount = totalCount,
                Page = request.Page,
                PageSize = request.PageSize
            };
        }
        private ZoneDto MapZoneDto(Zone zone)
        {
            return new ZoneDto
            {
                ZoneId = zone.ZoneId,
                CompanyId = zone.CompanyId,
                ProvinceId = zone.ProvinceId,
                Code = zone.Code,
                Name = zone.Name,
                Description = zone.Description,
                IsActive = zone.IsActive,
                Province = zone.Province != null ? MapProvinceDto(zone.Province) : null
            };
        }
        private ProvinceDto MapProvinceDto(Province province)
        {
            return new ProvinceDto
            {
                ProvinceId = province.ProvinceId,
                Name = province.Name,
                Code= province.Code
            };

        }
        private WardDto MapWardDto(Ward ward)
        {
            return new WardDto
            {
                WardId = ward.WardId,
                ProvinceId = ward.ProvinceId,
                Code = ward.Code,
                Name = ward.Name,
                Province = ward.Province != null ? MapProvinceDto(ward.Province) : null

            };

        }

    }
}