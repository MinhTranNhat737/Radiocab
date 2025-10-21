namespace RadioCabs_BE.Models
{
    public class Account
    {
        public long AccountId { get; set; }
        public long? CompanyId { get; set; }
        public string Username { get; set; } = null!;
        public string PasswordHash { get; set; } = null!;
        public string FullName { get; set; } = null!;
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public RoleType Role { get; set; } = RoleType.CUSTOMER;
        public ActiveFlag Status { get; set; } = ActiveFlag.ACTIVE;
        public DateTimeOffset CreatedAt { get; set; }
        public DateTimeOffset? UpdatedAt { get; set; }
        public DateTimeOffset? EmailVerifiedAt { get; set; }

        // (tuỳ chọn) điều hướng ngược về Company nếu bạn muốn:
        // public Company? Company { get; set; }
    }
}
