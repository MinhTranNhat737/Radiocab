using Microsoft.AspNetCore.Mvc;
using RadioCabs_BE.DTOs;
using RadioCabs_BE.Services.Interfaces;

namespace RadioCabs_BE.Controllers.Api.v1
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class MembershipsController : ControllerBase
    {
        private readonly IMembershipService _membershipService;

        public MembershipsController(IMembershipService membershipService)
        {
            _membershipService = membershipService;
        }

        [HttpGet]
        public async Task<ActionResult<PagedResult<MembershipDto>>> GetPaged([FromQuery] int page = 1, [FromQuery] int pageSize = 20, [FromQuery] long? companyId = null, [FromQuery] bool? isActive = null, [FromQuery] string? search = null)
        {
            var result = await _membershipService.GetPagedAsync(page, pageSize, companyId, isActive, search);
            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<MembershipDto>> Create([FromBody] CreateMembershipDto dto)
        {
            try
            {
                var created = await _membershipService.CreateAsync(dto);
                return CreatedAtAction(nameof(GetPaged), new { id = created.MembershipId }, created);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<MembershipDto>> Update(long id, [FromBody] UpdateMembershipDto dto)
        {
            try
            {
                var updated = await _membershipService.UpdateAsync(id, dto);
                if (updated == null) return NotFound();
                return Ok(updated);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(long id)
        {
            try
            {
                var ok = await _membershipService.DeleteAsync(id);
                if (!ok) return NotFound();
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("{id}/activate")]
        public async Task<ActionResult<MembershipDto>> Activate(long id)
        {
            try
            {
                var updated = await _membershipService.SetActiveAsync(id, true);
                if (updated == null) return NotFound();
                return Ok(updated);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("{id}/deactivate")]
        public async Task<ActionResult<MembershipDto>> Deactivate(long id)
        {
            try
            {
                var updated = await _membershipService.SetActiveAsync(id, false);
                if (updated == null) return NotFound();
                return Ok(updated);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}


