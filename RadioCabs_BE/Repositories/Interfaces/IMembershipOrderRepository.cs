using RadioCabs_BE.Models;

namespace RadioCabs_BE.Repositories.Interfaces
{
    public interface IMembershipOrderRepository : IGenericRepository<MembershipOrder>
    {
        Task<IReadOnlyList<MembershipOrder>> ListByCompanyAsync(long companyId, CancellationToken ct = default);
    }
}
