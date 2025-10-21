using Microsoft.EntityFrameworkCore;

namespace RadioCabs_BE.Models
{
    public class MembershipOrder
    {
        public long MembershipOrderId { get; set; }
        public long CompanyId { get; set; }
        public long PayerAccountId { get; set; }

        [Precision(12, 2)] public decimal UnitPrice { get; set; }
        public int UnitMonths { get; set; }
        [Precision(14, 2)] public decimal Amount { get; set; }

        public DateOnly StartDate { get; set; }
        public DateOnly EndDate { get; set; }

        public DateTimeOffset? PaidAt { get; set; }
        public PaymentMethod? PaymentMethod { get; set; }
        public string? Note { get; set; }

        // Navigations (khớp DbContext)
        public Company Company { get; set; } = null!;
        public Account Payer { get; set; } = null!;
    }
}
