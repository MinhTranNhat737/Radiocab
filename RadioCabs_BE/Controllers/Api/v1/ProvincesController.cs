using Microsoft.AspNetCore.Mvc;
using RadioCabs_BE.DTOs;
using RadioCabs_BE.Models;
using RadioCabs_BE.Services.Interfaces;

namespace RadioCabs_BE.Controllers.Api.v1
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class ProvincesController : ControllerBase
    {
        private readonly IProvinceService _service;

        public ProvincesController(IProvinceService service) => _service = service;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Province>>> List(CancellationToken ct)
        {
            var provinces = await _service.ListAsync(ct);
            return Ok(provinces);
        }

        [HttpGet("{id:long}")]
        public async Task<ActionResult<Province>> GetById(long id, CancellationToken ct)
        {
            var province = await _service.GetAsync(id, ct);
            if (province == null) return NotFound();
            return Ok(province);
        }

        [HttpGet("by-code/{code}")]
        public async Task<ActionResult<Province>> GetByCode(string code, CancellationToken ct)
        {
            var province = await _service.GetByCodeAsync(code, ct);
            if (province == null) return NotFound();
            return Ok(province);
        }

        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<Province>>> Search([FromQuery] string name, CancellationToken ct)
        {
            if (string.IsNullOrEmpty(name)) return BadRequest("Name parameter is required");
            
            var provinces = await _service.SearchByNameAsync(name, ct);
            return Ok(provinces);
        }

        [HttpPost]
        public async Task<ActionResult<Province>> Create([FromBody] CreateProvinceDto dto, CancellationToken ct)
        {
            var province = await _service.CreateAsync(dto, ct);
            return CreatedAtAction(nameof(GetById), new { id = province.ProvinceId }, province);
        }

        [HttpPut("{id:long}")]
        public async Task<IActionResult> Update(long id, [FromBody] UpdateProvinceDto dto, CancellationToken ct)
        {
            var success = await _service.UpdateAsync(id, dto, ct);
            if (!success) return NotFound();
            return NoContent();
        }
    }
}
