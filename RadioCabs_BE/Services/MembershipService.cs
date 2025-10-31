using Microsoft.EntityFrameworkCore;
using RadioCabs_BE.DTOs;
using RadioCabs_BE.Models;
using RadioCabs_BE.Repositories;
using RadioCabs_BE.Services.Interfaces;
using Npgsql;

namespace RadioCabs_BE.Services
{
    public class MembershipService : IMembershipService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<MembershipService> _logger;

        public MembershipService(IUnitOfWork unitOfWork, ILogger<MembershipService> logger)
        {
            _unitOfWork = unitOfWork;
            _logger = logger;
        }

        public async Task<PagedResult<MembershipDto>> GetPagedAsync(int page, int pageSize, long? companyId, bool? isActive, string? search)
        {
            var repo = _unitOfWork.Repository<Membership>();

            var query = repo.Query();
            if (companyId.HasValue)
            {
                query = query.Where(m => m.CompanyId == companyId.Value);
            }
            if (isActive.HasValue)
            {
                query = query.Where(m => m.IsActive == isActive.Value);
            }
            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(m => m.Name.Contains(search) || m.Code.Contains(search));
            }

            var totalCount = await query.CountAsync();
            var items = await query
                .OrderByDescending(m => m.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(m => new MembershipDto
                {
                    MembershipId = m.MembershipId,
                    CompanyId = m.CompanyId,
                    Name = m.Name,
                    Code = m.Code,
                    UnitPrice = m.UnitPrice,
                    Description = m.Description,
                    IsActive = m.IsActive,
                    CreatedAt = m.CreatedAt,
                    UpdatedAt = m.UpdatedAt
                })
                .ToListAsync();

            return new PagedResult<MembershipDto>
            {
                Items = items,
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize
            };
        }

        public async Task<MembershipDto> CreateAsync(CreateMembershipDto dto)
        {
            // Enforce unique code per company
            var exists = await _unitOfWork.Repository<Membership>().Query()
                .AnyAsync(m => m.CompanyId == dto.CompanyId && m.Code == dto.Code);
            if (exists)
            {
                throw new InvalidOperationException("Membership code already exists for this company");
            }

            var entity = new Membership
            {
                CompanyId = dto.CompanyId,
                Name = dto.Name,
                Code = dto.Code,
                UnitPrice = dto.UnitPrice,
                Description = dto.Description,
                IsActive = dto.IsActive,
                CreatedAt = DateTimeOffset.UtcNow
            };

            try
            {
                await _unitOfWork.Repository<Membership>().AddAsync(entity);
                await _unitOfWork.SaveChangesAsync();
            }
            catch (DbUpdateException ex) when (ex.InnerException is PostgresException pex && pex.SqlState == "23505" && (pex.ConstraintName ?? string.Empty).Contains("membership_pkey"))
            {
                // Sequence likely out-of-sync after DB import; reseed and retry once
                await _unitOfWork.ExecuteSqlAsync("SELECT setval('public.membership_membership_id_seq', (SELECT COALESCE(MAX(membership_id),0) FROM public.membership), true);");

                await _unitOfWork.Repository<Membership>().AddAsync(entity);
                await _unitOfWork.SaveChangesAsync();
            }

            return new MembershipDto
            {
                MembershipId = entity.MembershipId,
                CompanyId = entity.CompanyId,
                Name = entity.Name,
                Code = entity.Code,
                UnitPrice = entity.UnitPrice,
                Description = entity.Description,
                IsActive = entity.IsActive,
                CreatedAt = entity.CreatedAt,
                UpdatedAt = entity.UpdatedAt
            };
        }

