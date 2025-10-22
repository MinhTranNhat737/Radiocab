using RadioCabs_BE.DTOs;
using RadioCabs_BE.Models;

namespace RadioCabs_BE.Services.Interfaces
{
    public interface IDrivingOrderService
    {
        Task<DrivingOrderDto?> GetByIdAsync(long id);
        Task<PagedResult<DrivingOrderDto>> GetPagedAsync(PageRequest request);
        Task<DrivingOrderDto> CreateAsync(CreateDrivingOrderDto dto);
        Task<DrivingOrderDto?> UpdateAsync(long id, UpdateDrivingOrderDto dto);
        Task<bool> DeleteAsync(long id);
        Task<PagedResult<DrivingOrderDto>> GetByDriverAsync(long driverId, PageRequest request);
        Task<PagedResult<DrivingOrderDto>> GetByCustomerAsync(long customerId, PageRequest request);
        Task<DrivingOrderDto?> AssignDriverAsync(long orderId, long driverId, long vehicleId);
        Task<DrivingOrderDto?> UpdateStatusAsync(long orderId, OrderStatus status);
        Task<DrivingOrderDto?> CompleteOrderAsync(long orderId, decimal totalKm, decimal innerCityKm, decimal intercityKm, decimal trafficKm, bool isRaining, int waitMinutes);
        Task<DrivingOrderDto?> CancelOrderAsync(long orderId, string reason);
    }
}
