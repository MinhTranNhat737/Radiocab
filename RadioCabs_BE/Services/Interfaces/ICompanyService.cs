using RadioCabs_BE.DTOs;

namespace RadioCabs_BE.Services.Interfaces
{
    public interface ICompanyService
    {
        Task<CompanyDto?> GetByIdAsync(long id);
        Task<PagedResult<CompanyDto>> GetPagedAsync(PageRequest request);
        Task<CompanyDto> CreateAsync(CreateCompanyDto dto);
        Task<CompanyDto?> UpdateAsync(long id, UpdateCompanyDto dto);
        Task<bool> DeleteAsync(long id);
    }
}
