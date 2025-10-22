using Microsoft.EntityFrameworkCore;
using RadioCabs_BE.Data;
using RadioCabs_BE.Models;
using RadioCabs_BE.Repositories.Interfaces;

namespace RadioCabs_BE.Repositories.Implementations
{
    public class AccountRepository : GenericRepository<Account>, IAccountRepository
    {
        public AccountRepository(RadiocabsDbContext context) : base(context) { }

        public async Task<Account?> GetByUsernameAsync(string username, CancellationToken ct = default)
            => await _context.Accounts
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.Username == username, ct);

        public async Task<Account?> GetByEmailAsync(string email, CancellationToken ct = default)
            => await _context.Accounts
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.Email == email, ct);

        public async Task<IReadOnlyList<Account>> ListByCompanyAsync(long companyId, CancellationToken ct = default)
            => await _context.Accounts
                .AsNoTracking()
                .Where(x => x.CompanyId == companyId)
                .OrderBy(x => x.FullName)
                .ToListAsync(ct);

        public async Task<IReadOnlyList<Account>> ListByRoleAsync(RoleType role, CancellationToken ct = default)
            => await _context.Accounts
                .AsNoTracking()
                .Where(x => x.Role == role)
                .OrderBy(x => x.FullName)
                .ToListAsync(ct);

        public async Task<bool> IsUsernameExistsAsync(string username, CancellationToken ct = default)
            => await _context.Accounts
                .AnyAsync(x => x.Username == username, ct);

        public async Task<bool> IsEmailExistsAsync(string email, CancellationToken ct = default)
            => await _context.Accounts
                .AnyAsync(x => x.Email == email, ct);
    }
}