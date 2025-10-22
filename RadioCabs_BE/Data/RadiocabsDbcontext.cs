using Microsoft.EntityFrameworkCore;
using RadioCabs_BE.Models;
using Npgsql;

namespace RadioCabs_BE.Data
{
    public class RadiocabsDbContext : DbContext
    {
        public RadiocabsDbContext(DbContextOptions<RadiocabsDbContext> options) : base(options) { }

        // DbSets
        public DbSet<Account> Accounts => Set<Account>();
        public DbSet<Company> Companies => Set<Company>();
        public DbSet<AuthEmailCode> AuthEmailCodes => Set<AuthEmailCode>();
        public DbSet<AuthRefreshSession> AuthRefreshSessions => Set<AuthRefreshSession>();
        public DbSet<DriverSchedule> DriverSchedules => Set<DriverSchedule>();
        public DbSet<DriverScheduleTemplate> DriverScheduleTemplates => Set<DriverScheduleTemplate>();
        public DbSet<DriverVehicleAssignment> DriverVehicleAssignments => Set<DriverVehicleAssignment>();
        public DbSet<DrivingOrder> DrivingOrders => Set<DrivingOrder>();
        public DbSet<MembershipOrder> MembershipOrders => Set<MembershipOrder>();
        public DbSet<ModelPriceProvince> ModelPriceProvinces => Set<ModelPriceProvince>();
        public DbSet<Province> Provinces => Set<Province>();
        public DbSet<Ward> Wards => Set<Ward>();
        public DbSet<Zone> Zones => Set<Zone>();
        public DbSet<ZoneWard> ZoneWards => Set<ZoneWard>();
        public DbSet<VehicleSegment> VehicleSegments => Set<VehicleSegment>();
        public DbSet<VehicleModel> VehicleModels => Set<VehicleModel>();
        public DbSet<Vehicle> Vehicles => Set<Vehicle>();
        public DbSet<VehicleInProvince> VehicleInProvinces => Set<VehicleInProvince>();
        public DbSet<VehicleZonePreference> VehicleZonePreferences => Set<VehicleZonePreference>();
        public DbSet<VehicleModelWithSeats> VehicleModelWithSeats => Set<VehicleModelWithSeats>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Schema
            modelBuilder.HasDefaultSchema("public");
            modelBuilder.HasPostgresExtension("pgcrypto");

            // Enum mappings
            modelBuilder.HasPostgresEnum<RoleType>("public", "role_type");
            modelBuilder.HasPostgresEnum<ActiveFlag>("public", "active_flag");
            modelBuilder.HasPostgresEnum<OrderStatus>("public", "order_status");
            modelBuilder.HasPostgresEnum<PaymentMethod>("public", "payment_method");
            modelBuilder.HasPostgresEnum<FuelType>("public", "fuel_type_enum");
            modelBuilder.HasPostgresEnum<VehicleCategory>("public", "vehicle_category_enum");
            modelBuilder.HasPostgresEnum<ShiftStatus>("public", "shift_status");
            modelBuilder.HasPostgresEnum<RevocationReason>("public", "revocation_reason");
            modelBuilder.HasPostgresEnum<VerificationPurpose>("public", "verification_purpose");

            // Account configuration
            modelBuilder.Entity<Account>(entity =>
            {
                entity.ToTable("account");
                entity.HasKey(e => e.AccountId).HasName("account_pkey");
                entity.HasIndex(e => e.Username).IsUnique().HasDatabaseName("account_username_key");
                entity.HasIndex(e => new { e.CompanyId, e.Role }).HasDatabaseName("ix_account_company_role");
                entity.Property(e => e.Role).HasColumnType("role_type");
                entity.Property(e => e.Status).HasColumnType("active_flag");
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("now()");
                
                entity.HasOne(e => e.Company)
                    .WithMany(c => c.Accounts)
                    .HasForeignKey(e => e.CompanyId)
                    .HasConstraintName("account_company_id_fkey")
                    .OnDelete(DeleteBehavior.SetNull);
            });

