using common.Models;
using System.ComponentModel.DataAnnotations;

namespace driving_service.DTOs
{
    public class CreateDrivingOrderDto
    {
        [Required] public long CompanyId { get; set; }
        public long? CustomerAccountId { get; set; }
        public long? VehicleId { get; set; }
        public long? DriverAccountId { get; set; }
        [Required] public long ModelId { get; set; }
        public long? PriceRefId { get; set; }
        public long? DriverScheduleId { get; set; }
        [Required] public long FromProvinceId { get; set; }
        [Required] public long ToProvinceId { get; set; }
        public string? PickupAddress { get; set; }
        public string? DropoffAddress { get; set; }
        public DateTimeOffset? PickupTime { get; set; }
        public decimal? TotalKm { get; set; }
        public decimal? InnerCityKm { get; set; }
        public decimal? IntercityKm { get; set; }
        public decimal? TrafficKm { get; set; }
        public bool IsRaining { get; set; } = false;
        public int WaitMinutes { get; set; } = 0;
        public decimal? BaseFare { get; set; }
        public decimal? TrafficUnitPrice { get; set; }
        public decimal? TrafficFee { get; set; }
        public decimal? RainFee { get; set; }
        public decimal? IntercityUnitPrice { get; set; }
        public decimal? IntercityFee { get; set; }
        public decimal? OtherFee { get; set; }
        public decimal? TotalAmount { get; set; }
        public PaymentMethod? PaymentMethod { get; set; }
    }

    public class UpdateDrivingOrderDto
    {
        public long? VehicleId { get; set; }
        public long? DriverAccountId { get; set; }
        public string? PickupAddress { get; set; }
        public string? DropoffAddress { get; set; }
        public DateTimeOffset? PickupTime { get; set; }
        public DateTimeOffset? DropoffTime { get; set; }
        public OrderStatus? Status { get; set; }
        public decimal? TotalKm { get; set; }
        public decimal? InnerCityKm { get; set; }
        public decimal? IntercityKm { get; set; }
        public decimal? TrafficKm { get; set; }
        public bool? IsRaining { get; set; }
        public int? WaitMinutes { get; set; }
        public decimal? BaseFare { get; set; }
        public decimal? TrafficUnitPrice { get; set; }
        public decimal? TrafficFee { get; set; }
        public decimal? RainFee { get; set; }
        public decimal? IntercityUnitPrice { get; set; }
        public decimal? IntercityFee { get; set; }
        public decimal? OtherFee { get; set; }
        public decimal? TotalAmount { get; set; }
        public string? FareBreakdown { get; set; }
        public PaymentMethod? PaymentMethod { get; set; }
        public DateTimeOffset? PaidAt { get; set; }
    }

    public class DrivingOrderDto
    {
        public long OrderId { get; set; }
        public long CompanyId { get; set; }
        public long? CustomerAccountId { get; set; }
        public long? VehicleId { get; set; }
        public long? DriverAccountId { get; set; }
        public long ModelId { get; set; }
        public long? PriceRefId { get; set; }
        public long? DriverScheduleId { get; set; }
        public long FromProvinceId { get; set; }
        public long ToProvinceId { get; set; }
        public string? PickupAddress { get; set; }
        public string? DropoffAddress { get; set; }
        public DateTimeOffset? PickupTime { get; set; }
        public DateTimeOffset? DropoffTime { get; set; }
        public OrderStatus Status { get; set; }
        public decimal TotalKm { get; set; }
        public decimal InnerCityKm { get; set; }
        public decimal IntercityKm { get; set; }
        public decimal TrafficKm { get; set; }
        public bool IsRaining { get; set; }
        public int WaitMinutes { get; set; }
        public decimal BaseFare { get; set; }
        public decimal TrafficUnitPrice { get; set; }
        public decimal TrafficFee { get; set; }
        public decimal RainFee { get; set; }
        public decimal IntercityUnitPrice { get; set; }
        public decimal IntercityFee { get; set; }
        public decimal OtherFee { get; set; }
        public decimal TotalAmount { get; set; }
        public string? FareBreakdown { get; set; }
        public PaymentMethod? PaymentMethod { get; set; }
        public DateTimeOffset? PaidAt { get; set; }
        public DateTimeOffset CreatedAt { get; set; }
        public DateTimeOffset? UpdatedAt { get; set; }
        public DriverScheduleDto? DriverSchedule { get; set; }
    }


    public class DriverScheduleDto
    {
        public long ScheduleId { get; set; }
        public long DriverAccountId { get; set; }
        public DateOnly WorkDate { get; set; }
        public TimeOnly StartTime { get; set; }
        public TimeOnly EndTime { get; set; }
        public long? VehicleId { get; set; }
        public ShiftStatus Status { get; set; }
        public string? Note { get; set; }
        public DateTimeOffset CreatedAt { get; set; }
        public DateTimeOffset? UpdatedAt { get; set; }
        
    }

}





