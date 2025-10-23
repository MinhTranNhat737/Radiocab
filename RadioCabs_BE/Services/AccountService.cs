using Microsoft.EntityFrameworkCore;
using RadioCabs_BE.DTOs;
using RadioCabs_BE.Models;
using RadioCabs_BE.Repositories;
using RadioCabs_BE.Services.Interfaces;
using System.Security.Cryptography;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace RadioCabs_BE.Services
{
    public class AccountService : IAccountService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IConfiguration _configuration;

        public AccountService(IUnitOfWork unitOfWork, IConfiguration configuration)
        {
            _unitOfWork = unitOfWork;
            _configuration = configuration;
        }

        public async Task<AccountDto?> GetByIdAsync(long id)
        {
            var account = await _unitOfWork.Repository<Account>().GetByIdAsync(id);
            return account != null ? MapToAccountDto(account) : null;
        }

        public async Task<AccountDto?> GetByUsernameAsync(string username)
        {
            var account = await _unitOfWork.Repository<Account>().SingleOrDefaultAsync(a => a.Username == username);
            return account != null ? MapToAccountDto(account) : null;
        }

        public async Task<PagedResult<AccountDto>> GetPagedAsync(PageRequest request)
        {
            var repository = _unitOfWork.Repository<Account>();
            var query = repository.FindAsync(a => true).Result.AsQueryable();

            if (!string.IsNullOrEmpty(request.Search))
            {
                query = query.Where(a => a.FullName.Contains(request.Search) || a.Username.Contains(request.Search) || a.Email!.Contains(request.Search));
            }

            var totalCount = await repository.CountAsync();
            var items = query
                .Skip((request.Page - 1) * request.PageSize)
                .Take(request.PageSize)
                .Select(a => MapToAccountDto(a))
                .ToList();

            return new PagedResult<AccountDto>
            {
                Items = items,
                TotalCount = totalCount,
                Page = request.Page,
                PageSize = request.PageSize
            };
        }

        public async Task<AccountDto> CreateAsync(CreateAccountDto dto)
        {
            var account = new Account
            {
                CompanyId = dto.CompanyId,
                Username = dto.Username,
                PasswordHash = HashPassword(dto.Password),
                FullName = dto.FullName,
                Phone = dto.Phone,
                Email = dto.Email,
                Role = dto.Role,
                Status = ActiveFlag.ACTIVE,
                CreatedAt = DateTimeOffset.UtcNow
            };

            await _unitOfWork.Repository<Account>().AddAsync(account);
            await _unitOfWork.SaveChangesAsync();

            return MapToAccountDto(account);
        }

        public async Task<AccountDto?> UpdateAsync(long id, UpdateAccountDto dto)
        {
            var account = await _unitOfWork.Repository<Account>().GetByIdAsync(id);
            if (account == null) return null;

            if (dto.FullName != null) account.FullName = dto.FullName;
            if (dto.Phone != null) account.Phone = dto.Phone;
            if (dto.Email != null) account.Email = dto.Email;
            if (dto.Role.HasValue) account.Role = dto.Role.Value;
            if (dto.Status.HasValue) account.Status = dto.Status.Value;
            account.UpdatedAt = DateTimeOffset.UtcNow;

            _unitOfWork.Repository<Account>().Update(account);
            await _unitOfWork.SaveChangesAsync();

            return MapToAccountDto(account);
        }

        public async Task<bool> DeleteAsync(long id)
        {
            var account = await _unitOfWork.Repository<Account>().GetByIdAsync(id);
            if (account == null) return false;

            _unitOfWork.Repository<Account>().Remove(account);
            await _unitOfWork.SaveChangesAsync();

            return true;
        }

        public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
        {
            var account = await _unitOfWork.Repository<Account>().SingleOrDefaultAsync(a => a.Username == dto.Username);
            if (account == null || !VerifyPassword(dto.Password, account.PasswordHash))
            {
                throw new UnauthorizedAccessException("Invalid username or password");
            }

            if (account.Status != ActiveFlag.ACTIVE)
            {
                throw new UnauthorizedAccessException("Account is not active");
            }

            // Generate JWT token (simplified - in real implementation, use proper JWT library)
            var accessToken = GenerateJwtToken(account);
            var refreshToken = Guid.NewGuid().ToString();

            // Save refresh session
            var session = new AuthRefreshSession
            {
                SessionId = Guid.NewGuid(),
                AccountId = account.AccountId,
                TokenHash = HashPassword(refreshToken),
                Jti = Guid.NewGuid(),
                CreatedAt = DateTimeOffset.UtcNow,
                ExpiresAt = DateTimeOffset.UtcNow.AddDays(7)
            };

            await _unitOfWork.Repository<AuthRefreshSession>().AddAsync(session);
            await _unitOfWork.SaveChangesAsync();

            return new AuthResponseDto
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken,
                ExpiresAt = DateTimeOffset.UtcNow.AddHours(1),
                Account = MapToAccountDto(account)
            };
        }

        public async Task<bool> ChangePasswordAsync(long accountId, string currentPassword, string newPassword)
        {
            var account = await _unitOfWork.Repository<Account>().GetByIdAsync(accountId);
            if (account == null || !VerifyPassword(currentPassword, account.PasswordHash))
            {
                return false;
            }

            account.PasswordHash = HashPassword(newPassword);
            account.UpdatedAt = DateTimeOffset.UtcNow;

            _unitOfWork.Repository<Account>().Update(account);
            await _unitOfWork.SaveChangesAsync();

            return true;
        }

        public async Task<bool> VerifyEmailAsync(string email, string code)
        {
            var emailCode = await _unitOfWork.Repository<AuthEmailCode>()
                .SingleOrDefaultAsync(ec => ec.Email == email && ec.Purpose == "SIGNUP" && ec.ConsumedAt == null);

            if (emailCode == null || !VerifyPassword(code, emailCode.CodeHash) || emailCode.ExpiresAt < DateTimeOffset.UtcNow)
            {
                return false;
            }

            emailCode.ConsumedAt = DateTimeOffset.UtcNow;

            var account = await _unitOfWork.Repository<Account>().SingleOrDefaultAsync(a => a.Email == email);
            if (account != null)
            {
                account.EmailVerifiedAt = DateTimeOffset.UtcNow;
                _unitOfWork.Repository<Account>().Update(account);
            }

            _unitOfWork.Repository<AuthEmailCode>().Update(emailCode);
            await _unitOfWork.SaveChangesAsync();

            return true;
        }

        public async Task<bool> SendEmailVerificationAsync(string email)
        {
            var code = GenerateRandomCode();
            var codeHash = HashPassword(code);

            var emailCode = new AuthEmailCode
            {
                Email = email,
                Purpose = "SIGNUP",
                CodeHash = codeHash,
                SentAt = DateTimeOffset.UtcNow,
                ExpiresAt = DateTimeOffset.UtcNow.AddMinutes(15),
                AttemptCount = 0,
                MaxAttempts = 5
            };

            await _unitOfWork.Repository<AuthEmailCode>().AddAsync(emailCode);
            await _unitOfWork.SaveChangesAsync();

            // In real implementation, send email here
            return true;
        }

        private AccountDto MapToAccountDto(Account account)
        {
            return new AccountDto
            {
                AccountId = account.AccountId,
                CompanyId = account.CompanyId,
                Username = account.Username,
                FullName = account.FullName,
                Phone = account.Phone,
                Email = account.Email,
                Role = account.Role,
                Status = account.Status,
                CreatedAt = account.CreatedAt,
                UpdatedAt = account.UpdatedAt,
                EmailVerifiedAt = account.EmailVerifiedAt,
                Company = account.Company != null ? new CompanyDto
                {
                    CompanyId = account.Company.CompanyId,
                    Name = account.Company.Name,
                    Hotline = account.Company.Hotline,
                    Email = account.Company.Email,
                    Address = account.Company.Address,
                    TaxCode = account.Company.TaxCode,
                    Status = account.Company.Status
                } : null
            };
        }

        private string HashPassword(string password)
        {
            // Prefer BCrypt for stronger security
            return BCrypt.Net.BCrypt.HashPassword(password);
        }

        private bool VerifyPassword(string password, string hash)
        {
            // Support BCrypt hashes from seeded data (prefix $2a$/$2b$/$2y$)
            if (!string.IsNullOrEmpty(hash) && (hash.StartsWith("$2a$") || hash.StartsWith("$2b$") || hash.StartsWith("$2y$")))
            {
                return BCrypt.Net.BCrypt.Verify(password, hash);
            }

            // Legacy fallback: SHA-256 Base64
            using var sha256 = SHA256.Create();
            var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            var shaHash = Convert.ToBase64String(hashedBytes);
            return shaHash == hash;
        }

        private string GenerateJwtToken(Account account)
        {
            var jwtSecretKey = _configuration["Jwt:SecretKey"] ?? "your-secret-key-here-must-be-at-least-32-characters-long";
            var jwtIssuer = _configuration["Jwt:Issuer"] ?? "RadioCabs";
            var jwtAudience = _configuration["Jwt:Audience"] ?? "RadioCabs";

            var key = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(jwtSecretKey));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, account.AccountId.ToString()),
                new Claim(ClaimTypes.Name, account.Username),
                new Claim(ClaimTypes.Role, account.Role.ToString()),
                new Claim("company_id", account.CompanyId?.ToString() ?? ""),
                new Claim("full_name", account.FullName),
                new Claim("email", account.Email ?? ""),
                new Claim("phone", account.Phone ?? "")
            };

            var token = new JwtSecurityToken(
                issuer: jwtIssuer,
                audience: jwtAudience,
                claims: claims,
                expires: DateTime.UtcNow.AddHours(1),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private string GenerateRandomCode()
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            var random = new Random();
            return new string(Enumerable.Repeat(chars, 6).Select(s => s[random.Next(s.Length)]).ToArray());
        }
    }
}