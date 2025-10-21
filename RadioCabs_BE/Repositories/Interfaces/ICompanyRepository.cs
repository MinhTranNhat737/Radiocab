using RadioCabs_BE.Models;

namespace RadioCabs_BE.Repositories.Interfaces
{
    public interface ICompanyRepository : IGenericRepository<Company>
    {
        Task<bool> ExistsByTaxCodeAsync(string taxCode, CancellationToken ct = default);
    }
}
