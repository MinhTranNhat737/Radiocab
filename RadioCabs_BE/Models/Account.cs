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
        public string Role { get; set; } = "CUSTOMER";
        public string Status { get; set; } = "ACTIVE";
        public DateTimeOffset CreatedAt { get; set; }
        public DateTimeOffset? UpdatedAt { get; set; }
        public DateTimeOffset? EmailVerifiedAt { get; set; }

        // Navigation properties
        public Company? Company { get; set; }
    }
}
