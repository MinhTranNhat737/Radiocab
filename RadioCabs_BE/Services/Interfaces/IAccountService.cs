using RadioCabs_BE.DTOs;
using RadioCabs_BE.Models;

namespace RadioCabs_BE.Services.Interfaces
{
    public interface IAccountService
    {
        Task<AccountDto?> GetByIdAsync(long id);
        Task<AccountDto?> GetByUsernameAsync(string username);
        Task<PagedResult<AccountDto>> GetPagedAsync(PageRequest request, long? companyId = null, string? role = null);
        Task<AccountDto> CreateAsync(CreateAccountDto dto);
        Task<AccountDto?> UpdateAsync(long id, UpdateAccountDto dto);
        Task<bool> DeleteAsync(long id);
        Task<AuthResponseDto> LoginAsync(LoginDto dto);
        Task<bool> ChangePasswordAsync(long accountId, string currentPassword, string newPassword);
        Task<bool> VerifyEmailAsync(string email, string code);
        Task<bool> SendEmailVerificationAsync(string email);
        Task<bool> SendPasswordResetAsync(string email);
        Task<bool> ResetPasswordAsync(string email, string code, string newPassword);
    }
}
