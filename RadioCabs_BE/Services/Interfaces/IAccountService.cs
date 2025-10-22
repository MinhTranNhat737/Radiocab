using RadioCabs_BE.DTOs;
using RadioCabs_BE.Models;

namespace RadioCabs_BE.Services.Interfaces
{
    public interface IAccountService
    {
        Task<Account?> GetAsync(long id, CancellationToken ct = default);
        Task<Account?> GetByUsernameAsync(string username, CancellationToken ct = default);
        Task<IReadOnlyList<Account>> ListByCompanyAsync(long companyId, CancellationToken ct = default);
        Task<IReadOnlyList<Account>> ListByRoleAsync(RoleType role, CancellationToken ct = default);
        Task<Account> CreateAsync(CreateAccountDto dto, CancellationToken ct = default);
        Task<bool> UpdateAsync(long id, UpdateAccountDto dto, CancellationToken ct = default);
        Task<bool> ChangePasswordAsync(long id, ChangePasswordDto dto, CancellationToken ct = default);
        Task<bool> SetStatusAsync(long id, ActiveFlag status, CancellationToken ct = default);
        Task<AuthResponseDto?> LoginAsync(LoginDto dto, CancellationToken ct = default);
        Task<bool> IsUsernameExistsAsync(string username, CancellationToken ct = default);
        Task<bool> IsEmailExistsAsync(string email, CancellationToken ct = default);
    }
}
