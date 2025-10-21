using NpgsqlTypes;
namespace RadioCabs_BE.Models
{
    public enum ActiveFlag
    {
        [PgName("ACTIVE")] ACTIVE,
        [PgName("INACTIVE")] INACTIVE
    }
    public enum RoleType { ADMIN, MANAGER, ACCOUNTANT, DISPATCHER, DRIVER, CUSTOMER }
    public enum OrderStatus { NEW, ASSIGNED, ONGOING, DONE, CANCELLED, FAILED }
    public enum PaymentMethod { CASH, CARD, WALLET, BANK }
    public enum FuelType { GASOLINE, DIESEL, EV, HYBRID }
    public enum VehicleCategory { HATCHBACK_5, SEDAN_5, SUV_5, SUV_7, MPV_7 }
    public enum ShiftStatus { PLANNED, ON, OFF, CANCELLED, COMPLETED }
}
