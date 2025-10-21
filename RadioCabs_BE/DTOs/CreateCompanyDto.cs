using System.ComponentModel.DataAnnotations;

namespace Radiocabs_BE.DTOs
{
    public class CreateCompanyDto
    {
        [Required, MaxLength(145)] public string Name { get; set; } = null!;
        [Required, MaxLength(45)] public string Hotline { get; set; } = null!;
        [Required, EmailAddress, MaxLength(145)] public string Email { get; set; } = null!;
        [Required, MaxLength(255)] public string Address { get; set; } = null!;
        [Required, MaxLength(50)] public string TaxCode { get; set; } = null!;
        // contact_account_id sẽ set tạm 1 user có sẵn hoặc bạn truyền qua query cũng được
        public long ContactAccountId { get; set; } = 1;
        public string Fax { get; set; } = "";
    }
}
