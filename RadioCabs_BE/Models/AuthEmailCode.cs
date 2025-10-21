namespace RadioCabs_BE.Models
{
    public class AuthEmailCode
    {
        public long CodeId { get; set; }
        public long? AccountId { get; set; }
        public string Email { get; set; } = null!;
        public string Purpose { get; set; } = null!; // varchar(30)
        public string CodeHash { get; set; } = null!;
        public DateTimeOffset SentAt { get; set; }
        public DateTimeOffset ExpiresAt { get; set; }
        public DateTimeOffset? ConsumedAt { get; set; }
        public int AttemptCount { get; set; } = 0;
        public int MaxAttempts { get; set; } = 5;

        // Navigation (optional)
        public Account? Account { get; set; }
    }
}
