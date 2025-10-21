using RadioCabs_BE.Models;

namespace RadioCabs_BE.Repositories.Interfaces
{
    public interface IAccountRepository : IGenericRepository<Account>
    {
        Task<Account?> FindByUsernameAsync(string username, CancellationToken ct = default);
    }
}
