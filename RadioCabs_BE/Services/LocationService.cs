using Microsoft.EntityFrameworkCore;
using RadioCabs_BE.Data;
using RadioCabs_BE.DTOs;
using RadioCabs_BE.Models;
using RadioCabs_BE.Repositories.Interfaces;
using RadioCabs_BE.Services.Interfaces;

namespace RadioCabs_BE.Services
{
    public class ProvinceService : IProvinceService
    {
        private readonly IProvinceRepository _repo;
        private readonly RadiocabsDbContext _db;
        private readonly IUnitOfWork _uow;

        public ProvinceService(IProvinceRepository repo, RadiocabsDbContext db, IUnitOfWork uow)
        {
            _repo = repo;
            _db = db;
            _uow = uow;
        }

        public async Task<Province?> GetAsync(long id, CancellationToken ct = default)
            => await _repo.GetByIdAsync(id, ct);

        public async Task<Province?> GetByCodeAsync(string code, CancellationToken ct = default)
            => await _repo.GetByCodeAsync(code, ct);

        public async Task<IReadOnlyList<Province>> ListAsync(CancellationToken ct = default)
            => await _repo.GetAllAsync(ct);

        public async Task<IReadOnlyList<Province>> SearchByNameAsync(string name, CancellationToken ct = default)
            => await _repo.SearchByNameAsync(name, ct);

        public async Task<Province> CreateAsync(CreateProvinceDto dto, CancellationToken ct = default)
        {
            var province = new Province
            {
                Code = dto.Code,
                Name = dto.Name
            };

            await _repo.AddAsync(province, ct);
            await _uow.SaveChangesAsync(ct);
            return province;
        }

        public async Task<bool> UpdateAsync(long id, UpdateProvinceDto dto, CancellationToken ct = default)
        {
            var province = await _repo.GetByIdAsync(id, ct);
            if (province == null) return false;

            if (!string.IsNullOrEmpty(dto.Code))
                province.Code = dto.Code;
            if (!string.IsNullOrEmpty(dto.Name))
                province.Name = dto.Name;

            _repo.Update(province);
            return await _uow.SaveChangesAsync(ct) > 0;
        }
    }

    public class WardService : IWardService
    {
        private readonly IWardRepository _repo;
        private readonly RadiocabsDbContext _db;
        private readonly IUnitOfWork _uow;

        public WardService(IWardRepository repo, RadiocabsDbContext db, IUnitOfWork uow)
        {
            _repo = repo;
            _db = db;
            _uow = uow;
        }

        public async Task<Ward?> GetAsync(long id, CancellationToken ct = default)
            => await _repo.GetByIdAsync(id, ct);

        public async Task<IReadOnlyList<Ward>> ListByProvinceAsync(long provinceId, CancellationToken ct = default)
            => await _repo.ListByProvinceAsync(provinceId, ct);

        public async Task<IReadOnlyList<Ward>> SearchByNameAsync(string name, CancellationToken ct = default)
            => await _repo.SearchByNameAsync(name, ct);

        public async Task<Ward> CreateAsync(CreateWardDto dto, CancellationToken ct = default)
        {
            var ward = new Ward
            {
                ProvinceId = dto.ProvinceId,
                Code = dto.Code,
                Name = dto.Name
            };

            await _repo.AddAsync(ward, ct);
            await _uow.SaveChangesAsync(ct);
            return ward;
        }

        public async Task<bool> UpdateAsync(long id, UpdateWardDto dto, CancellationToken ct = default)
        {
            var ward = await _repo.GetByIdAsync(id, ct);
            if (ward == null) return false;

            if (!string.IsNullOrEmpty(dto.Code))
                ward.Code = dto.Code;
            if (!string.IsNullOrEmpty(dto.Name))
                ward.Name = dto.Name;

            _repo.Update(ward);
            return await _uow.SaveChangesAsync(ct) > 0;
        }
    }

    public class ZoneService : IZoneService
    {
        private readonly IZoneRepository _repo;
        private readonly IZoneWardRepository _zoneWardRepo;
        private readonly RadiocabsDbContext _db;
        private readonly IUnitOfWork _uow;

        public ZoneService(IZoneRepository repo, IZoneWardRepository zoneWardRepo, RadiocabsDbContext db, IUnitOfWork uow)
        {
            _repo = repo;
            _zoneWardRepo = zoneWardRepo;
            _db = db;
            _uow = uow;
        }

        public async Task<Zone?> GetAsync(long id, CancellationToken ct = default)
            => await _repo.GetByIdAsync(id, ct);

        public async Task<IReadOnlyList<Zone>> ListByCompanyAsync(long companyId, CancellationToken ct = default)
            => await _repo.ListByCompanyAsync(companyId, ct);

        public async Task<IReadOnlyList<Zone>> ListByProvinceAsync(long provinceId, CancellationToken ct = default)
            => await _repo.ListByProvinceAsync(provinceId, ct);

        public async Task<IReadOnlyList<Zone>> ListActiveAsync(CancellationToken ct = default)
            => await _repo.ListActiveAsync(ct);

        public async Task<Zone> CreateAsync(CreateZoneDto dto, CancellationToken ct = default)
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

            await _repo.AddAsync(zone, ct);
            await _uow.SaveChangesAsync(ct);
            return zone;
        }

        public async Task<bool> UpdateAsync(long id, UpdateZoneDto dto, CancellationToken ct = default)
        {
            var zone = await _repo.GetByIdAsync(id, ct);
            if (zone == null) return false;

            if (!string.IsNullOrEmpty(dto.Code))
                zone.Code = dto.Code;
            if (!string.IsNullOrEmpty(dto.Name))
                zone.Name = dto.Name;
            if (!string.IsNullOrEmpty(dto.Description))
                zone.Description = dto.Description;
            if (dto.IsActive.HasValue)
                zone.IsActive = dto.IsActive.Value;

            _repo.Update(zone);
            return await _uow.SaveChangesAsync(ct) > 0;
        }

        public async Task<bool> AssignWardAsync(AssignWardToZoneDto dto, CancellationToken ct = default)
        {
            var zoneWard = new ZoneWard
            {
                ZoneId = dto.ZoneId,
                WardId = dto.WardId
            };

            await _zoneWardRepo.AddAsync(zoneWard, ct);
            return await _uow.SaveChangesAsync(ct) > 0;
        }

        public async Task<bool> RemoveWardAsync(long zoneId, long wardId, CancellationToken ct = default)
        {
            var zoneWard = await _zoneWardRepo.GetAsync(ct);
            if (zoneWard == null) return false;

            _zoneWardRepo.Delete(zoneWard);
            return await _uow.SaveChangesAsync(ct) > 0;
        }
    }
}
