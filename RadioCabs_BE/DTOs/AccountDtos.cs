using System.ComponentModel.DataAnnotations;
using RadioCabs_BE.Models;

namespace RadioCabs_BE.DTOs
{
    public class CreateAccountDto
    {
        [Required, MaxLength(50)] public string Username { get; set; } = null!;
        [Required, MaxLength(120)] public string FullName { get; set; } = null!;
        [MaxLength(20)] public string? Phone { get; set; }
        [EmailAddress, MaxLength(145)] public string? Email { get; set; }
        public RoleType Role { get; set; } = RoleType.CUSTOMER;
        public long? CompanyId { get; set; }
    }

    public class UpdateAccountDto
    {
        [MaxLength(120)] public string? FullName { get; set; }
        [MaxLength(20)] public string? Phone { get; set; }
        [EmailAddress, MaxLength(145)] public string? Email { get; set; }
        public ActiveFlag? Status { get; set; }
    }

    public class ChangePasswordDto
    {
        [Required] public string CurrentPassword { get; set; } = null!;
        [Required, MinLength(6)] public string NewPassword { get; set; } = null!;
    }

    public class LoginDto
    {
        [Required] public string Username { get; set; } = null!;
        [Required] public string Password { get; set; } = null!;
    }

    public class AuthResponseDto
    {
        public long AccountId { get; set; }
        public string Username { get; set; } = null!;
        public string FullName { get; set; } = null!;
        public RoleType Role { get; set; }
        public long? CompanyId { get; set; }
        public string AccessToken { get; set; } = null!;
        public string RefreshToken { get; set; } = null!;
        public DateTimeOffset ExpiresAt { get; set; }
    }
}
