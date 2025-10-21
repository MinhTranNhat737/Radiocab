using Microsoft.AspNetCore.Mvc;
using RadioCabs_BE.Models;
using RadioCabs_BE.Services.Interfaces;
using RadioCabs_BE.DTOs;
namespace RadioCabs_BE.Controllers.Api.v1
{
    [ApiController]
    [Route("api/v1/driving-orders")]
    public class DrivingOrdersController : ControllerBase
    {
        private readonly IDrivingOrderService _svc;
        public DrivingOrdersController(IDrivingOrderService svc) => _svc = svc;

        // GET: api/v1/driving-orders/{id}
        [HttpGet("{id:long}")]
        public async Task<ActionResult<DrivingOrder>> GetById(long id, CancellationToken ct)
        {
            var entity = await _svc.GetAsync(id, ct);
            if (entity == null) return NotFound();
            return Ok(entity);
        }

        // GET: api/v1/driving-orders?companyId=1&status=ONGOING&from=2025-10-01T00:00:00Z&to=2025-10-31T23:59:59Z
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DrivingOrder>>> ListByCompany(
            [FromQuery] long companyId,
            [FromQuery] OrderStatus? status,
            [FromQuery] DateTimeOffset? from,
            [FromQuery] DateTimeOffset? to,
            CancellationToken ct)
        {
            if (companyId <= 0) return BadRequest("companyId is required");
            if (from.HasValue && to.HasValue && to < from) return BadRequest("'to' must be >= 'from'.");

            var list = await _svc.ListByCompanyAsync(companyId, status, from, to, ct);
            return Ok(list);
        }

        // POST: api/v1/driving-orders/quote
        // Body: QuoteRequest { CompanyId, ProvinceId, ModelId, TotalKm, IntercityKm, TrafficKm, IsRaining, PickupTime? }
        [HttpPost("quote")]
        public async Task<ActionResult<QuoteResult>> Quote([FromBody] QuoteRequest req, CancellationToken ct)
        {
            if (req == null) return BadRequest("Invalid request");
            var result = await _svc.QuoteAsync(req, ct);
            return Ok(result);
        }

        // POST: api/v1/driving-orders
        // Body: DrivingOrder (hoặc DTO map về DrivingOrder trước khi gọi service)
        [HttpPost]
        public async Task<ActionResult<long>> Create([FromBody] DrivingOrder order, CancellationToken ct)
        {
            if (order == null) return BadRequest("Invalid order");
            var id = await _svc.CreateAsync(order, ct);
            return CreatedAtAction(nameof(GetById), new { id }, id);
        }

        // PATCH: api/v1/driving-orders/{id}/status
        // Body: { "status": "ASSIGNED" }
        public class UpdateStatusRequest { public OrderStatus Status { get; set; } }

        [HttpPatch("{id:long}/status")]
        public async Task<IActionResult> UpdateStatus(long id, [FromBody] UpdateStatusRequest req, CancellationToken ct)
        {
            await _svc.UpdateStatusAsync(id, req.Status, ct);
            return NoContent();
        }
    }
}
