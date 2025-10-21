// File: Data/RadiocabsDbContext.cs
using Microsoft.EntityFrameworkCore;
using Radiocabs_BE.Models;

namespace Radiocabs_BE.Data
{
    public class RadiocabsDbContext : DbContext
    {
        public RadiocabsDbContext(DbContextOptions<RadiocabsDbContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Kích hoạt extension có trong DB dump
            modelBuilder.HasPostgresExtension("pgcrypto");

            // Khai báo Postgres ENUMs đúng tên/type trong DB
            modelBuilder.HasPostgresEnum<RoleType>("public", "role_type");
            modelBuilder.HasPostgresEnum<ActiveFlag>("public", "active_flag");
            modelBuilder.HasPostgresEnum<OrderStatus>("public", "order_status");
            modelBuilder.HasPostgresEnum<PaymentMethod>("public", "payment_method");
            modelBuilder.HasPostgresEnum<FuelType>("public", "fuel_type_enum");
            modelBuilder.HasPostgresEnum<VehicleCategory>("public", "vehicle_category_enum");
            modelBuilder.HasPostgresEnum<ShiftStatus>("public", "shift_status");

            base.OnModelCreating(modelBuilder);
        }
    }
}
