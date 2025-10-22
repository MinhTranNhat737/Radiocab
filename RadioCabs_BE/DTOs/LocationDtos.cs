using System.ComponentModel.DataAnnotations;
using RadioCabs_BE.Models;

namespace RadioCabs_BE.DTOs
{
    public class CreateProvinceDto
    {
        [MaxLength(20)] public string? Code { get; set; }
        [Required, MaxLength(120)] public string Name { get; set; } = null!;
    }

    public class UpdateProvinceDto
    {
        [MaxLength(20)] public string? Code { get; set; }
        [MaxLength(120)] public string? Name { get; set; }
    }

    public class CreateWardDto
    {
        [Required] public long ProvinceId { get; set; }
        [MaxLength(20)] public string? Code { get; set; }
        [Required, MaxLength(120)] public string Name { get; set; } = null!;
    }

    public class UpdateWardDto
    {
        [MaxLength(20)] public string? Code { get; set; }
        [MaxLength(120)] public string? Name { get; set; }
    }

    public class CreateZoneDto
    {
        [Required] public long CompanyId { get; set; }
        [Required] public long ProvinceId { get; set; }
        [Required, MaxLength(40)] public string Code { get; set; } = null!;
        [Required, MaxLength(120)] public string Name { get; set; } = null!;
        [MaxLength(300)] public string? Description { get; set; }
        public bool IsActive { get; set; } = true;
    }

    public class UpdateZoneDto
    {
        [MaxLength(40)] public string? Code { get; set; }
        [MaxLength(120)] public string? Name { get; set; }
        [MaxLength(300)] public string? Description { get; set; }
        public bool? IsActive { get; set; }
    }

    public class AssignWardToZoneDto
    {
        [Required] public long ZoneId { get; set; }
        [Required] public long WardId { get; set; }
    }
}
