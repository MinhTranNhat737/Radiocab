using Microsoft.EntityFrameworkCore;
using RadioCabs_BE.Models;
using RadioCabs_BE.Repositories.Interfaces;
using Radiocabs_BE.Data;

namespace RadioCabs_BE.Repositories.Implementations
{
    public class AccountRepository : GenericRepository<Account>, IAccountRepository
    {
        public AccountRepository(RadiocabsDbContext db) : base(db) { }

        public Task<Account?> FindByUsernameAsync(string username, CancellationToken ct = default)
            => _set.AsNoTracking().FirstOrDefaultAsync(x => x.Username == username, ct);
    }
}
