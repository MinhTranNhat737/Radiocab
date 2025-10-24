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
        public async Task<ActionResult<PagedResult<VehicleDto>>> GetVehicles([FromQuery] PageRequest request, [FromQuery] long? companyId = null)
        {
            var result = await _vehicleService.GetVehiclesPagedAsync(request, companyId);
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

        // Zone endpoints
        [HttpGet("zones")]
        public async Task<ActionResult<PagedResult<ZoneDto>>> GetZones([FromQuery] PageRequest request, [FromQuery] long? companyId = null)
        {
            var result = await _vehicleService.GetZonesPagedAsync(request, companyId);
            return Ok(result);
        }

        [HttpPost("zones")]
        public async Task<ActionResult<ZoneDto>> CreateZone([FromBody] CreateZoneDto dto)
        {
            var zone = await _vehicleService.CreateZoneAsync(dto);
            return CreatedAtAction(nameof(GetZones), new { id = zone.ZoneId }, zone);
        }

        [HttpPut("zones/{id}")]
        public async Task<ActionResult<ZoneDto>> UpdateZone(long id, [FromBody] UpdateZoneDto dto)
        {
            var zone = await _vehicleService.UpdateZoneAsync(id, dto);
            if (zone == null)
                return NotFound();

            return Ok(zone);
        }

        [HttpDelete("zones/{id}")]
        public async Task<ActionResult> DeleteZone(long id)
        {
            var success = await _vehicleService.DeleteZoneAsync(id);
            if (!success)
                return NotFound();

            return NoContent();
        }

        // Zone Ward endpoints
        [HttpGet("zone-wards")]
        public async Task<ActionResult<PagedResult<ZoneWardDto>>> GetZoneWards([FromQuery] PageRequest request)
        {
            var result = await _vehicleService.GetZoneWardsPagedAsync(request);
            return Ok(result);
        }

        [HttpPost("zones/{zoneId}/wards/{wardId}")]
        public async Task<ActionResult> AddWardToZone(long zoneId, long wardId)
        {
            var success = await _vehicleService.AddWardToZoneAsync(zoneId, wardId);
            if (!success)
                return BadRequest("Không thể thêm ward vào zone");

            return Ok();
        }

        [HttpDelete("zones/{zoneId}/wards/{wardId}")]
        public async Task<ActionResult> RemoveWardFromZone(long zoneId, long wardId)
        {
            var success = await _vehicleService.RemoveWardFromZoneAsync(zoneId, wardId);
            if (!success)
                return BadRequest("Không thể xóa ward khỏi zone");

            return NoContent();
        }

        // Province endpoints
        [HttpGet("provinces")]
        public async Task<ActionResult<PagedResult<ProvinceDto>>> GetProvinces([FromQuery] PageRequest request)
        {
            var result = await _vehicleService.GetProvincesPagedAsync(request);
            return Ok(result);
        }

        // Ward endpoints
        [HttpGet("wards")]
        public async Task<ActionResult<PagedResult<WardDto>>> GetWards([FromQuery] PageRequest request)
        {
            var result = await _vehicleService.GetWardsPagedAsync(request);
            return Ok(result);
        }

        // Note: GetVehicles and DeleteVehicle methods are already defined above

        // Vehicle Province endpoints
        [HttpGet("vehicle-in-provinces")]
        public async Task<ActionResult<PagedResult<VehicleInProvinceDto>>> GetVehicleInProvinces([FromQuery] PageRequest request)
        {
            var result = await _vehicleService.GetVehicleInProvincesPagedAsync(request);
            return Ok(result);
        }

        // Vehicle Zone Preference endpoints
        [HttpGet("vehicle-zone-preferences")]
        public async Task<ActionResult<PagedResult<VehicleZonePreferenceDto>>> GetVehicleZonePreferences([FromQuery] PageRequest request)
        {
            var result = await _vehicleService.GetVehicleZonePreferencesPagedAsync(request);
            return Ok(result);
        }

        // Vehicle Segment endpoints
        [HttpGet("vehicle-segments")]
        public async Task<ActionResult<PagedResult<VehicleSegmentDto>>> GetVehicleSegments([FromQuery] PageRequest request, [FromQuery] long? companyId = null)
        {
            var result = await _vehicleService.GetSegmentsPagedAsync(request, companyId);
            return Ok(result);
        }

        [HttpPost("vehicle-segments")]
        public async Task<ActionResult<VehicleSegmentDto>> CreateVehicleSegment([FromBody] CreateVehicleSegmentDto dto)
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

        [HttpPut("vehicle-segments/{id}")]
        public async Task<ActionResult<VehicleSegmentDto>> UpdateVehicleSegment(long id, [FromBody] UpdateVehicleSegmentDto dto)
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

        [HttpDelete("vehicle-segments/{id}")]
        public async Task<ActionResult> DeleteVehicleSegment(long id)
        {
            try
            {
                var success = await _vehicleService.DeleteSegmentAsync(id);
                if (!success)
                    return NotFound();

                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        // Vehicle Model endpoints
        [HttpGet("vehicle-models")]
        public async Task<ActionResult<PagedResult<VehicleModelDto>>> GetVehicleModels([FromQuery] PageRequest request, [FromQuery] long? companyId = null)
        {
            var result = await _vehicleService.GetModelsPagedAsync(request, companyId);
            return Ok(result);
        }

        [HttpPost("vehicle-models")]
        public async Task<ActionResult<VehicleModelDto>> CreateVehicleModel([FromBody] CreateVehicleModelDto dto)
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

        [HttpPut("vehicle-models/{id}")]
        public async Task<ActionResult<VehicleModelDto>> UpdateVehicleModel(long id, [FromBody] UpdateVehicleModelDto dto)
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

        [HttpDelete("vehicle-models/{id}")]
        public async Task<ActionResult> DeleteVehicleModel(long id)
        {
            try
            {
                var success = await _vehicleService.DeleteModelAsync(id);
                if (!success)
                    return NotFound();

                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        // Model Price Province endpoints
        [HttpGet("model-price-provinces")]
        public async Task<ActionResult<PagedResult<ModelPriceProvinceDto>>> GetModelPriceProvinces([FromQuery] PageRequest request)
        {
            var result = await _vehicleService.GetModelPriceProvincesPagedAsync(request);
            return Ok(result);
        }

        [HttpPost("model-price-provinces")]
        public async Task<ActionResult<ModelPriceProvinceDto>> CreateModelPriceProvince([FromBody] CreateModelPriceProvinceDto dto)
        {
            try
            {
                var modelPriceProvince = await _vehicleService.CreateModelPriceProvinceAsync(dto);
                return CreatedAtAction(nameof(GetModelPriceProvinces), new { id = modelPriceProvince.ModelPriceId }, modelPriceProvince);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // Driver Vehicle Assignment endpoints
        [HttpPost("driver-vehicle-assignments")]
        public async Task<ActionResult<DriverVehicleAssignmentDto>> CreateDriverVehicleAssignment([FromBody] CreateDriverVehicleAssignmentDto dto)
        {
            try
            {
                var assignment = await _vehicleService.CreateDriverVehicleAssignmentAsync(dto);
                return CreatedAtAction(nameof(GetVehicles), new { id = assignment.AssignmentId }, assignment);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
