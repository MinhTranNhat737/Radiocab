using RadioCabs_BE.Models;

namespace RadioCabs_BE.Services.Interfaces
{
    public interface IMembershipService
    {
        Task<MembershipOrder?> GetAsync(long id, CancellationToken ct = default);
        Task<IReadOnlyList<MembershipOrder>> ListByCompanyAsync(long companyId, CancellationToken ct = default);
        Task<long> CreateAsync(MembershipOrder order, CancellationToken ct = default);

        // Bổ sung để khớp controller:
        Task<MembershipOrder?> GetOrderAsync(long id, CancellationToken ct = default);
        Task<bool> DeactivateAsync(long id, CancellationToken ct = default);
    }
}
