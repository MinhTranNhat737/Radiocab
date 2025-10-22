using Microsoft.AspNetCore.Mvc;
using RadioCabs_BE.DTOs;
using RadioCabs_BE.Models;
using RadioCabs_BE.Services.Interfaces;

namespace RadioCabs_BE.Controllers.Api.v1
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class AccountsController : ControllerBase
    {
        private readonly IAccountService _service;

        public AccountsController(IAccountService service) => _service = service;

        [HttpGet("{id:long}")]
        public async Task<ActionResult<Account>> GetById(long id, CancellationToken ct)
        {
            var account = await _service.GetAsync(id, ct);
            if (account == null) return NotFound();
            return Ok(account);
        }

        [HttpGet("by-company/{companyId:long}")]
        public async Task<ActionResult<IEnumerable<Account>>> ListByCompany(long companyId, CancellationToken ct)
        {
            var accounts = await _service.ListByCompanyAsync(companyId, ct);
            return Ok(accounts);
        }

        [HttpGet("by-role/{role}")]
        public async Task<ActionResult<IEnumerable<Account>>> ListByRole(RoleType role, CancellationToken ct)
        {
            var accounts = await _service.ListByRoleAsync(role, ct);
            return Ok(accounts);
        }

        [HttpPost]
        public async Task<ActionResult<Account>> Create([FromBody] CreateAccountDto dto, CancellationToken ct)
        {
            if (await _service.IsUsernameExistsAsync(dto.Username, ct))
                return BadRequest("Username already exists");

            if (!string.IsNullOrEmpty(dto.Email) && await _service.IsEmailExistsAsync(dto.Email, ct))
                return BadRequest("Email already exists");

            var account = await _service.CreateAsync(dto, ct);
            return CreatedAtAction(nameof(GetById), new { id = account.AccountId }, account);
        }

        [HttpPut("{id:long}")]
        public async Task<IActionResult> Update(long id, [FromBody] UpdateAccountDto dto, CancellationToken ct)
        {
            var success = await _service.UpdateAsync(id, dto, ct);
            if (!success) return NotFound();
            return NoContent();
        }

        [HttpPatch("{id:long}/password")]
        public async Task<IActionResult> ChangePassword(long id, [FromBody] ChangePasswordDto dto, CancellationToken ct)
        {
            var success = await _service.ChangePasswordAsync(id, dto, ct);
            if (!success) return NotFound();
            return NoContent();
        }

        [HttpPatch("{id:long}/status")]
        public async Task<IActionResult> SetStatus(long id, [FromBody] ActiveFlag status, CancellationToken ct)
        {
            var success = await _service.SetStatusAsync(id, status, ct);
            if (!success) return NotFound();
            return NoContent();
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponseDto>> Login([FromBody] LoginDto dto, CancellationToken ct)
        {
            var response = await _service.LoginAsync(dto, ct);
            if (response == null) return Unauthorized("Invalid credentials");
            return Ok(response);
        }

        [HttpGet("check-username/{username}")]
        public async Task<ActionResult<bool>> CheckUsername(string username, CancellationToken ct)
        {
            var exists = await _service.IsUsernameExistsAsync(username, ct);
            return Ok(new { exists });
        }

        [HttpGet("check-email/{email}")]
        public async Task<ActionResult<bool>> CheckEmail(string email, CancellationToken ct)
        {
            var exists = await _service.IsEmailExistsAsync(email, ct);
            return Ok(new { exists });
        }
    }
}
