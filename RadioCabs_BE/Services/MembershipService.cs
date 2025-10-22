using Microsoft.EntityFrameworkCore;
using RadioCabs_BE.Data;
using RadioCabs_BE.DTOs;
using RadioCabs_BE.Models;
using RadioCabs_BE.Repositories.Interfaces;
using RadioCabs_BE.Services.Interfaces;

namespace RadioCabs_BE.Services
{
    public class MembershipService : IMembershipService
    {
        private readonly IMembershipRepository _repo;
        private readonly RadiocabsDbContext _db;
        private readonly IUnitOfWork _uow;

        public MembershipService(IMembershipRepository repo, RadiocabsDbContext db, IUnitOfWork uow)
        {
            _repo = repo;
            _db = db;
            _uow = uow;
        }

        public async Task<MembershipOrder?> GetAsync(long id, CancellationToken ct = default)
            => await _repo.GetByIdAsync(id, ct);

        public async Task<IReadOnlyList<MembershipOrder>> ListByCompanyAsync(long companyId, CancellationToken ct = default)
            => await _repo.ListByCompanyAsync(companyId, ct);

        public async Task<IReadOnlyList<MembershipOrder>> ListByPayerAsync(long payerAccountId, CancellationToken ct = default)
            => await _repo.ListByPayerAsync(payerAccountId, ct);

        public async Task<MembershipOrder> CreateAsync(CreateMembershipOrderDto dto, CancellationToken ct = default)
        {
            var order = new MembershipOrder
            {
                CompanyId = dto.CompanyId,
                PayerAccountId = dto.PayerAccountId,
                UnitMonths = dto.UnitMonths,
                UnitPrice = dto.UnitPrice,
                Amount = dto.UnitMonths * dto.UnitPrice,
                StartDate = dto.StartDate,
                EndDate = dto.StartDate.AddMonths(dto.UnitMonths),
                Note = dto.Note
            };

            await _repo.AddAsync(order, ct);
            await _uow.SaveChangesAsync(ct);
            return order;
        }

        public async Task<bool> UpdateAsync(long id, UpdateMembershipOrderDto dto, CancellationToken ct = default)
        {
            var order = await _repo.GetByIdAsync(id, ct);
            if (order == null) return false;

            if (dto.PaymentMethod.HasValue)
                order.PaymentMethod = dto.PaymentMethod.Value;
            if (dto.PaidAt.HasValue)
                order.PaidAt = dto.PaidAt.Value;
            if (!string.IsNullOrEmpty(dto.Note))
                order.Note = dto.Note;

            _repo.Update(order);
            return await _uow.SaveChangesAsync(ct) > 0;
        }

        public async Task<bool> MarkPaidAsync(long id, PaymentMethod paymentMethod, CancellationToken ct = default)
        {
            var order = await _repo.GetByIdAsync(id, ct);
            if (order == null) return false;

            order.PaymentMethod = paymentMethod;
            order.PaidAt = DateTimeOffset.Now;

            _repo.Update(order);
            return await _uow.SaveChangesAsync(ct) > 0;
        }

        public async Task<IReadOnlyList<MembershipOrder>> ListPaidAsync(CancellationToken ct = default)
            => await _repo.ListPaidAsync(ct);

        public async Task<IReadOnlyList<MembershipOrder>> ListUnpaidAsync(CancellationToken ct = default)
            => await _repo.ListUnpaidAsync(ct);

        public async Task<IReadOnlyList<MembershipOrderResponseDto>> ListWithDetailsAsync(long? companyId = null, CancellationToken ct = default)
        {
            var query = _db.MembershipOrders
                .AsNoTracking()
                .Include(x => x.Company)
                .Include(x => x.Payer);

            if (companyId.HasValue)
                query = query.Where(x => x.CompanyId == companyId.Value);

            var orders = await query
                .OrderByDescending(x => x.StartDate)
                .ToListAsync(ct);

            return orders.Select(x => new MembershipOrderResponseDto
            {
                MembershipOrderId = x.MembershipOrderId,
                CompanyId = x.CompanyId,
                CompanyName = x.Company.Name,
                PayerAccountId = x.PayerAccountId,
                PayerName = x.Payer.FullName,
                UnitMonths = x.UnitMonths,
                UnitPrice = x.UnitPrice,
                Amount = x.Amount,
                StartDate = x.StartDate,
                EndDate = x.EndDate,
                PaidAt = x.PaidAt,
                PaymentMethod = x.PaymentMethod,
                Note = x.Note
            }).ToList();
        }
    }
}