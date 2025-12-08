using Microsoft.EntityFrameworkCore;
using company_service.DTOs;
using company_service.Models;
using common.Repositories;
using company_service.Services.Interfaces;
using common.Models;

namespace company_service.Services
{
    public class CompanyService : ICompanyService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<CompanyService> _logger;

        public CompanyService(IUnitOfWork unitOfWork, ILogger<CompanyService> logger)
        {
            _unitOfWork = unitOfWork;
            _logger = logger;
        }

        public async Task<CompanyDto?> GetByIdAsync(long id)
        {
            try
            {
                _logger.LogInformation($"Getting company by ID: {id}");
                var company = await _unitOfWork.Repository<Company>().GetByIdAsync(id);
                _logger.LogInformation($"Company found: {company != null}");
                
                if (company != null)
                {
                    var result = MapToCompanyDto(company);
                    _logger.LogInformation($"Mapped company: {result.Name}");
                    return result;
                }
                
                return null;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting company by ID: {id}");
                throw;
            }
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

            company.Name = dto.Name ?? company.Name;
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

        public async Task<PagedResult<object>> GetMembershipOrdersAsync(long companyId, PageRequest request)
        {
            _logger.LogInformation($"Getting membership orders for company ID: {companyId}");
            
            try
            {
                var totalCount = await _unitOfWork.Repository<MembershipOrder>().CountAsync(mo => mo.CompanyId == companyId);
                
                // Get IDs only first to avoid DateOnly parsing
                var orderIds = await _unitOfWork.Repository<MembershipOrder>().Query()
                    .Where(mo => mo.CompanyId == companyId)
                    .OrderByDescending(mo => mo.PaidAt ?? DateTimeOffset.MinValue)
                    .Skip((request.Page - 1) * request.PageSize)
                    .Take(request.PageSize)
                    .Select(mo => mo.MembershipOrderId)
                    .ToListAsync();

                // Fetch each order individually with error handling
                var items = new List<object>();
                foreach (var orderId in orderIds)
                {
                    try
                    {
                        var mo = await _unitOfWork.Repository<MembershipOrder>()
                            .Query()
                            .Include(mo => mo.Membership)
                            .FirstOrDefaultAsync(m => m.MembershipOrderId == orderId);

                        if (mo != null)
                        {
                            items.Add(new
                            {
                                membershipOrderId = mo.MembershipOrderId,
                                companyId = mo.CompanyId,
                                payerAccountId = mo.PayerAccountId,
                                membershipId = mo.MembershipId,
                                unitPrice = mo.UnitPrice,
                                unitMonths = mo.UnitMonths,
                                amount = mo.Amount,
                                startDate = mo.StartDate,
                                endDate = mo.EndDate,
                                paidAt = mo.PaidAt,
                                paymentMethod = mo.PaymentMethod,
                                paymentCode = mo.PaymentCode,
                                note = mo.Note,
                                status = mo.PaidAt.HasValue ? "PAID" : "PENDING",
                                membership = mo.Membership != null ? new
                                {
                                    membershipId = mo.Membership.MembershipId,
                                    name = mo.Membership.Name,
                                    code = mo.Membership.Code,
                                    unitPrice = mo.Membership.UnitPrice,
                                    description = mo.Membership.Description,
                                    isActive = mo.Membership.IsActive
                                } : null
                            });
                        }
                    }
                    catch (Exception ex)
                    {
                        _logger.LogWarning(ex, $"Skipping membership order {orderId} due to parsing error: {ex.Message}");
                        // Skip this record and continue
                    }
                }

                _logger.LogInformation($"Found {items.Count} valid membership orders for company {companyId}");

                return new PagedResult<object>
                {
                    Items = items,
                    TotalCount = totalCount,
                    Page = request.Page,
                    PageSize = request.PageSize
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting membership orders for company ID: {companyId}: {ex.Message}");
                // Return empty result instead of throwing
                return new PagedResult<object>
                {
                    Items = new List<object>(),
                    TotalCount = 0,
                    Page = request.Page,
                    PageSize = request.PageSize
                };
            }
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
                UrlPage = company.UrlPage,
                Status = company.Status,
                ContactAccountId = company.ContactAccountId,
                CreatedAt = company.CreatedAt,
                UpdatedAt = company.UpdatedAt
            };
        }
    }
}