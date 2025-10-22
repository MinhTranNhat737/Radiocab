using NpgsqlTypes;

namespace RadioCabs_BE.Models
{
    public enum ActiveFlag
    {
        [PgName("ACTIVE")] ACTIVE,
        [PgName("INACTIVE")] INACTIVE
    }

    public enum RoleType
    {
        [PgName("ADMIN")] ADMIN,
        [PgName("MANAGER")] MANAGER,
        [PgName("ACCOUNTANT")] ACCOUNTANT,
        [PgName("DISPATCHER")] DISPATCHER,
        [PgName("DRIVER")] DRIVER,
        [PgName("CUSTOMER")] CUSTOMER
    }

    public enum OrderStatus
    {
        [PgName("NEW")] NEW,
        [PgName("ASSIGNED")] ASSIGNED,
        [PgName("ONGOING")] ONGOING,
        [PgName("DONE")] DONE,
        [PgName("CANCELLED")] CANCELLED,
        [PgName("FAILED")] FAILED
    }

    public enum PaymentMethod
    {
        [PgName("CASH")] CASH,
        [PgName("CARD")] CARD,
        [PgName("WALLET")] WALLET,
        [PgName("BANK")] BANK
    }

    public enum FuelType
    {
        [PgName("GASOLINE")] GASOLINE,
        [PgName("DIESEL")] DIESEL,
        [PgName("EV")] EV,
        [PgName("HYBRID")] HYBRID
    }

    public enum VehicleCategory
    {
        [PgName("HATCHBACK_5")] HATCHBACK_5,
        [PgName("SEDAN_5")] SEDAN_5,
        [PgName("SUV_5")] SUV_5,
        [PgName("SUV_7")] SUV_7,
        [PgName("MPV_7")] MPV_7
    }

    public enum ShiftStatus
    {
        [PgName("PLANNED")] PLANNED,
        [PgName("ON")] ON,
        [PgName("OFF")] OFF,
        [PgName("CANCELLED")] CANCELLED,
        [PgName("COMPLETED")] COMPLETED
    }

    public enum RevocationReason
    {
        [PgName("USER_LOGOUT")] USER_LOGOUT,
        [PgName("ADMIN_FORCED")] ADMIN_FORCED,
        [PgName("ROTATION")] ROTATION,
        [PgName("COMPROMISED")] COMPROMISED,
        [PgName("EXPIRED")] EXPIRED,
        [PgName("OTHER")] OTHER
    }

    public enum VerificationPurpose
    {
        [PgName("SIGNUP")] SIGNUP,
        [PgName("PASSWORD_RESET")] PASSWORD_RESET,
        [PgName("EMAIL_CHANGE")] EMAIL_CHANGE,
        [PgName("MFA")] MFA
    }
}
