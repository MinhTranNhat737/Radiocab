using Microsoft.EntityFrameworkCore;
using RadioCabs_BE.Data;
using RadioCabs_BE.Models;
using RadioCabs_BE.Repositories.Interfaces;

namespace RadioCabs_BE.Repositories.Implementations
{
    public class MembershipRepository : GenericRepository<MembershipOrder>, IMembershipRepository
    {
        public MembershipRepository(RadiocabsDbContext context) : base(context) { }

        public async Task<IReadOnlyList<MembershipOrder>> ListByCompanyAsync(long companyId, CancellationToken ct = default)
            => await _context.MembershipOrders
                .AsNoTracking()
                .Where(x => x.CompanyId == companyId)
                .OrderByDescending(x => x.StartDate)
                .ToListAsync(ct);

        public async Task<IReadOnlyList<MembershipOrder>> ListByPayerAsync(long payerAccountId, CancellationToken ct = default)
            => await _context.MembershipOrders
                .AsNoTracking()
                .Where(x => x.PayerAccountId == payerAccountId)
                .OrderByDescending(x => x.StartDate)
                .ToListAsync(ct);

        public async Task<IReadOnlyList<MembershipOrder>> ListByDateRangeAsync(DateOnly fromDate, DateOnly toDate, CancellationToken ct = default)
            => await _context.MembershipOrders
                .AsNoTracking()
                .Where(x => x.StartDate >= fromDate && x.StartDate <= toDate)
                .OrderByDescending(x => x.StartDate)
                .ToListAsync(ct);

        public async Task<IReadOnlyList<MembershipOrder>> ListPaidAsync(CancellationToken ct = default)
            => await _context.MembershipOrders
                .AsNoTracking()
                .Where(x => x.PaidAt != null)
                .OrderByDescending(x => x.PaidAt)
                .ToListAsync(ct);

        public async Task<IReadOnlyList<MembershipOrder>> ListUnpaidAsync(CancellationToken ct = default)
            => await _context.MembershipOrders
                .AsNoTracking()
                .Where(x => x.PaidAt == null)
                .OrderByDescending(x => x.StartDate)
                .ToListAsync(ct);
    }
}
