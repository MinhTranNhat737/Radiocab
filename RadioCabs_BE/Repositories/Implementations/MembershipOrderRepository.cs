using Microsoft.EntityFrameworkCore;
using RadioCabs_BE.Models;
using RadioCabs_BE.Repositories.Interfaces;
using Radiocabs_BE.Data;

namespace RadioCabs_BE.Repositories.Implementations
{
    public class MembershipOrderRepository : GenericRepository<MembershipOrder>, IMembershipOrderRepository
    {
        public MembershipOrderRepository(RadiocabsDbContext db) : base(db) { }

        public async Task<IReadOnlyList<MembershipOrder>> ListByCompanyAsync(
            long companyId, CancellationToken ct = default)
        {
            var rows = await _set.AsNoTracking()
                                 .Where(x => x.CompanyId == companyId)
                                 .OrderByDescending(x => x.StartDate)
                                 .ToListAsync(ct);
            return rows;
        }
    }
}
