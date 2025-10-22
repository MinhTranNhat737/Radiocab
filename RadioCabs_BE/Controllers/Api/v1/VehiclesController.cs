using Microsoft.AspNetCore.Mvc;
using RadioCabs_BE.DTOs;
using RadioCabs_BE.Services.Interfaces;

namespace RadioCabs_BE.Controllers.Api.v1
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class VehiclesController : ControllerBase
    {
        private readonly IVehicleService _vehicleService;

        public VehiclesController(IVehicleService vehicleService)
        {
            _vehicleService = vehicleService;
        }

        // Vehicle endpoints
        [HttpGet("{id}")]
        public async Task<ActionResult<VehicleDto>> GetVehicleById(long id)
        {
            var vehicle = await _vehicleService.GetVehicleByIdAsync(id);
            if (vehicle == null)
                return NotFound();

            return Ok(vehicle);
        }

        [HttpGet]
        public async Task<ActionResult<PagedResult<VehicleDto>>> GetVehicles([FromQuery] PageRequest request)
        {
            var result = await _vehicleService.GetVehiclesPagedAsync(request);
            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<VehicleDto>> CreateVehicle([FromBody] CreateVehicleDto dto)
        {
            try
            {
                var vehicle = await _vehicleService.CreateVehicleAsync(dto);
                return CreatedAtAction(nameof(GetVehicleById), new { id = vehicle.VehicleId }, vehicle);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<VehicleDto>> UpdateVehicle(long id, [FromBody] UpdateVehicleDto dto)
        {
            try
            {
                var vehicle = await _vehicleService.UpdateVehicleAsync(id, dto);
                if (vehicle == null)
                    return NotFound();

                return Ok(vehicle);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteVehicle(long id)
        {
            var success = await _vehicleService.DeleteVehicleAsync(id);
            if (!success)
                return NotFound();

            return NoContent();
        }

        // VehicleModel endpoints
        [HttpGet("models/{id}")]
        public async Task<ActionResult<VehicleModelDto>> GetModelById(long id)
        {
            var model = await _vehicleService.GetModelByIdAsync(id);
            if (model == null)
                return NotFound();

            return Ok(model);
        }

        [HttpGet("models")]
        public async Task<ActionResult<PagedResult<VehicleModelDto>>> GetModels([FromQuery] PageRequest request)
        {
            var result = await _vehicleService.GetModelsPagedAsync(request);
            return Ok(result);
        }

        [HttpPost("models")]
        public async Task<ActionResult<VehicleModelDto>> CreateModel([FromBody] CreateVehicleModelDto dto)
        {
            try
            {
                var model = await _vehicleService.CreateModelAsync(dto);
                return CreatedAtAction(nameof(GetModelById), new { id = model.ModelId }, model);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("models/{id}")]
        public async Task<ActionResult<VehicleModelDto>> UpdateModel(long id, [FromBody] UpdateVehicleModelDto dto)
        {
            try
            {
                var model = await _vehicleService.UpdateModelAsync(id, dto);
                if (model == null)
                    return NotFound();

                return Ok(model);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("models/{id}")]
        public async Task<ActionResult> DeleteModel(long id)
        {
            var success = await _vehicleService.DeleteModelAsync(id);
            if (!success)
                return NotFound();

            return NoContent();
        }

        // VehicleSegment endpoints
        [HttpGet("segments/{id}")]
        public async Task<ActionResult<VehicleSegmentDto>> GetSegmentById(long id)
        {
            var segment = await _vehicleService.GetSegmentByIdAsync(id);
            if (segment == null)
                return NotFound();

            return Ok(segment);
        }

        [HttpGet("segments")]
        public async Task<ActionResult<PagedResult<VehicleSegmentDto>>> GetSegments([FromQuery] PageRequest request)
        {
            var result = await _vehicleService.GetSegmentsPagedAsync(request);
            return Ok(result);
        }

        [HttpPost("segments")]
        public async Task<ActionResult<VehicleSegmentDto>> CreateSegment([FromBody] CreateVehicleSegmentDto dto)
        {
            try
            {
                var segment = await _vehicleService.CreateSegmentAsync(dto);
                return CreatedAtAction(nameof(GetSegmentById), new { id = segment.SegmentId }, segment);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("segments/{id}")]
        public async Task<ActionResult<VehicleSegmentDto>> UpdateSegment(long id, [FromBody] UpdateVehicleSegmentDto dto)
        {
            try
            {
                var segment = await _vehicleService.UpdateSegmentAsync(id, dto);
                if (segment == null)
                    return NotFound();

                return Ok(segment);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("segments/{id}")]
        public async Task<ActionResult> DeleteSegment(long id)
        {
            var success = await _vehicleService.DeleteSegmentAsync(id);
            if (!success)
                return NotFound();

            return NoContent();
        }
    }
}
