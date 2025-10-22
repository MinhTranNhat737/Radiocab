using System.Net;

namespace RadioCabs_BE.Models
{
    public class AuthRefreshSession
    {
        public Guid SessionId { get; set; }
        public long AccountId { get; set; }
        public string TokenHash { get; set; } = null!;
        public Guid Jti { get; set; }
        public DateTimeOffset CreatedAt { get; set; }
        public DateTimeOffset ExpiresAt { get; set; }
        public DateTimeOffset? RevokedAt { get; set; }
        public Guid? ReplacedBy { get; set; }
        public IPAddress? Ip { get; set; }
        public string? UserAgent { get; set; }

        // Navigation properties
        public Account Account { get; set; } = null!;
    }
}
