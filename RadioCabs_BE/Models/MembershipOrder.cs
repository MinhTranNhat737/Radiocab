namespace RadioCabs_BE.Models
{
    public class MembershipOrder
    {
        public long MembershipOrderId { get; set; }
        public long CompanyId { get; set; }
        public long PayerAccountId { get; set; }
        public int UnitMonths { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal Amount { get; set; }
        public DateOnly StartDate { get; set; }
        public DateOnly EndDate { get; set; }
        public DateTimeOffset? PaidAt { get; set; }
        public PaymentMethod? PaymentMethod { get; set; }
        public string? Note { get; set; }
    }
}
