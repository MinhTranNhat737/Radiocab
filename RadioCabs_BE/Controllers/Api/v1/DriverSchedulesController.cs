using Microsoft.AspNetCore.Mvc;
using RadioCabs_BE.DTOs;
using RadioCabs_BE.Models;
using RadioCabs_BE.Services.Interfaces;

namespace RadioCabs_BE.Controllers.Api.v1
{
    [ApiController]
    [Route("api/v1/driver-schedules")]
    public class DriverSchedulesController : ControllerBase
    {
        private readonly IDriverScheduleService _service;

        public DriverSchedulesController(IDriverScheduleService service) => _service = service;

        // Template Management
        [HttpPost("templates")]
        public async Task<ActionResult<DriverScheduleTemplate>> CreateTemplate([FromBody] CreateDriverScheduleTemplateDto dto, CancellationToken ct)
        {
            var template = await _service.CreateTemplateAsync(dto, ct);
            return CreatedAtAction(nameof(GetTemplate), new { id = template.TemplateId }, template);
        }

        [HttpGet("templates/{id:long}")]
        public async Task<ActionResult<DriverScheduleTemplate>> GetTemplate(long id, CancellationToken ct)
        {
            var template = await _service.GetTemplateAsync(id, ct);
            if (template == null) return NotFound();
            return Ok(template);
        }

        [HttpPut("templates/{id:long}")]
        public async Task<IActionResult> UpdateTemplate(long id, [FromBody] UpdateDriverScheduleTemplateDto dto, CancellationToken ct)
        {
            var success = await _service.UpdateTemplateAsync(id, dto, ct);
            if (!success) return NotFound();
            return NoContent();
        }

        [HttpGet("templates/by-driver/{driverAccountId:long}")]
        public async Task<ActionResult<IEnumerable<DriverScheduleTemplate>>> ListTemplatesByDriver(long driverAccountId, CancellationToken ct)
        {
            var templates = await _service.ListTemplatesByDriverAsync(driverAccountId, ct);
            return Ok(templates);
        }

        // Schedule Management
        [HttpPost]
        public async Task<ActionResult<DriverSchedule>> Create([FromBody] CreateDriverScheduleDto dto, CancellationToken ct)
        {
            var schedule = await _service.CreateScheduleAsync(dto, ct);
            return CreatedAtAction(nameof(GetSchedule), new { id = schedule.ScheduleId }, schedule);
        }

        [HttpGet("{id:long}")]
        public async Task<ActionResult<DriverSchedule>> GetSchedule(long id, CancellationToken ct)
        {
            var schedule = await _service.GetScheduleAsync(id, ct);
            if (schedule == null) return NotFound();
            return Ok(schedule);
        }

        [HttpPut("{id:long}")]
        public async Task<IActionResult> UpdateSchedule(long id, [FromBody] UpdateDriverScheduleDto dto, CancellationToken ct)
        {
            var success = await _service.UpdateScheduleAsync(id, dto, ct);
            if (!success) return NotFound();
            return NoContent();
        }

        [HttpGet("by-driver/{driverAccountId:long}")]
        public async Task<ActionResult<IEnumerable<DriverSchedule>>> ListByDriver(
            long driverAccountId,
            [FromQuery] DateOnly? workDate,
            CancellationToken ct)
        {
            var schedules = await _service.ListByDriverAsync(driverAccountId, workDate, ct);
            return Ok(schedules);
        }

        [HttpGet("by-driver/{driverAccountId:long}/date-range")]
        public async Task<ActionResult<IEnumerable<DriverSchedule>>> ListByDriverDateRange(
            long driverAccountId,
            [FromQuery] DateOnly from,
            [FromQuery] DateOnly to,
            CancellationToken ct)
        {
            var schedules = await _service.ListByDriverAsync(driverAccountId, from, to, ct);
            return Ok(schedules);
        }

        [HttpGet("by-status/{status}")]
        public async Task<ActionResult<IEnumerable<DriverSchedule>>> ListByStatus(ShiftStatus status, CancellationToken ct)
        {
            var schedules = await _service.ListByStatusAsync(status, ct);
            return Ok(schedules);
        }

        [HttpPost("seed-month")]
        public async Task<ActionResult<int>> SeedMonth([FromBody] SeedDriverScheduleDto dto, CancellationToken ct)
        {
            var count = await _service.SeedMonthFromTemplateAsync(dto.Year, dto.Month, ct);
            return Ok(new { insertedCount = count });
        }
    }
}