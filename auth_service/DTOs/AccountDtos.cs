using auth_service.Models;
using common.Models;
namespace auth_service.DTOs
{
    public class CreateAccountDto
    {
        public long? CompanyId { get; set; }
        public string Username { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string FullName { get; set; } = null!;
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public RoleType Role { get; set; } = RoleType.CUSTOMER;
    }

    public class UpdateAccountDto
    {
        public string? FullName { get; set; }
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public RoleType? Role { get; set; }
        public ActiveFlag? Status { get; set; }
    }

    public class LoginDto
    {
        public string Username { get; set; } = null!;
        public string Password { get; set; } = null!;
    }

    public class AuthResponseDto
    {
        public string AccessToken { get; set; } = null!;
        public string RefreshToken { get; set; } = null!;
        public DateTimeOffset ExpiresAt { get; set; }
        public AccountDto Account { get; set; } = null!;
    }

    public class AccountDto
    {
        public long? AccountId { get; set; }
        public long? CompanyId { get; set; }
        public string Username { get; set; } = null!;
        public string FullName { get; set; } = null!;
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public RoleType Role { get; set; }
        public ActiveFlag Status { get; set; }
        public DateTimeOffset CreatedAt { get; set; }
        public DateTimeOffset? UpdatedAt { get; set; }
        public DateTimeOffset? EmailVerifiedAt { get; set; }
    }
    public class ChangePasswordDto
    {
        public long AccountId { get; set; }
        public string CurrentPassword { get; set; } = null!;
        public string NewPassword { get; set; } = null!;
    }

    public class VerifyEmailDto
    {
        public string Email { get; set; } = null!;
        public string Code { get; set; } = null!;
    }

    public class SendEmailVerificationDto
    {
        public string Email { get; set; } = null!;
    }
}
