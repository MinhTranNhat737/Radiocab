using Microsoft.AspNetCore.Mvc;
using RadioCabs_BE.DTOs;
using RadioCabs_BE.Services.Interfaces;

namespace RadioCabs_BE.Controllers.Api.v1
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class DrivingOrdersController : ControllerBase
    {
        private readonly IDrivingOrderService _drivingOrderService;

        public DrivingOrdersController(IDrivingOrderService drivingOrderService)
        {
            _drivingOrderService = drivingOrderService;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<DrivingOrderDto>> GetById(long id)
        {
            var order = await _drivingOrderService.GetByIdAsync(id);
            if (order == null)
                return NotFound();

            return Ok(order);
        }

        [HttpGet]
        public async Task<ActionResult<PagedResult<DrivingOrderDto>>> GetPaged([FromQuery] PageRequest request)
        {
            var result = await _drivingOrderService.GetPagedAsync(request);
            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<DrivingOrderDto>> Create([FromBody] CreateDrivingOrderDto dto)
        {
            try
            {
                var order = await _drivingOrderService.CreateAsync(dto);
                return CreatedAtAction(nameof(GetById), new { id = order.OrderId }, order);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<DrivingOrderDto>> Update(long id, [FromBody] UpdateDrivingOrderDto dto)
        {
            try
            {
                var order = await _drivingOrderService.UpdateAsync(id, dto);
                if (order == null)
                    return NotFound();

                return Ok(order);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(long id)
        {
            var success = await _drivingOrderService.DeleteAsync(id);
            if (!success)
                return NotFound();

            return NoContent();
        }

        [HttpGet("driver/{driverId}")]
        public async Task<ActionResult<PagedResult<DrivingOrderDto>>> GetByDriver(long driverId, [FromQuery] PageRequest request)
        {
            var result = await _drivingOrderService.GetByDriverAsync(driverId, request);
            return Ok(result);
        }

        [HttpGet("customer/{customerId}")]
        public async Task<ActionResult<PagedResult<DrivingOrderDto>>> GetByCustomer(long customerId, [FromQuery] PageRequest request)
        {
            var result = await _drivingOrderService.GetByCustomerAsync(customerId, request);
            return Ok(result);
        }

        [HttpPost("{id}/assign-driver")]
        public async Task<ActionResult<DrivingOrderDto>> AssignDriver(long id, [FromBody] AssignDriverDto dto)
        {
            try
            {
                var order = await _drivingOrderService.AssignDriverAsync(id, dto.DriverId, dto.VehicleId);
                if (order == null)
                    return NotFound();

                return Ok(order);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("{id}/status")]
        public async Task<ActionResult<DrivingOrderDto>> UpdateStatus(long id, [FromBody] UpdateStatusDto dto)
        {
            try
            {
                var order = await _drivingOrderService.UpdateStatusAsync(id, dto.Status);
                if (order == null)
                    return NotFound();

                return Ok(order);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("{id}/complete")]
        public async Task<ActionResult<DrivingOrderDto>> CompleteOrder(long id, [FromBody] CompleteOrderDto dto)
        {
            try
            {
                var order = await _drivingOrderService.CompleteOrderAsync(id, dto.TotalKm, dto.InnerCityKm, dto.IntercityKm, dto.TrafficKm, dto.IsRaining, dto.WaitMinutes);
                if (order == null)
                    return NotFound();

                return Ok(order);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("{id}/cancel")]
        public async Task<ActionResult<DrivingOrderDto>> CancelOrder(long id, [FromBody] CancelOrderDto dto)
        {
            try
            {
                var order = await _drivingOrderService.CancelOrderAsync(id, dto.Reason);
                if (order == null)
                    return NotFound();

                return Ok(order);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }

    public class AssignDriverDto
    {
        public long DriverId { get; set; }
        public long VehicleId { get; set; }
    }

    public class UpdateStatusDto
    {
        public string Status { get; set; } = null!;
    }

    public class CompleteOrderDto
    {
        public decimal TotalKm { get; set; }
        public decimal InnerCityKm { get; set; }
        public decimal IntercityKm { get; set; }
        public decimal TrafficKm { get; set; }
        public bool IsRaining { get; set; }
        public int WaitMinutes { get; set; }
    }

    public class CancelOrderDto
    {
        public string Reason { get; set; } = null!;
    }
}
