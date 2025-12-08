using common.Models;

namespace company_service.Models
{
    public class Company
    {
        public long CompanyId { get; set; }
        public string Name { get; set; } = null!;
        public string Hotline { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Address { get; set; } = null!;
        public string TaxCode { get; set; } = null!;
        public ActiveFlag Status { get; set; } = ActiveFlag.ACTIVE;
        public long? ContactAccountId { get; set; }
        public DateTimeOffset CreatedAt { get; set; }
        public DateTimeOffset? UpdatedAt { get; set; }
        public string Fax { get; set; } = string.Empty;
        public string? UrlPage { get; set; }

        // Navigation properties
        public ICollection<MembershipOrder> MembershipOrders { get; set; } = new List<MembershipOrder>();
        public ICollection<Membership> Memberships { get; set; } = new List<Membership>();
    }
}
