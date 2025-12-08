using Microsoft.AspNetCore.Mvc;
using vehicle_service.Data;

namespace vehicle_service.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class HealthController : ControllerBase
    {
        private readonly vehicle_serviceDBContext _context;

        public HealthController(vehicle_serviceDBContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult> Get()
        {
            try
            {
                // Test database connection
                await _context.Database.CanConnectAsync();
                
                return Ok(new
                {
                    Status = "Healthy",
                    Timestamp = DateTimeOffset.UtcNow,
                    Database = "Connected"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    Status = "Unhealthy",
                    Timestamp = DateTimeOffset.UtcNow,
                    Error = ex.Message
                });
            }
        }
    }
}
