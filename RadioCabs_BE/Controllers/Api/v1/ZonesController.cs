using Microsoft.AspNetCore.Mvc;
using RadioCabs_BE.DTOs;
using RadioCabs_BE.Models;
using RadioCabs_BE.Services.Interfaces;

namespace RadioCabs_BE.Controllers.Api.v1
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class ZonesController : ControllerBase
    {
        private readonly IZoneService _service;

        public ZonesController(IZoneService service) => _service = service;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Zone>>> List([FromQuery] long? companyId, [FromQuery] long? provinceId, CancellationToken ct)
        {
            if (companyId.HasValue)
            {
                var zones = await _service.ListByCompanyAsync(companyId.Value, ct);
                return Ok(zones);
            }
            
            if (provinceId.HasValue)
            {
                var zones = await _service.ListByProvinceAsync(provinceId.Value, ct);
                return Ok(zones);
            }

            var allZones = await _service.ListActiveAsync(ct);
            return Ok(allZones);
        }

        [HttpGet("{id:long}")]
        public async Task<ActionResult<Zone>> GetById(long id, CancellationToken ct)
        {
            var zone = await _service.GetAsync(id, ct);
            if (zone == null) return NotFound();
            return Ok(zone);
        }

        [HttpGet("active")]
        public async Task<ActionResult<IEnumerable<Zone>>> ListActive(CancellationToken ct)
        {
            var zones = await _service.ListActiveAsync(ct);
            return Ok(zones);
        }

        [HttpPost]
        public async Task<ActionResult<Zone>> Create([FromBody] CreateZoneDto dto, CancellationToken ct)
        {
            var zone = await _service.CreateAsync(dto, ct);
            return CreatedAtAction(nameof(GetById), new { id = zone.ZoneId }, zone);
        }

        [HttpPut("{id:long}")]
        public async Task<IActionResult> Update(long id, [FromBody] UpdateZoneDto dto, CancellationToken ct)
        {
            var success = await _service.UpdateAsync(id, dto, ct);
            if (!success) return NotFound();
            return NoContent();
        }

        [HttpPost("assign-ward")]
        public async Task<IActionResult> AssignWard([FromBody] AssignWardToZoneDto dto, CancellationToken ct)
        {
            var success = await _service.AssignWardAsync(dto, ct);
            if (!success) return BadRequest("Failed to assign ward to zone");
            return NoContent();
        }

        [HttpDelete("{zoneId:long}/wards/{wardId:long}")]
        public async Task<IActionResult> RemoveWard(long zoneId, long wardId, CancellationToken ct)
        {
            var success = await _service.RemoveWardAsync(zoneId, wardId, ct);
            if (!success) return NotFound();
            return NoContent();
        }
    }
}
