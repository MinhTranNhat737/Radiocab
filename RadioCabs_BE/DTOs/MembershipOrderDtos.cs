using System.ComponentModel.DataAnnotations;
using RadioCabs_BE.Models;

namespace RadioCabs_BE.DTOs
{
    public class CreateMembershipOrderDto
    {
        [Required] public long PayerAccountId { get; set; }
        public long? MembershipId { get; set; }
        [Required] public decimal UnitPrice { get; set; }
        [Required] public int UnitMonths { get; set; }
        [Required] public decimal Amount { get; set; }
        public string? PaymentMethod { get; set; }
        public string? PaymentCode { get; set; }
        public string? Note { get; set; }
    }

    public class MembershipOrderDto
    {
        public long MembershipOrderId { get; set; }
        public long CompanyId { get; set; }
        public long PayerAccountId { get; set; }
        public long? MembershipId { get; set; }
        public decimal UnitPrice { get; set; }
        public int UnitMonths { get; set; }
        public decimal Amount { get; set; }
        public DateOnly StartDate { get; set; }
        public DateOnly EndDate { get; set; }
        public DateTimeOffset? PaidAt { get; set; }
        public PaymentMethod? PaymentMethod { get; set; }
        public string? PaymentCode { get; set; }
        public string? Note { get; set; }
    }
}


