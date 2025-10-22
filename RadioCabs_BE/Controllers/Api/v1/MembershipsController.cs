using Microsoft.AspNetCore.Mvc;
using RadioCabs_BE.DTOs;
using RadioCabs_BE.Models;
using RadioCabs_BE.Services.Interfaces;

namespace RadioCabs_BE.Controllers.Api.v1
{
    [ApiController]
    [Route("api/v1/memberships")]
    public class MembershipsController : ControllerBase
    {
        private readonly IMembershipService _service;

        public MembershipsController(IMembershipService service) => _service = service;

        [HttpGet("{id:long}")]
        public async Task<ActionResult<MembershipOrder>> GetById(long id, CancellationToken ct)
        {
            var order = await _service.GetAsync(id, ct);
            if (order == null) return NotFound();
            return Ok(order);
        }

        [HttpGet("by-company/{companyId:long}")]
        public async Task<ActionResult<IEnumerable<MembershipOrder>>> ListByCompany(long companyId, CancellationToken ct)
        {
            var orders = await _service.ListByCompanyAsync(companyId, ct);
            return Ok(orders);
        }

        [HttpGet("by-payer/{payerAccountId:long}")]
        public async Task<ActionResult<IEnumerable<MembershipOrder>>> ListByPayer(long payerAccountId, CancellationToken ct)
        {
            var orders = await _service.ListByPayerAsync(payerAccountId, ct);
            return Ok(orders);
        }

        [HttpGet("with-details")]
        public async Task<ActionResult<IEnumerable<MembershipOrderResponseDto>>> ListWithDetails(
            [FromQuery] long? companyId, CancellationToken ct)
        {
            var orders = await _service.ListWithDetailsAsync(companyId, ct);
            return Ok(orders);
        }

        [HttpGet("paid")]
        public async Task<ActionResult<IEnumerable<MembershipOrder>>> ListPaid(CancellationToken ct)
        {
            var orders = await _service.ListPaidAsync(ct);
            return Ok(orders);
        }

        [HttpGet("unpaid")]
        public async Task<ActionResult<IEnumerable<MembershipOrder>>> ListUnpaid(CancellationToken ct)
        {
            var orders = await _service.ListUnpaidAsync(ct);
            return Ok(orders);
        }

        [HttpPost]
        public async Task<ActionResult<MembershipOrder>> Create([FromBody] CreateMembershipOrderDto dto, CancellationToken ct)
        {
            var order = await _service.CreateAsync(dto, ct);
            return CreatedAtAction(nameof(GetById), new { id = order.MembershipOrderId }, order);
        }

        [HttpPut("{id:long}")]
        public async Task<IActionResult> Update(long id, [FromBody] UpdateMembershipOrderDto dto, CancellationToken ct)
        {
            var success = await _service.UpdateAsync(id, dto, ct);
            if (!success) return NotFound();
            return NoContent();
        }

        [HttpPatch("{id:long}/mark-paid")]
        public async Task<IActionResult> MarkPaid(long id, [FromBody] PaymentMethod paymentMethod, CancellationToken ct)
        {
            var success = await _service.MarkPaidAsync(id, paymentMethod, ct);
            if (!success) return NotFound();
            return NoContent();
        }
    }
}