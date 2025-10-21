using Microsoft.EntityFrameworkCore;
using RadioCabs_BE.Data;
using RadioCabs_BE.Models;
using RadioCabs_BE.Services.Interfaces;

namespace RadioCabs_BE.Services
{
    public class CompanyService : ICompanyService
    {
        private readonly RadiocabsDbContext _db;
        public CompanyService(RadiocabsDbContext db) => _db = db;

        public async Task<Company?> GetAsync(long id, CancellationToken ct = default)
            => await _db.Companies.AsNoTracking()
                                  .FirstOrDefaultAsync(x => x.CompanyId == id, ct);

        public async Task<IReadOnlyList<Company>> ListActiveAsync(CancellationToken ct = default)
            => await _db.Companies.AsNoTracking()
                                  .Where(c => c.Status == ActiveFlag.ACTIVE)
                                  .OrderBy(c => c.CompanyId)
                                  .ToListAsync(ct);

        public async Task<IReadOnlyList<Company>> ListAsync(ActiveFlag? status = null, CancellationToken ct = default)
        {
            var q = _db.Companies.AsNoTracking();
            if (status.HasValue) q = q.Where(c => c.Status == status.Value);
            return await q.OrderBy(c => c.CompanyId).ToListAsync(ct);
        }

        public async Task<Company> CreateAsync(Company entity, CancellationToken ct = default)
        {
            _db.Companies.Add(entity);
            await _db.SaveChangesAsync(ct);
            return entity;
        }

        public async Task<bool> UpdateAsync(Company entity, CancellationToken ct = default)
        {
            _db.Companies.Update(entity);
            return await _db.SaveChangesAsync(ct) > 0;
        }

        // ⬇️ SỬA CHỮ KÝ: trả về Task (không generic) để khớp interface
        public async Task SetStatusAsync(long id, ActiveFlag status, CancellationToken ct = default)
        {
            var c = await _db.Companies.FirstOrDefaultAsync(x => x.CompanyId == id, ct);
            if (c == null) throw new KeyNotFoundException("Company not found");
            c.Status = status;
            await _db.SaveChangesAsync(ct);
        }
    }
}
