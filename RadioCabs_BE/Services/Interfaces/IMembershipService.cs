using RadioCabs_BE.Models;

namespace RadioCabs_BE.Services.Interfaces
{
    public interface IMembershipService
    {
        Task<IReadOnlyList<MembershipOrder>> ListByCompanyAsync(long companyId, CancellationToken ct = default);

        Task<MembershipOrder> CreateOrderAsync(MembershipOrder order, CancellationToken ct = default);
    }
}
