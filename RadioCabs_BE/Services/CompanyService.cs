using Microsoft.EntityFrameworkCore;
using RadioCabs_BE.DTOs;
using RadioCabs_BE.Models;
using RadioCabs_BE.Repositories;
using RadioCabs_BE.Services.Interfaces;

namespace RadioCabs_BE.Services
{
    public class CompanyService : ICompanyService
    {
        private readonly IUnitOfWork _unitOfWork;

        public CompanyService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<CompanyDto?> GetByIdAsync(long id)
        {
            var company = await _unitOfWork.Repository<Company>().GetByIdAsync(id);
            return company != null ? MapToCompanyDto(company) : null;
        }

        public async Task<PagedResult<CompanyDto>> GetPagedAsync(PageRequest request)
        {
            var repository = _unitOfWork.Repository<Company>();
            var query = repository.FindAsync(c => true).Result.AsQueryable();

            if (!string.IsNullOrEmpty(request.Search))
            {
                query = query.Where(c => c.Name.Contains(request.Search) || c.Email.Contains(request.Search) || c.TaxCode.Contains(request.Search));
            }

            var totalCount = await repository.CountAsync();
            var items = query
                .Skip((request.Page - 1) * request.PageSize)
                .Take(request.PageSize)
                .Select(c => MapToCompanyDto(c))
                .ToList();

            return new PagedResult<CompanyDto>
            {
                Items = items,
                TotalCount = totalCount,
                Page = request.Page,
                PageSize = request.PageSize
            };
        }

        public async Task<CompanyDto> CreateAsync(CreateCompanyDto dto)
        {
            var company = new Company
            {
                Name = dto.Name,
                Hotline = dto.Hotline,
                Email = dto.Email,
                Address = dto.Address,
                TaxCode = dto.TaxCode,
                Fax = dto.Fax,
                ContactAccountId = dto.ContactAccountId,
                Status = ActiveFlag.ACTIVE,
                CreatedAt = DateTimeOffset.UtcNow
            };

            await _unitOfWork.Repository<Company>().AddAsync(company);
            await _unitOfWork.SaveChangesAsync();

            return MapToCompanyDto(company);
        }

        public async Task<CompanyDto?> UpdateAsync(long id, UpdateCompanyDto dto)
        {
            var company = await _unitOfWork.Repository<Company>().GetByIdAsync(id);
            if (company == null) return null;

            if (dto.Name != null) company.Name = dto.Name;
            if (dto.Hotline != null) company.Hotline = dto.Hotline;
            if (dto.Email != null) company.Email = dto.Email;
            if (dto.Address != null) company.Address = dto.Address;
            if (dto.TaxCode != null) company.TaxCode = dto.TaxCode;
            if (dto.Fax != null) company.Fax = dto.Fax;
            if (dto.ContactAccountId.HasValue) company.ContactAccountId = dto.ContactAccountId.Value;
            if (dto.Status.HasValue) company.Status = dto.Status.Value;
            company.UpdatedAt = DateTimeOffset.UtcNow;

            _unitOfWork.Repository<Company>().Update(company);
            await _unitOfWork.SaveChangesAsync();

            return MapToCompanyDto(company);
        }

        public async Task<bool> DeleteAsync(long id)
        {
            var company = await _unitOfWork.Repository<Company>().GetByIdAsync(id);
            if (company == null) return false;

            _unitOfWork.Repository<Company>().Remove(company);
            await _unitOfWork.SaveChangesAsync();

            return true;
        }

        private CompanyDto MapToCompanyDto(Company company)
        {
            return new CompanyDto
            {
                CompanyId = company.CompanyId,
                Name = company.Name,
                Hotline = company.Hotline,
                Email = company.Email,
                Address = company.Address,
                TaxCode = company.TaxCode,
                Fax = company.Fax,
                Status = company.Status,
                ContactAccountId = company.ContactAccountId,
                CreatedAt = company.CreatedAt,
                UpdatedAt = company.UpdatedAt
            };
        }
    }
}