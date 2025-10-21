using RadioCabs_BE.Models;

namespace RadioCabs_BE.Services.Interfaces
{
    public interface ICompanyService
    {
        Task<Company?> GetAsync(long companyId, CancellationToken ct = default);
        Task<Company>  CreateAsync(Company company, CancellationToken ct = default);
        Task<bool>     UpdateAsync(Company company, CancellationToken ct = default);
        Task<IReadOnlyList<Company>> ListActiveAsync(CancellationToken ct = default);
         Task<IReadOnlyList<Company>> ListAsync(ActiveFlag? status = null, CancellationToken ct = default);
          Task SetStatusAsync(long id, ActiveFlag status, CancellationToken ct = default);
    }
}
