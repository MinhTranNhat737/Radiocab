using RadioCabs_BE.Models;

namespace RadioCabs_BE.Repositories.Interfaces
{
    public interface IAccountRepository : IGenericRepository<Account>
    {
        Task<Account?> GetByUsernameAsync(string username, CancellationToken ct = default);
        Task<Account?> GetByEmailAsync(string email, CancellationToken ct = default);
        Task<IReadOnlyList<Account>> ListByCompanyAsync(long companyId, CancellationToken ct = default);
        Task<IReadOnlyList<Account>> ListByRoleAsync(RoleType role, CancellationToken ct = default);
        Task<bool> IsUsernameExistsAsync(string username, CancellationToken ct = default);
        Task<bool> IsEmailExistsAsync(string email, CancellationToken ct = default);
    }
}