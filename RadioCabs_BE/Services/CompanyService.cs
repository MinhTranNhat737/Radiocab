using RadioCabs_BE.Models;
using RadioCabs_BE.Repositories.Interfaces;
using RadioCabs_BE.Repositories;
using RadioCabs_BE.Services.Interfaces;
namespace RadioCabs_BE.Services
{
    public class CompanyService : ICompanyService
    {
        private readonly ICompanyRepository _repo;
        private readonly IUnitOfWork _uow;
        public CompanyService(ICompanyRepository repo, IUnitOfWork uow)
        {
            _repo = repo; _uow = uow;
        }

        public Task<Company?> GetAsync(long companyId, CancellationToken ct = default)
            => _repo.GetByIdAsync(companyId, ct);

        public async Task<Company> CreateAsync(Company company, CancellationToken ct = default)
        {
            company.CreatedAt = DateTimeOffset.Now;
            await _repo.AddAsync(company, ct);
            await _uow.SaveChangesAsync(ct);
            return company;
        }

        public async Task<bool> UpdateAsync(Company company, CancellationToken ct = default)
        {
            company.UpdatedAt = DateTimeOffset.Now;
            _repo.Update(company);
            return await _uow.SaveChangesAsync(ct) > 0;
        }

        public async Task<IReadOnlyList<Company>> ListActiveAsync(CancellationToken ct = default)
        {
            var list = await _repo.ListAsync(ct);
            return list.Where(c => c.Status == ActiveFlag.ACTIVE).ToList();
        }
    }
}
