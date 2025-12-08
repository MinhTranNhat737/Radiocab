using geo_service.Models;
using common.Models;

namespace geo_service.DTOs
{
  
    public class WardDto
    {
        public long WardId { get; set; }
        public long ProvinceId { get; set; }
        public string? Code { get; set; }
        public string Name { get; set; } = null!;
        
        // Navigation properties
        public ProvinceDto Province { get; set; } = null!;
        public ICollection<ZoneWardDto> ZoneWards { get; set; } = new List<ZoneWardDto>();
    }

    // ==================== ZONE DTOs ====================
    
    public class ZoneDto
    {
        public long ZoneId { get; set; }
        public long CompanyId { get; set; }
        public long ProvinceId { get; set; }
        public string Code { get; set; } = null!;
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        
        // Navigation properties
        public ProvinceDto Province { get; set; } = null!;
        public ICollection<ZoneWardDto> ZoneWards { get; set; } = new List<ZoneWardDto>();
    }

    public class CreateZoneDto
    {
        public long CompanyId { get; set; }
        public long ProvinceId { get; set; }
        public string Code { get; set; } = null!;
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public bool IsActive { get; set; } = true;
        
        public List<long>? WardIds { get; set; }
    }

    public class UpdateZoneDto
    {
        public string Code { get; set; } = null!;
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public bool IsActive { get; set; }
        
        public List<long>? WardIds { get; set; }
    }

    public class ZoneWardDto
    {
        public long ZoneId { get; set; }
        public long WardId { get; set; }
        
        // Navigation properties
        public ZoneDto Zone { get; set; } = null!;
        public WardDto Ward { get; set; } = null!;
        public ProvinceDto Province { get; set; } = null!;
    }
    public class ProvinceDto
    {
        public long ProvinceId { get; set; }
        public string Code { get; set; }
        public string Name{ get; set; }
        
    }

}





