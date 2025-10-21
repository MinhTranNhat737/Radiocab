using Microsoft.EntityFrameworkCore;
using RadioCabs_BE.Models;
using RadioCabs_BE.Repositories.Interfaces;
using Radiocabs_BE.Data;

namespace RadioCabs_BE.Repositories.Implementations
{
    public class DrivingOrderRepository : GenericRepository<DrivingOrder>, IDrivingOrderRepository
    {
        public DrivingOrderRepository(RadiocabsDbContext db) : base(db) { }

        public async Task<IReadOnlyList<DrivingOrder>> ListByCompanyAndStatusAsync(
            long companyId, OrderStatus status, CancellationToken ct = default)
        {
            var data = await _set.AsNoTracking()
                                 .Where(o => o.CompanyId == companyId && o.Status == status)
                                 .OrderByDescending(o => o.CreatedAt)
                                 .ToListAsync(ct);
            return data; // List<DrivingOrder> -> IReadOnlyList<DrivingOrder>
        }
    }
}
