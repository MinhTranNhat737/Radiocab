using System.ComponentModel.DataAnnotations;
using RadioCabs_BE.Models;

namespace RadioCabs_BE.DTOs
{
    public class CreateMembershipOrderDto
    {
        [Required] public long CompanyId { get; set; }
        [Required] public long PayerAccountId { get; set; }
        [Required, Range(1, int.MaxValue)] public int UnitMonths { get; set; }
        [Required, Range(0, double.MaxValue)] public decimal UnitPrice { get; set; }
        [Required] public DateOnly StartDate { get; set; }
        [MaxLength(300)] public string? Note { get; set; }
    }

    public class UpdateMembershipOrderDto
    {
        public PaymentMethod? PaymentMethod { get; set; }
        public DateTimeOffset? PaidAt { get; set; }
        [MaxLength(300)] public string? Note { get; set; }
    }

    public class MembershipOrderResponseDto
    {
        public long MembershipOrderId { get; set; }
        public long CompanyId { get; set; }
        public string CompanyName { get; set; } = null!;
        public long PayerAccountId { get; set; }
        public string PayerName { get; set; } = null!;
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
