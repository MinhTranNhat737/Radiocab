using Microsoft.EntityFrameworkCore;
using RadioCabs_BE.Data;
using RadioCabs_BE.Models;
using RadioCabs_BE.Services.Interfaces;

namespace RadioCabs_BE.Services
{
    public class MembershipService : IMembershipService
    {
        private readonly RadiocabsDbContext _db;
        public MembershipService(RadiocabsDbContext db) => _db = db;

        public Task<MembershipOrder?> GetAsync(long id, CancellationToken ct = default)
            => _db.MembershipOrders.AsNoTracking()
                .FirstOrDefaultAsync(x => x.MembershipOrderId == id, ct);

        public async Task<IReadOnlyList<MembershipOrder>> ListByCompanyAsync(long companyId, CancellationToken ct = default)
            => await _db.MembershipOrders.AsNoTracking()
                   .Where(x => x.CompanyId == companyId)
                   .OrderByDescending(x => x.StartDate)
                   .ToListAsync(ct);

        public async Task<long> CreateAsync(MembershipOrder order, CancellationToken ct = default)
        {
            _db.MembershipOrders.Add(order);
            await _db.SaveChangesAsync(ct);
            return order.MembershipOrderId;
        }

        // === Bổ sung để khớp controller ===
        public Task<MembershipOrder?> GetOrderAsync(long id, CancellationToken ct = default)
            => GetAsync(id, ct);

        // Giả định "Deactivate" = kết thúc gói ngay hôm nay
        public async Task<bool> DeactivateAsync(long id, CancellationToken ct = default)
        {
            var mo = await _db.MembershipOrders.FirstOrDefaultAsync(x => x.MembershipOrderId == id, ct);
            if (mo == null) return false;

            // kết thúc ngay hôm nay (UTC). Đổi sang Local nếu bạn muốn.
            mo.EndDate = DateOnly.FromDateTime(DateTime.UtcNow.Date);
            await _db.SaveChangesAsync(ct);
            return true;
        }
    }
}
