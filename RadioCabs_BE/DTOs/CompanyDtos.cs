using RadioCabs_BE.Models;

namespace RadioCabs_BE.DTOs
{
    public class CreateCompanyDto
    {
        public string Name { get; set; } = null!;
        public string Hotline { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Address { get; set; } = null!;
        public string TaxCode { get; set; } = null!;
        public string Fax { get; set; } = string.Empty;
        public long? ContactAccountId { get; set; }
    }

    public class UpdateCompanyDto
    {
        public string? Name { get; set; }
        public string? Hotline { get; set; }
        public string? Email { get; set; }
        public string? Address { get; set; }
        public string? TaxCode { get; set; }
        public string? Fax { get; set; }
        public long? ContactAccountId { get; set; }
        public string? Status { get; set; }
    }

    public class CompanyDto
    {
        public long CompanyId { get; set; }
        public string Name { get; set; } = null!;
        public string Hotline { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Address { get; set; } = null!;
        public string TaxCode { get; set; } = null!;
        public string Fax { get; set; } = string.Empty;
        public string Status { get; set; } = null!;
        public long? ContactAccountId { get; set; }
        public DateTimeOffset CreatedAt { get; set; }
        public DateTimeOffset? UpdatedAt { get; set; }
    }
}





