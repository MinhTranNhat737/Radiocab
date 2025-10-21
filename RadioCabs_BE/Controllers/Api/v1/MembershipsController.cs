using Microsoft.AspNetCore.Mvc;
using RadioCabs_BE.Models;
using RadioCabs_BE.Services.Interfaces; // IMembershipService

namespace RadioCabs_BE.Controllers.Api.v1
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class MembershipsController : ControllerBase
    {
        private readonly IMembershipService _svc;
        public MembershipsController(IMembershipService svc) => _svc = svc;

        [HttpGet("company/{companyId:long}")]
        public async Task<ActionResult<IEnumerable<MembershipOrder>>> ListByCompany(long companyId, CancellationToken ct)
        {
            var list = await _svc.ListByCompanyAsync(companyId, ct);
            return Ok(list);
        }

        [HttpPost("orders")]
        public async Task<ActionResult<long>> CreateOrder([FromBody] MembershipOrder order, CancellationToken ct)
        {
            var id = await _svc.CreateAsync(order, ct);
            return CreatedAtAction(nameof(GetOrder), new { id }, new { id });
        }

        [HttpGet("orders/{id:long}")]
        public async Task<ActionResult<MembershipOrder>> GetOrder(long id, CancellationToken ct)
        {
            var o = await _svc.GetOrderAsync(id, ct);
            if (o == null) return NotFound();
            return Ok(o);
        }
    }
}
