using common.Models;
using Microsoft.EntityFrameworkCore;

public class CommonDbContext : DbContext
{
    public CommonDbContext(DbContextOptions<CommonDbContext> options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasDefaultSchema("common");
        modelBuilder.HasPostgresExtension("pgcrypto");

        modelBuilder.HasPostgresEnum<RoleType>("public", "role_type");
        modelBuilder.HasPostgresEnum<ActiveFlag>("public", "active_flag");
        modelBuilder.HasPostgresEnum<OrderStatus>("public", "order_status");
        modelBuilder.HasPostgresEnum<PaymentMethod>("public", "payment_method");
        modelBuilder.HasPostgresEnum<FuelType>("public", "fuel_type_enum");
        modelBuilder.HasPostgresEnum<VehicleCategory>("public", "vehicle_category_enum");
        modelBuilder.HasPostgresEnum<ShiftStatus>("public", "shift_status");
        modelBuilder.HasPostgresEnum<RevocationReason>("public", "revocation_reason");
        modelBuilder.HasPostgresEnum<VerificationPurpose>("public", "verification_purpose");
    }
}