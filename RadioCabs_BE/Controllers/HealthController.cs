using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RadioCabs_BE.Data;

namespace RadioCabs_BE.Controllers
{
    [ApiController]
    [Route("health")]
    public class HealthController : ControllerBase
    {
        private readonly RadiocabsDbContext _db;
        public HealthController(RadiocabsDbContext db) => _db = db;

        [HttpGet("ping")]
        public IActionResult Ping() => Ok(new { ok = true, now = DateTimeOffset.Now });

        [HttpGet("ping-db")]
        public async Task<IActionResult> PingDb(CancellationToken ct)
        {
            // SELECT 1 simple
            var ok = await _db.Database.ExecuteSqlRawAsync("SELECT 1", ct);
            return Ok(new { db = "ok", result = ok });
        }
    }
}
