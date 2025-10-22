using Microsoft.AspNetCore.Mvc;
using RadioCabs_BE.DTOs;
using RadioCabs_BE.Services.Interfaces;

namespace RadioCabs_BE.Controllers.Api.v1
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class AccountsController : ControllerBase
    {
        private readonly IAccountService _accountService;

        public AccountsController(IAccountService accountService)
        {
            _accountService = accountService;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<AccountDto>> GetById(long id)
        {
            var account = await _accountService.GetByIdAsync(id);
            if (account == null)
                return NotFound();

            return Ok(account);
        }

        [HttpGet("username/{username}")]
        public async Task<ActionResult<AccountDto>> GetByUsername(string username)
        {
            var account = await _accountService.GetByUsernameAsync(username);
            if (account == null)
                return NotFound();

            return Ok(account);
        }

        [HttpGet]
        public async Task<ActionResult<PagedResult<AccountDto>>> GetPaged([FromQuery] PageRequest request)
        {
            var result = await _accountService.GetPagedAsync(request);
            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<AccountDto>> Create([FromBody] CreateAccountDto dto)
        {
            try
            {
                var account = await _accountService.CreateAsync(dto);
                return CreatedAtAction(nameof(GetById), new { id = account.AccountId }, account);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<AccountDto>> Update(long id, [FromBody] UpdateAccountDto dto)
        {
            try
            {
                var account = await _accountService.UpdateAsync(id, dto);
                if (account == null)
                    return NotFound();

                return Ok(account);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(long id)
        {
            var success = await _accountService.DeleteAsync(id);
            if (!success)
                return NotFound();

            return NoContent();
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponseDto>> Login([FromBody] LoginDto dto)
        {
            try
            {
                var result = await _accountService.LoginAsync(dto);
                return Ok(result);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ex.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("change-password")]
        public async Task<ActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
        {
            try
            {
                var success = await _accountService.ChangePasswordAsync(dto.AccountId, dto.CurrentPassword, dto.NewPassword);
                if (!success)
                    return BadRequest("Invalid current password or account not found");

                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("verify-email")]
        public async Task<ActionResult> VerifyEmail([FromBody] VerifyEmailDto dto)
        {
            try
            {
                var success = await _accountService.VerifyEmailAsync(dto.Email, dto.Code);
                if (!success)
                    return BadRequest("Invalid verification code");

                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("send-email-verification")]
        public async Task<ActionResult> SendEmailVerification([FromBody] SendEmailVerificationDto dto)
        {
            try
            {
                var success = await _accountService.SendEmailVerificationAsync(dto.Email);
                if (!success)
                    return BadRequest("Failed to send verification email");

                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }

    public class ChangePasswordDto
    {
        public long AccountId { get; set; }
        public string CurrentPassword { get; set; } = null!;
        public string NewPassword { get; set; } = null!;
    }

    public class VerifyEmailDto
    {
        public string Email { get; set; } = null!;
        public string Code { get; set; } = null!;
    }

    public class SendEmailVerificationDto
    {
        public string Email { get; set; } = null!;
    }
}
