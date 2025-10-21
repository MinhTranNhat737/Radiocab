using Microsoft.EntityFrameworkCore;
using RadioCabs_BE.Models;
using RadioCabs_BE.Repositories.Interfaces;
using Radiocabs_BE.Data;

namespace RadioCabs_BE.Repositories.Implementations
{
    public class CompanyRepository : GenericRepository<Company>, ICompanyRepository
    {
        public CompanyRepository(RadiocabsDbContext db) : base(db) { }

        public Task<bool> ExistsByTaxCodeAsync(string taxCode, CancellationToken ct = default)
            => _set.AnyAsync(x => x.TaxCode == taxCode, ct);
    }
}
