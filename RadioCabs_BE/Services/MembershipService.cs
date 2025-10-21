using RadioCabs_BE.Models;
using RadioCabs_BE.Repositories.Interfaces;
using RadioCabs_BE.Services.Interfaces;
using RadioCabs_BE.Repositories;
namespace RadioCabs_BE.Services
{
    public class MembershipService : IMembershipService
    {
        private readonly IMembershipOrderRepository _repo;
        private readonly IUnitOfWork _uow;

        public MembershipService(IMembershipOrderRepository repo, IUnitOfWork uow)
        {
            _repo = repo; _uow = uow;
        }

        public Task<IReadOnlyList<MembershipOrder>> ListByCompanyAsync(long companyId, CancellationToken ct = default)
            => _repo.ListByCompanyAsync(companyId, ct);

        public async Task<MembershipOrder> CreateOrderAsync(MembershipOrder order, CancellationToken ct = default)
        {
            // tính amount nếu client chưa gửi đúng
            if (order.Amount <= 0) order.Amount = order.UnitMonths * order.UnitPrice;
            await _repo.AddAsync(order, ct);
            await _uow.SaveChangesAsync(ct);
            return order;
        }
    }
}
