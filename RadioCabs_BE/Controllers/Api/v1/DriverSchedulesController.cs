using Microsoft.AspNetCore.Mvc;
using RadioCabs_BE.Models;
using RadioCabs_BE.Services.Interfaces;

namespace RadioCabs_BE.Controllers.Api.v1
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class DriverSchedulesController : ControllerBase
    {
        private readonly IDriverScheduleService _svc;
        public DriverSchedulesController(IDriverScheduleService svc) => _svc = svc;

        // Seed từ template cho một tháng
        [HttpPost("seed-month")]
        public async Task<ActionResult<object>> SeedMonth(
            [FromQuery] int year, [FromQuery] int month, CancellationToken ct)
        {
            var inserted = await _svc.SeedMonthFromTemplateAsync(year, month, ct);
            return Ok(new { inserted });
        }

        // Lấy lịch của tài xế theo khoảng ngày (?from=yyyy-MM-dd&to=yyyy-MM-dd)
        // Nếu không truyền 'to' -> mặc định = 'from'; nếu không truyền cả 2 -> mặc định hôm nay.
        [HttpGet("driver/{driverAccountId:long}")]
        public async Task<ActionResult<IEnumerable<DriverSchedule>>> GetByDriver(
            long driverAccountId,
            [FromQuery] DateOnly? from = null,
            [FromQuery] DateOnly? to = null,
            CancellationToken ct = default)
        {
            var fromVal = from ?? DateOnly.FromDateTime(DateTime.UtcNow.Date);
            var toVal   = to   ?? fromVal;

            if (toVal < fromVal)
                return BadRequest("Tham số 'to' phải >= 'from'.");

            var list = await _svc.ListByDriverAsync(driverAccountId, fromVal, toVal, ct);
            return Ok(list);
        }
    }
}
