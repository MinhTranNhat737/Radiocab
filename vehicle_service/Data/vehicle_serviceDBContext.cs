using Microsoft.EntityFrameworkCore;
using vehicle_service.Models;
using vehicle_service.Models;

namespace vehicle_service.Data
{
    public class vehicle_serviceDBContext : DbContext
    {
        public vehicle_serviceDBContext(DbContextOptions<vehicle_serviceDBContext> options) : base(options) { }

        // DbSets
        public DbSet<VehicleSegment> VehicleSegments => Set<VehicleSegment>();
        public DbSet<VehicleModel> VehicleModels => Set<VehicleModel>();
        public DbSet<Vehicle> Vehicles => Set<Vehicle>();
        public DbSet<VehicleInProvince> VehicleInProvinces => Set<VehicleInProvince>();
        public DbSet<VehicleZonePreference> VehicleZonePreferences => Set<VehicleZonePreference>();
        public DbSet<ModelPriceProvince> ModelPriceProvinces => Set<ModelPriceProvince>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Schema
            modelBuilder.HasDefaultSchema("vehicle");
            modelBuilder.HasPostgresExtension("pgcrypto");

            // Account configuration
            modelBuilder.Entity<VehicleSegment>(entity =>
            {
                entity.ToTable("vehicle_segment");
                entity.HasKey(e => e.SegmentId).HasName("vehicle_segment_pkey");
                entity.Property(e => e.SegmentId).ValueGeneratedOnAdd();
                entity.HasIndex(e => new { e.CompanyId, e.Code }).IsUnique().HasDatabaseName("vehicle_segment_company_id_code_key");
                entity.Property(e => e.IsActive).HasDefaultValue(true);
            });

            // VehicleModel configuration
            modelBuilder.Entity<VehicleModel>(entity =>
            {
                entity.ToTable("vehicle_model");
                entity.HasKey(e => e.ModelId).HasName("vehicle_model_pkey");
                entity.Property(e => e.ModelId).ValueGeneratedOnAdd();
                entity.HasIndex(e => new { e.CompanyId, e.Brand, e.ModelName }).IsUnique().HasDatabaseName("vehicle_model_company_id_brand_model_name_key");
                entity.Property(e => e.FuelType).HasColumnType("fuel_type_enum");
                entity.Property(e => e.SeatCategory).HasColumnType("vehicle_category_enum");
                entity.Property(e => e.IsActive).HasDefaultValue(true);

                entity.HasOne(e => e.Segment)
                    .WithMany(s => s.VehicleModels)
                    .HasForeignKey(e => e.SegmentId)
                    .HasConstraintName("vehicle_model_segment_id_fkey")
                    .OnDelete(DeleteBehavior.SetNull);
            });

            // Vehicle configuration
            modelBuilder.Entity<Vehicle>(entity =>
            {
                entity.ToTable("vehicle");
                entity.HasKey(e => e.VehicleId).HasName("vehicle_pkey");
                entity.Property(e => e.VehicleId).ValueGeneratedOnAdd();
                entity.HasIndex(e => e.PlateNumber).IsUnique().HasDatabaseName("vehicle_plate_number_key");
                entity.Property(e => e.Status).HasColumnType("active_flag");
                entity.Property(e => e.OdometerKm).HasDefaultValue(0);


                entity.HasOne(e => e.Model)
                    .WithMany(m => m.Vehicles)
                    .HasForeignKey(e => e.ModelId)
                    .HasConstraintName("vehicle_model_id_fkey")
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // VehicleInProvince configuration
            modelBuilder.Entity<VehicleInProvince>(entity =>
            {
                entity.ToTable("vehicle_in_province");
                entity.HasKey(e => new { e.VehicleId, e.ProvinceId }).HasName("vehicle_in_province_pkey");
                entity.Property(e => e.Allowed).HasDefaultValue(true);

                entity.HasOne(e => e.Vehicle)
                    .WithMany(v => v.VehicleInProvinces)
                    .HasForeignKey(e => e.VehicleId)
                    .HasConstraintName("vehicle_in_province_vehicle_id_fkey")
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // VehicleZonePreference configuration
            modelBuilder.Entity<VehicleZonePreference>(entity =>
            {
                entity.ToTable("vehicle_zone_preference");
                entity.HasKey(e => new { e.VehicleId, e.ZoneId }).HasName("vehicle_zone_preference_pkey");
                entity.Property(e => e.Priority).HasDefaultValue(100);

                entity.HasOne(e => e.Vehicle)
                    .WithMany(v => v.VehicleZonePreferences)
                    .HasForeignKey(e => e.VehicleId)
                    .HasConstraintName("vehicle_zone_preference_vehicle_id_fkey")
                    .OnDelete(DeleteBehavior.Cascade);

            });

            // ModelPriceProvince configuration
            modelBuilder.Entity<ModelPriceProvince>(entity =>
            {
                entity.ToTable("model_price_province");
                entity.HasKey(e => e.ModelPriceId).HasName("model_price_province_pkey");
                entity.Property(e => e.ModelPriceId).ValueGeneratedOnAdd();
                entity.HasIndex(e => new { e.CompanyId, e.ProvinceId, e.ModelId, e.IsActive, e.DateStart }).HasDatabaseName("ix_mpp_lookup");
                entity.Property(e => e.IsActive).HasDefaultValue(true);

                // Column mappings
                entity.Property(e => e.RateFirst20Km).HasColumnName("rate_first20_km");
                entity.Property(e => e.RateOver20Km).HasColumnName("rate_over20_km");
                entity.Property(e => e.TrafficAddPerKm).HasColumnName("traffic_add_per_km");
                entity.Property(e => e.RainAddPerTrip).HasColumnName("rain_add_per_trip");
                entity.Property(e => e.IntercityRatePerKm).HasColumnName("intercity_rate_per_km");
                entity.Property(e => e.TimeStart).HasColumnName("time_start");
                entity.Property(e => e.TimeEnd).HasColumnName("time_end");
                entity.Property(e => e.DateStart).HasColumnName("date_start");
                entity.Property(e => e.DateEnd).HasColumnName("date_end");

                entity.HasOne(e => e.Model)
                    .WithMany(m => m.ModelPriceProvinces)
                    .HasForeignKey(e => e.ModelId)
                    .HasConstraintName("model_price_province_model_id_fkey")
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(e => e.Parent)
                    .WithMany(p => p.Children)
                    .HasForeignKey(e => e.ParentId)
                    .HasConstraintName("model_price_province_parent_id_fkey")
                    .OnDelete(DeleteBehavior.SetNull);
            });


        }
    }
}