        public async Task<MembershipDto?> UpdateAsync(long membershipId, UpdateMembershipDto dto)
        {
            var repo = _unitOfWork.Repository<Membership>();
            var entity = await repo.GetByIdAsync(membershipId);
            if (entity == null) return null;

            // Determine if this update changes non-toggle fields
            var modifiesNonToggle = (dto.Name != null) || (dto.Code != null) || (dto.UnitPrice.HasValue) || (dto.Description != null);

            // If changing fields other than IsActive, block when membership has orders
            if (modifiesNonToggle)
            {
                var hasOrders = await _unitOfWork.Repository<MembershipOrder>().Query()
                    .AnyAsync(o => o.MembershipId == membershipId);
                if (hasOrders)
                {
                    throw new InvalidOperationException("Cannot update a membership that has orders");
                }
            }

            if (dto.Name != null) entity.Name = dto.Name;
            if (dto.Code != null)
            {
                // Ensure unique per company when changing code
                var exists = await _unitOfWork.Repository<Membership>().Query()
                    .AnyAsync(m => m.CompanyId == entity.CompanyId && m.Code == dto.Code && m.MembershipId != membershipId);
                if (exists)
                {
                    throw new InvalidOperationException("Membership code already exists for this company");
                }
                entity.Code = dto.Code;
            }
            if (dto.UnitPrice.HasValue) entity.UnitPrice = dto.UnitPrice.Value;
            if (dto.Description != null) entity.Description = dto.Description;
            if (dto.IsActive.HasValue)
            {
                if (dto.IsActive.Value)
                {
                    // Enforce single active membership per company
                    var otherActiveExists = await _unitOfWork.Repository<Membership>().Query()
                        .AnyAsync(m => m.CompanyId == entity.CompanyId && m.IsActive && m.MembershipId != membershipId);
                    if (otherActiveExists)
                    {
                        throw new InvalidOperationException("Another active membership already exists for this company");
                    }
                }
                entity.IsActive = dto.IsActive.Value;
            }
            entity.UpdatedAt = DateTimeOffset.UtcNow;

            repo.Update(entity);
            await _unitOfWork.SaveChangesAsync();

            return new MembershipDto
            {
                MembershipId = entity.MembershipId,
                CompanyId = entity.CompanyId,
                Name = entity.Name,
                Code = entity.Code,
                UnitPrice = entity.UnitPrice,
                Description = entity.Description,
                IsActive = entity.IsActive,
                CreatedAt = entity.CreatedAt,
                UpdatedAt = entity.UpdatedAt
            };
        }

        public async Task<bool> DeleteAsync(long membershipId)
        {
            var repo = _unitOfWork.Repository<Membership>();
            var entity = await repo.GetByIdAsync(membershipId);
            if (entity == null) return false;

            // Prevent delete if has orders
            var hasOrders = await _unitOfWork.Repository<MembershipOrder>().Query()
                .AnyAsync(o => o.MembershipId == membershipId);
            if (hasOrders)
            {
                throw new InvalidOperationException("Cannot delete a membership that has orders");
            }

            repo.Remove(entity);
            await _unitOfWork.SaveChangesAsync();
            return true;
        }

        public async Task<MembershipDto?> SetActiveAsync(long membershipId, bool isActive)
        {
            var repo = _unitOfWork.Repository<Membership>();
            var entity = await repo.GetByIdAsync(membershipId);
            if (entity == null) return null;

            if (isActive)
            {
                var otherActiveExists = await _unitOfWork.Repository<Membership>().Query()
                    .AnyAsync(m => m.CompanyId == entity.CompanyId && m.IsActive && m.MembershipId != membershipId);
                if (otherActiveExists)
                {
                    throw new InvalidOperationException("Another active membership already exists for this company");
                }
            }

            entity.IsActive = isActive;
            entity.UpdatedAt = DateTimeOffset.UtcNow;
            repo.Update(entity);
            await _unitOfWork.SaveChangesAsync();

            return new MembershipDto
            {
                MembershipId = entity.MembershipId,
                CompanyId = entity.CompanyId,
                Name = entity.Name,
                Code = entity.Code,
                UnitPrice = entity.UnitPrice,
                Description = entity.Description,
                IsActive = entity.IsActive,
                CreatedAt = entity.CreatedAt,
                UpdatedAt = entity.UpdatedAt
            };
        }
    }
}


