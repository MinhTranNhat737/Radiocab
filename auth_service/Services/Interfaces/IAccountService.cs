using auth_service.DTOs;

namespace auth_service.Services.Interfaces
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
    }
}