            // Company configuration
            modelBuilder.Entity<Company>(entity =>
            {
                entity.ToTable("company");
                entity.HasKey(e => e.CompanyId).HasName("company_pkey");
                entity.HasIndex(e => e.Status).HasDatabaseName("ix_company_status");
                entity.Property(e => e.Status).HasColumnType("active_flag");
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("now()");
                
                entity.HasOne(e => e.ContactAccount)
                    .WithMany()
                    .HasForeignKey(e => e.ContactAccountId)
                    .HasConstraintName("fk_company_contact_account")
                    .OnDelete(DeleteBehavior.SetNull);
            });

            // Province configuration
            modelBuilder.Entity<Province>(entity =>
            {
                entity.ToTable("province");
                entity.HasKey(e => e.ProvinceId).HasName("province_pkey");
                entity.HasIndex(e => e.Code).IsUnique().HasDatabaseName("province_code_key");
            });

            // Ward configuration
            modelBuilder.Entity<Ward>(entity =>
            {
                entity.ToTable("ward");
                entity.HasKey(e => e.WardId).HasName("ward_pkey");
                entity.HasIndex(e => new { e.ProvinceId, e.Name }).IsUnique().HasDatabaseName("ward_province_id_name_key");
                
                entity.HasOne(e => e.Province)
                    .WithMany(p => p.Wards)
                    .HasForeignKey(e => e.ProvinceId)
                    .HasConstraintName("ward_province_id_fkey")
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // Zone configuration
            modelBuilder.Entity<Zone>(entity =>
            {
                entity.ToTable("zone");
                entity.HasKey(e => e.ZoneId).HasName("zone_pkey");
                entity.HasIndex(e => new { e.CompanyId, e.ProvinceId, e.Code }).IsUnique().HasDatabaseName("zone_company_id_province_id_code_key");
                entity.Property(e => e.IsActive).HasDefaultValue(true);
                
                entity.HasOne(e => e.Company)
                    .WithMany(c => c.Zones)
                    .HasForeignKey(e => e.CompanyId)
                    .HasConstraintName("zone_company_id_fkey")
                    .OnDelete(DeleteBehavior.Cascade);
                    
                entity.HasOne(e => e.Province)
                    .WithMany(p => p.Zones)
                    .HasForeignKey(e => e.ProvinceId)
                    .HasConstraintName("zone_province_id_fkey")
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // ZoneWard configuration
            modelBuilder.Entity<ZoneWard>(entity =>
            {
                entity.ToTable("zone_ward");
                entity.HasKey(e => new { e.ZoneId, e.WardId }).HasName("zone_ward_pkey");
                
                entity.HasOne(e => e.Zone)
                    .WithMany(z => z.ZoneWards)
                    .HasForeignKey(e => e.ZoneId)
                    .HasConstraintName("zone_ward_zone_id_fkey")
                    .OnDelete(DeleteBehavior.Cascade);
                    
                entity.HasOne(e => e.Ward)
                    .WithMany(w => w.ZoneWards)
                    .HasForeignKey(e => e.WardId)
                    .HasConstraintName("zone_ward_ward_id_fkey")
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // VehicleSegment configuration
            modelBuilder.Entity<VehicleSegment>(entity =>
            {
                entity.ToTable("vehicle_segment");
                entity.HasKey(e => e.SegmentId).HasName("vehicle_segment_pkey");
                entity.HasIndex(e => new { e.CompanyId, e.Code }).IsUnique().HasDatabaseName("vehicle_segment_company_id_code_key");
                entity.Property(e => e.IsActive).HasDefaultValue(true);
                
                entity.HasOne(e => e.Company)
                    .WithMany(c => c.VehicleSegments)
                    .HasForeignKey(e => e.CompanyId)
                    .HasConstraintName("vehicle_segment_company_id_fkey")
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // VehicleModel configuration
            modelBuilder.Entity<VehicleModel>(entity =>
            {
                entity.ToTable("vehicle_model");
                entity.HasKey(e => e.ModelId).HasName("vehicle_model_pkey");
                entity.HasIndex(e => new { e.CompanyId, e.Brand, e.ModelName }).IsUnique().HasDatabaseName("vehicle_model_company_id_brand_model_name_key");
                entity.Property(e => e.FuelType).HasColumnType("fuel_type_enum");
                entity.Property(e => e.SeatCategory).HasColumnType("vehicle_category_enum");
                entity.Property(e => e.IsActive).HasDefaultValue(true);
                
                entity.HasOne(e => e.Company)
                    .WithMany(c => c.VehicleModels)
                    .HasForeignKey(e => e.CompanyId)
                    .HasConstraintName("vehicle_model_company_id_fkey")
                    .OnDelete(DeleteBehavior.Cascade);
                    
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
                entity.HasIndex(e => e.PlateNumber).IsUnique().HasDatabaseName("vehicle_plate_number_key");
                entity.Property(e => e.Status).HasColumnType("active_flag");
                entity.Property(e => e.OdometerKm).HasDefaultValue(0);
                
                entity.HasOne(e => e.Company)
                    .WithMany(c => c.Vehicles)
                    .HasForeignKey(e => e.CompanyId)
                    .HasConstraintName("vehicle_company_id_fkey")
                    .OnDelete(DeleteBehavior.Cascade);
                    
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
                    
                entity.HasOne(e => e.Province)
                    .WithMany(p => p.VehicleInProvinces)
                    .HasForeignKey(e => e.ProvinceId)
                    .HasConstraintName("vehicle_in_province_province_id_fkey")
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
                    
                entity.HasOne(e => e.Zone)
                    .WithMany(z => z.VehicleZonePreferences)
                    .HasForeignKey(e => e.ZoneId)
                    .HasConstraintName("vehicle_zone_preference_zone_id_fkey")
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // ModelPriceProvince configuration
            modelBuilder.Entity<ModelPriceProvince>(entity =>
            {
                entity.ToTable("model_price_province");
                entity.HasKey(e => e.ModelPriceId).HasName("model_price_province_pkey");
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
                
                entity.HasOne(e => e.Company)
                    .WithMany(c => c.ModelPriceProvinces)
                    .HasForeignKey(e => e.CompanyId)
                    .HasConstraintName("model_price_province_company_id_fkey")
                    .OnDelete(DeleteBehavior.Cascade);
                    
                entity.HasOne(e => e.Province)
                    .WithMany(p => p.ModelPriceProvinces)
                    .HasForeignKey(e => e.ProvinceId)
                    .HasConstraintName("model_price_province_province_id_fkey")
                    .OnDelete(DeleteBehavior.Restrict);
                    
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

            // DriverVehicleAssignment configuration
            modelBuilder.Entity<DriverVehicleAssignment>(entity =>
            {
                entity.ToTable("driver_vehicle_assignment");
                entity.HasKey(e => e.AssignmentId).HasName("driver_vehicle_assignment_pkey");
                entity.HasIndex(e => new { e.DriverAccountId, e.StartAt }).HasDatabaseName("ix_dva_driver_time");
                entity.HasIndex(e => new { e.VehicleId, e.StartAt }).HasDatabaseName("ix_dva_vehicle_time");
                entity.HasIndex(e => e.VehicleId).IsUnique().HasDatabaseName("uq_dva_vehicle_open").HasFilter("\"end_at\" IS NULL");
                
                entity.HasOne(e => e.Driver)
                    .WithMany()
                    .HasForeignKey(e => e.DriverAccountId)
                    .HasConstraintName("driver_vehicle_assignment_driver_account_id_fkey")
                    .OnDelete(DeleteBehavior.Cascade);
                    
                entity.HasOne(e => e.Vehicle)
                    .WithMany(v => v.DriverVehicleAssignments)
                    .HasForeignKey(e => e.VehicleId)
                    .HasConstraintName("driver_vehicle_assignment_vehicle_id_fkey")
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // DriverScheduleTemplate configuration
            modelBuilder.Entity<DriverScheduleTemplate>(entity =>
            {
                entity.ToTable("driver_schedule_template");
                entity.HasKey(e => e.TemplateId).HasName("driver_schedule_template_pkey");
                entity.HasIndex(e => new { e.DriverAccountId, e.Weekday }).HasDatabaseName("ix_dst_driver_weekday").HasFilter("\"is_active\" = true");
                entity.Property(e => e.Weekday).HasColumnType("smallint");
                entity.Property(e => e.IsActive).HasDefaultValue(true);
                
                entity.HasOne(e => e.Driver)
                    .WithMany()
                    .HasForeignKey(e => e.DriverAccountId)
                    .HasConstraintName("driver_schedule_template_driver_account_id_fkey")
                    .OnDelete(DeleteBehavior.Cascade);
                    
                entity.HasOne(e => e.Vehicle)
                    .WithMany(v => v.DriverScheduleTemplates)
                    .HasForeignKey(e => e.VehicleId)
                    .HasConstraintName("driver_schedule_template_vehicle_id_fkey")
                    .OnDelete(DeleteBehavior.SetNull);
            });

            // DriverSchedule configuration
            modelBuilder.Entity<DriverSchedule>(entity =>
            {
                entity.ToTable("driver_schedule");
                entity.HasKey(e => e.ScheduleId).HasName("driver_schedule_pkey");
                entity.HasIndex(e => new { e.WorkDate, e.Status, e.DriverAccountId }).HasDatabaseName("ix_driver_schedule_lookup");
                entity.HasIndex(e => new { e.DriverAccountId, e.WorkDate, e.StartTime, e.EndTime }).IsUnique().HasDatabaseName("uq_driver_schedule_uni");
                entity.Property(e => e.Status).HasColumnType("varchar(20)");
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("now()");
                
                entity.HasOne(e => e.Driver)
                    .WithMany()
                    .HasForeignKey(e => e.DriverAccountId)
                    .HasConstraintName("driver_schedule_driver_account_id_fkey")
                    .OnDelete(DeleteBehavior.Cascade);
                    
                entity.HasOne(e => e.Vehicle)
                    .WithMany(v => v.DriverSchedules)
                    .HasForeignKey(e => e.VehicleId)
                    .HasConstraintName("driver_schedule_vehicle_id_fkey")
                    .OnDelete(DeleteBehavior.SetNull);
            });

            // DrivingOrder configuration
            modelBuilder.Entity<DrivingOrder>(entity =>
            {
                entity.ToTable("driving_order");
                entity.HasKey(e => e.OrderId).HasName("driving_order_pkey");
                entity.HasIndex(e => new { e.CompanyId, e.Status, e.CreatedAt }).HasDatabaseName("ix_order_company_status");
                entity.HasIndex(e => new { e.DriverAccountId, e.PickupTime }).HasDatabaseName("ix_order_driver_time");
                entity.HasIndex(e => new { e.FromProvinceId, e.ToProvinceId }).HasDatabaseName("ix_order_route");
                entity.Property(e => e.Status).HasColumnType("order_status");
                entity.Property(e => e.PaymentMethod).HasColumnType("payment_method");
                entity.Property(e => e.FareBreakdown).HasColumnType("jsonb");
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("now()");
                
                entity.HasOne(e => e.Company)
                    .WithMany(c => c.DrivingOrders)
                    .HasForeignKey(e => e.CompanyId)
                    .HasConstraintName("driving_order_company_id_fkey")
                    .OnDelete(DeleteBehavior.Cascade);
                    
                entity.HasOne(e => e.Customer)
                    .WithMany()
                    .HasForeignKey(e => e.CustomerAccountId)
                    .HasConstraintName("driving_order_customer_account_id_fkey")
                    .OnDelete(DeleteBehavior.SetNull);
                    
                entity.HasOne(e => e.Driver)
                    .WithMany()
                    .HasForeignKey(e => e.DriverAccountId)
                    .HasConstraintName("driving_order_driver_account_id_fkey")
                    .OnDelete(DeleteBehavior.SetNull);
                    
                entity.HasOne(e => e.Vehicle)
                    .WithMany(v => v.DrivingOrders)
                    .HasForeignKey(e => e.VehicleId)
                    .HasConstraintName("driving_order_vehicle_id_fkey")
                    .OnDelete(DeleteBehavior.SetNull);
                    
                entity.HasOne(e => e.Model)
                    .WithMany(m => m.DrivingOrders)
                    .HasForeignKey(e => e.ModelId)
                    .HasConstraintName("driving_order_model_id_fkey")
                    .OnDelete(DeleteBehavior.Restrict);
                    
                entity.HasOne(e => e.PriceRef)
                    .WithMany(p => p.DrivingOrders)
                    .HasForeignKey(e => e.PriceRefId)
                    .HasConstraintName("driving_order_price_ref_id_fkey")
                    .OnDelete(DeleteBehavior.SetNull);
                    
                entity.HasOne(e => e.FromProvince)
                    .WithMany(p => p.FromDrivingOrders)
                    .HasForeignKey(e => e.FromProvinceId)
                    .HasConstraintName("driving_order_from_province_id_fkey")
                    .OnDelete(DeleteBehavior.Restrict);
                    
                entity.HasOne(e => e.ToProvince)
                    .WithMany(p => p.ToDrivingOrders)
                    .HasForeignKey(e => e.ToProvinceId)
                    .HasConstraintName("driving_order_to_province_id_fkey")
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // MembershipOrder configuration
            modelBuilder.Entity<MembershipOrder>(entity =>
            {
                entity.ToTable("membership_order");
                entity.HasKey(e => e.MembershipOrderId).HasName("membership_order_pkey");
                entity.HasIndex(e => new { e.CompanyId, e.StartDate }).HasDatabaseName("ix_membership_company");
                entity.Property(e => e.PaymentMethod).HasColumnType("varchar(20)");
                
                entity.HasOne(e => e.Company)
                    .WithMany(c => c.MembershipOrders)
                    .HasForeignKey(e => e.CompanyId)
                    .HasConstraintName("membership_order_company_id_fkey")
                    .OnDelete(DeleteBehavior.Cascade);
                    
                entity.HasOne(e => e.Payer)
                    .WithMany()
                    .HasForeignKey(e => e.PayerAccountId)
                    .HasConstraintName("membership_order_payer_account_id_fkey")
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // AuthEmailCode configuration
            modelBuilder.Entity<AuthEmailCode>(entity =>
            {
                entity.ToTable("auth_email_code");
                entity.HasKey(e => e.CodeId).HasName("auth_email_code_pkey");
                entity.HasIndex(e => new { e.Email, e.Purpose }).IsUnique().HasDatabaseName("uq_email_code_active").HasFilter("\"consumed_at\" IS NULL");
                entity.Property(e => e.Purpose).HasColumnType("varchar(30)");
                entity.Property(e => e.SentAt).HasDefaultValueSql("now()");
                entity.Property(e => e.AttemptCount).HasDefaultValue(0);
                entity.Property(e => e.MaxAttempts).HasDefaultValue(5);
                
                entity.HasOne(e => e.Account)
                    .WithMany()
                    .HasForeignKey(e => e.AccountId)
                    .HasConstraintName("auth_email_code_account_id_fkey")
                    .OnDelete(DeleteBehavior.SetNull);
            });

            // AuthRefreshSession configuration
            modelBuilder.Entity<AuthRefreshSession>(entity =>
            {
                entity.ToTable("auth_refresh_session");
                entity.HasKey(e => e.SessionId).HasName("auth_refresh_session_pkey");
                entity.HasIndex(e => e.Jti).IsUnique().HasDatabaseName("auth_refresh_session_jti_key");
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("now()");
                
                entity.HasOne(e => e.Account)
                    .WithMany()
                    .HasForeignKey(e => e.AccountId)
                    .HasConstraintName("auth_refresh_session_account_id_fkey")
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // VehicleModelWithSeats view configuration
            modelBuilder.Entity<VehicleModelWithSeats>(entity =>
            {
                entity.ToView("vehicle_model_with_seats");
                entity.HasNoKey();
            });

            base.OnModelCreating(modelBuilder);
        }
    }
}


