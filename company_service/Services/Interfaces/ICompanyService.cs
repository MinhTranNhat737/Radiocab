using company_service.DTOs;

namespace company_service.Services.Interfaces
{
    public interface ICompanyService
    {
        Task<CompanyDto?> GetByIdAsync(long id);
        Task<PagedResult<CompanyDto>> GetPagedAsync(PageRequest request);
        Task<CompanyDto> CreateAsync(CreateCompanyDto dto);
        Task<CompanyDto?> UpdateAsync(long id, UpdateCompanyDto dto);
        Task<bool> DeleteAsync(long id);
        Task<PagedResult<object>> GetMembershipOrdersAsync(long companyId, PageRequest request);
    }
}
