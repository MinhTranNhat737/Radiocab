using Microsoft.AspNetCore.Mvc;
using geo_service.DTOs;
using geo_service.Services.Interfaces;

namespace geo_service.Controllers.Api.v1
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class GeoController : ControllerBase
    {
        private readonly IGeoService _geoservice;

        public GeoController(IGeoService vehicleService)
        {
            _geoservice = vehicleService;
        }
        

        // Zone endpoints
        [HttpGet("zones")]
        public async Task<ActionResult<PagedResult<ZoneDto>>> GetZones([FromQuery] PageRequest request, [FromQuery] long? companyId = null)
        {
            var result = await _geoservice.GetZonesPagedAsync(request, companyId);
            return Ok(result);
        }

        [HttpPost("zones")]
        public async Task<ActionResult<ZoneDto>> CreateZone([FromBody] CreateZoneDto dto)
        {
            var zone = await _geoservice.CreateZoneAsync(dto);
            return CreatedAtAction(nameof(GetZones), new { id = zone.ZoneId }, zone);
        }

        [HttpPut("zones/{id}")]
        public async Task<ActionResult<ZoneDto>> UpdateZone(long id, [FromBody] UpdateZoneDto dto)
        {
            var zone = await _geoservice.UpdateZoneAsync(id, dto);
            if (zone == null)
                return NotFound();

            return Ok(zone);
        }

        [HttpDelete("zones/{id}")]
        public async Task<ActionResult> DeleteZone(long id)
        {
            var success = await _geoservice.DeleteZoneAsync(id);
            if (!success)
                return NotFound();

            return NoContent();
        }

        [HttpPost("zones/{zoneId}/wards/{wardId}")]
        public async Task<ActionResult> AddWardToZone(long zoneId, long wardId)
        {
            var success = await _geoservice.AddWardToZoneAsync(zoneId, wardId);
            if (!success)
                return BadRequest("Không thể thêm ward vào zone");

            return Ok();
        }

        [HttpDelete("zones/{zoneId}/wards/{wardId}")]
        public async Task<ActionResult> RemoveWardFromZone(long zoneId, long wardId)
        {
            var success = await _geoservice.RemoveWardFromZoneAsync(zoneId, wardId);
            if (!success)
                return BadRequest("Không thể xóa ward khỏi zone");

            return NoContent();
        }

        // Province endpoints
        [HttpGet("provinces")]
        public async Task<ActionResult<PagedResult<ProvinceDto>>> GetProvinces([FromQuery] PageRequest request)
        {
            var result = await _geoservice.GetProvincesPagedAsync(request);
            return Ok(result);
        }

        // Ward endpoints
        [HttpGet("wards")]
        public async Task<ActionResult<PagedResult<WardDto>>> GetWards([FromQuery] PageRequest request)
        {
            var result = await _geoservice.GetWardsPagedAsync(request);
            return Ok(result);
        }
    }
}
