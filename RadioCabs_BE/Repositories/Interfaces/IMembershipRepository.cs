using RadioCabs_BE.Models;

namespace RadioCabs_BE.Repositories.Interfaces
{
    public interface IMembershipRepository : IGenericRepository<MembershipOrder>
    {
        Task<IReadOnlyList<MembershipOrder>> ListByCompanyAsync(long companyId, CancellationToken ct = default);
        Task<IReadOnlyList<MembershipOrder>> ListByPayerAsync(long payerAccountId, CancellationToken ct = default);
        Task<IReadOnlyList<MembershipOrder>> ListByDateRangeAsync(DateOnly fromDate, DateOnly toDate, CancellationToken ct = default);
        Task<IReadOnlyList<MembershipOrder>> ListPaidAsync(CancellationToken ct = default);
        Task<IReadOnlyList<MembershipOrder>> ListUnpaidAsync(CancellationToken ct = default);
    }
}
