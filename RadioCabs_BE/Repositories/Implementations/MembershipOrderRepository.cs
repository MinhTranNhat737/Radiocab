using Microsoft.EntityFrameworkCore;
using RadioCabs_BE.Models;
using RadioCabs_BE.Repositories.Interfaces;
using Radiocabs_BE.Data;

namespace RadioCabs_BE.Repositories.Implementations
{
    public class MembershipOrderRepository : GenericRepository<MembershipOrder>, IMembershipOrderRepository
    {
        public MembershipOrderRepository(RadiocabsDbContext db) : base(db) { }

        public Task<IReadOnlyList<MembershipOrder>> ListByCompanyAsync(long companyId, CancellationToken ct = default)
            => _set.AsNoTracking().Where(x => x.CompanyId == companyId).ToListAsync(ct);
    }
}
