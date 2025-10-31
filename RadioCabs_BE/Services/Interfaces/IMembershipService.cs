using RadioCabs_BE.DTOs;

namespace RadioCabs_BE.Services.Interfaces
{
    public interface IMembershipService
    {
        Task<PagedResult<MembershipDto>> GetPagedAsync(int page, int pageSize, long? companyId, bool? isActive, string? search);
        Task<MembershipDto> CreateAsync(CreateMembershipDto dto);
        Task<MembershipDto?> UpdateAsync(long membershipId, UpdateMembershipDto dto);
        Task<bool> DeleteAsync(long membershipId);
        Task<MembershipDto?> SetActiveAsync(long membershipId, bool isActive);
    }
}


