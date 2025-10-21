using Microsoft.AspNetCore.Mvc;
using RadioCabs_BE.Models;
using RadioCabs_BE.Services.Interfaces; // IVehicleService

namespace RadioCabs_BE.Controllers.Api.v1
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class VehiclesController : ControllerBase
    {
        private readonly IVehicleService _svc;
        public VehiclesController(IVehicleService svc) => _svc = svc;

        [HttpGet("{id:long}")]
        public async Task<ActionResult<Vehicle>> Get(long id, CancellationToken ct)
        {
            var v = await _svc.GetAsync(id, ct);
            if (v == null) return NotFound();
            return Ok(v);
        }

        [HttpGet("by-company/{companyId:long}")]
        public async Task<ActionResult<IEnumerable<Vehicle>>> ListByCompany(long companyId, CancellationToken ct)
        {
            var list = await _svc.ListByCompanyAsync(companyId, ct);
            return Ok(list);
        }

        [HttpPost]
        public async Task<ActionResult<long>> Create([FromBody] Vehicle v, CancellationToken ct)
        {
            var id = await _svc.CreateAsync(v, ct);
            return CreatedAtAction(nameof(Get), new { id }, new { id });
        }

        [HttpPut("{id:long}")]
        public async Task<IActionResult> Update(long id, [FromBody] Vehicle v, CancellationToken ct)
        {
            if (id != v.VehicleId) return BadRequest("Id không khớp");
            await _svc.UpdateAsync(v, ct);
            return NoContent();
        }

        [HttpDelete("{id:long}")]
        public async Task<IActionResult> Deactivate(long id, CancellationToken ct)
        {
            var ok = await _svc.DeactivateAsync(id, ct);
            if (!ok) return NotFound();
            return NoContent();
        }
    }
}
