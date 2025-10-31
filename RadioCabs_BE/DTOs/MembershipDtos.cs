using System.ComponentModel.DataAnnotations;

namespace RadioCabs_BE.DTOs
{
    public class CreateMembershipDto
    {
        [Required] public long CompanyId { get; set; }
        [Required] public string Name { get; set; } = null!;
        [Required] public string Code { get; set; } = null!;
        [Required] public decimal UnitPrice { get; set; }
        public string? Description { get; set; }
        public bool IsActive { get; set; } = true;
    }

    public class UpdateMembershipDto
    {
        public string? Name { get; set; }
        public string? Code { get; set; }
        public decimal? UnitPrice { get; set; }
        public string? Description { get; set; }
        public bool? IsActive { get; set; }
    }

    public class MembershipDto
    {
        public long MembershipId { get; set; }
        public long CompanyId { get; set; }
        public string Name { get; set; } = null!;
        public string Code { get; set; } = null!;
        public decimal UnitPrice { get; set; }
        public string? Description { get; set; }
        public bool IsActive { get; set; }
        public DateTimeOffset CreatedAt { get; set; }
        public DateTimeOffset? UpdatedAt { get; set; }
    }
}


