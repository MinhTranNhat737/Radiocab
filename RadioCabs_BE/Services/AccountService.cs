using Microsoft.EntityFrameworkCore;
using RadioCabs_BE.Data;
using RadioCabs_BE.DTOs;
using RadioCabs_BE.Models;
using RadioCabs_BE.Repositories.Interfaces;
using RadioCabs_BE.Services.Interfaces;
using System.Security.Cryptography;
using System.Text;

namespace RadioCabs_BE.Services
{
    public class AccountService : IAccountService
    {
        private readonly IAccountRepository _repo;
        private readonly RadiocabsDbContext _db;
        private readonly IUnitOfWork _uow;

        public AccountService(IAccountRepository repo, RadiocabsDbContext db, IUnitOfWork uow)
        {
            _repo = repo;
            _db = db;
            _uow = uow;
        }

        public async Task<Account?> GetAsync(long id, CancellationToken ct = default)
            => await _repo.GetByIdAsync(id, ct);

        public async Task<Account?> GetByUsernameAsync(string username, CancellationToken ct = default)
            => await _repo.GetByUsernameAsync(username, ct);

        public async Task<IReadOnlyList<Account>> ListByCompanyAsync(long companyId, CancellationToken ct = default)
            => await _repo.ListByCompanyAsync(companyId, ct);

        public async Task<IReadOnlyList<Account>> ListByRoleAsync(RoleType role, CancellationToken ct = default)
            => await _repo.ListByRoleAsync(role, ct);

        public async Task<Account> CreateAsync(CreateAccountDto dto, CancellationToken ct = default)
        {
            var account = new Account
            {
                Username = dto.Username,
                FullName = dto.FullName,
                Phone = dto.Phone,
                Email = dto.Email,
                Role = dto.Role,
                CompanyId = dto.CompanyId,
                Status = ActiveFlag.ACTIVE,
                CreatedAt = DateTimeOffset.Now
            };

            // TODO: Hash password properly in production
            account.PasswordHash = HashPassword("defaultPassword123"); // Temporary default password

            await _repo.AddAsync(account, ct);
            await _uow.SaveChangesAsync(ct);
            return account;
        }

        public async Task<bool> UpdateAsync(long id, UpdateAccountDto dto, CancellationToken ct = default)
        {
            var account = await _repo.GetByIdAsync(id, ct);
            if (account == null) return false;

            if (!string.IsNullOrEmpty(dto.FullName))
                account.FullName = dto.FullName;
            if (!string.IsNullOrEmpty(dto.Phone))
                account.Phone = dto.Phone;
            if (!string.IsNullOrEmpty(dto.Email))
                account.Email = dto.Email;
            if (dto.Status.HasValue)
                account.Status = dto.Status.Value;

            account.UpdatedAt = DateTimeOffset.Now;

            _repo.Update(account);
            return await _uow.SaveChangesAsync(ct) > 0;
        }

        public async Task<bool> ChangePasswordAsync(long id, ChangePasswordDto dto, CancellationToken ct = default)
        {
            var account = await _repo.GetByIdAsync(id, ct);
            if (account == null) return false;

            // TODO: Verify current password
            account.PasswordHash = HashPassword(dto.NewPassword);
            account.UpdatedAt = DateTimeOffset.Now;

            _repo.Update(account);
            return await _uow.SaveChangesAsync(ct) > 0;
        }

        public async Task<bool> SetStatusAsync(long id, ActiveFlag status, CancellationToken ct = default)
        {
            var account = await _repo.GetByIdAsync(id, ct);
            if (account == null) return false;

            account.Status = status;
            account.UpdatedAt = DateTimeOffset.Now;

            _repo.Update(account);
            return await _uow.SaveChangesAsync(ct) > 0;
        }

        public async Task<AuthResponseDto?> LoginAsync(LoginDto dto, CancellationToken ct = default)
        {
            var account = await _repo.GetByUsernameAsync(dto.Username, ct);
            if (account == null || !VerifyPassword(dto.Password, account.PasswordHash))
                return null;

            if (account.Status != ActiveFlag.ACTIVE)
                return null;

            // TODO: Generate JWT tokens properly
            return new AuthResponseDto
            {
                AccountId = account.AccountId,
                Username = account.Username,
                FullName = account.FullName,
                Role = account.Role,
                CompanyId = account.CompanyId,
                AccessToken = "temp_access_token", // TODO: Generate real JWT
                RefreshToken = "temp_refresh_token", // TODO: Generate real refresh token
                ExpiresAt = DateTimeOffset.Now.AddHours(1)
            };
        }

        public async Task<bool> IsUsernameExistsAsync(string username, CancellationToken ct = default)
            => await _repo.IsUsernameExistsAsync(username, ct);

        public async Task<bool> IsEmailExistsAsync(string email, CancellationToken ct = default)
            => await _repo.IsEmailExistsAsync(email, ct);

        private static string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(hashedBytes);
        }

        private static bool VerifyPassword(string password, string hash)
        {
            var hashedPassword = HashPassword(password);
            return hashedPassword == hash;
        }
    }
}
