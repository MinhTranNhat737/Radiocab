using Microsoft.AspNetCore.Mvc;
using RadioCabs_BE.Models;
using RadioCabs_BE.Services.Interfaces; // ICompanyService
using System.ComponentModel.DataAnnotations;

namespace RadioCabs_BE.Controllers.Api.v1
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class CompaniesController : ControllerBase
    {
        private readonly ICompanyService _svc;
        public CompaniesController(ICompanyService svc) => _svc = svc;

        [HttpGet("{id:long}")]
        public async Task<ActionResult<Company>> GetById(long id, CancellationToken ct)
        {
            var c = await _svc.GetAsync(id, ct);
            if (c == null) return NotFound();
            return Ok(c);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Company>>> List(
            [FromQuery] ActiveFlag? status, CancellationToken ct)
        {
            var list = await _svc.ListAsync(status, ct);
            return Ok(list);
        }

        [HttpPost]
        public async Task<ActionResult<Company>> Create([FromBody] Company model, CancellationToken ct)
        {
            // TODO: validate model theo yêu cầu nghiệp vụ
            var created = await _svc.CreateAsync(model, ct);
            return CreatedAtAction(
                nameof(GetById),
                new { id = created.CompanyId },
                created
            );
        }

        [HttpPut("{id:long}")]
        public async Task<IActionResult> Update(long id, [FromBody] Company model, CancellationToken ct)
        {
            if (id != model.CompanyId) return BadRequest("Id không khớp");
            await _svc.UpdateAsync(model, ct);
            return NoContent();
        }

        [HttpDelete("{id:long}")]
        public async Task<IActionResult> Deactivate(long id, CancellationToken ct)
        {
            await _svc.SetStatusAsync(id, ActiveFlag.INACTIVE, ct);
            return NoContent();
        }
    }
}
