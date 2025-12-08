using Microsoft.EntityFrameworkCore;

namespace RadioCabs_BE.Models
{
    public class Membership
    {
        public long MembershipId { get; set; }
        public long CompanyId { get; set; }
        public string Name { get; set; } = null!;
        public string Code { get; set; } = null!;
        public decimal UnitPrice { get; set; }
        public string? Description { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTimeOffset CreatedAt { get; set; }
        public DateTimeOffset? UpdatedAt { get; set; }

        // Navigation properties
        public Company Company { get; set; } = null!;
        public ICollection<MembershipOrder> MembershipOrders { get; set; } = new List<MembershipOrder>();
    }
}
