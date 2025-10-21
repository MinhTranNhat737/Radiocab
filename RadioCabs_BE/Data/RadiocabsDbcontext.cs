using Microsoft.EntityFrameworkCore;
using RadioCabs_BE.Models;       // namespace models của bạn
using System;

namespace RadioCabs_BE.Data
{
    public class RadiocabsDbContext : DbContext
    {
        public RadiocabsDbContext(DbContextOptions<RadiocabsDbContext> options) : base(options) { }

        // ===== DbSet cho TABLES =====
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
        public DbSet<VehicleInProvince> VehiclesInProvince => Set<VehicleInProvince>();
        public DbSet<VehicleZonePreference> VehicleZonePreferences => Set<VehicleZonePreference>();

        // ===== DbSet cho VIEW (keyless) =====
        public DbSet<VehicleModelWithSeats> VehicleModelWithSeats => Set<VehicleModelWithSeats>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Schema mặc định
            modelBuilder.HasDefaultSchema("public");

            // Extension
            modelBuilder.HasPostgresExtension("pgcrypto");

            // Đăng ký Postgres ENUM (tên type đúng như DB)
            modelBuilder.HasPostgresEnum<RoleType>("public", "role_type");
            modelBuilder.HasPostgresEnum<ActiveFlag>("public", "active_flag");
            modelBuilder.HasPostgresEnum<OrderStatus>("public", "order_status");
            modelBuilder.HasPostgresEnum<PaymentMethod>("public", "payment_method");
            modelBuilder.HasPostgresEnum<FuelType>("public", "fuel_type_enum");
            modelBuilder.HasPostgresEnum<VehicleCategory>("public", "vehicle_category_enum");
            modelBuilder.HasPostgresEnum<ShiftStatus>("public", "shift_status");
            // modelBuilder.HasPostgresEnum<RevocationReason>("public", "revocation_reason");
            // modelBuilder.HasPostgresEnum<VerificationPurpose>("public", "verification_purpose");

            // ====== Account ======
            modelBuilder.Entity<Account>(e =>
            {
                e.ToTable("account");
                e.HasKey(x => x.AccountId).HasName("account_pkey");
                e.HasIndex(x => new { x.CompanyId, x.Role }).HasDatabaseName("ix_account_company_role");
                e.HasIndex(x => x.Username).IsUnique().HasDatabaseName("account_username_key");

                // map enum column types (giúp EF generate đúng type khi migrate)
                e.Property(x => x.Role).HasColumnType("public.role_type");
                e.Property(x => x.Status).HasColumnType("public.active_flag");
            });

            // ====== Company ======
            modelBuilder.Entity<Company>(e =>
            {
                e.ToTable("company");
                e.HasKey(x => x.CompanyId).HasName("company_pkey");
                e.HasIndex(x => x.Status).HasDatabaseName("ix_company_status");
                e.HasOne(x => x.ContactAccount)
                    .WithMany()
                    .HasForeignKey(x => x.ContactAccountId)
                    .HasConstraintName("fk_company_contact_account")
                    .OnDelete(DeleteBehavior.SetNull);
            });

            // ====== AuthEmailCode ======
            modelBuilder.Entity<AuthEmailCode>(e =>
            {
                e.ToTable("auth_email_code");
                e.HasKey(x => x.CodeId).HasName("auth_email_code_pkey");
                e.HasIndex(x => new { x.Email, x.Purpose })
                    .IsUnique()
                    .HasFilter("\"consumed_at\" IS NULL")
                    .HasDatabaseName("uq_email_code_active");
                e.Property(x => x.Purpose).HasColumnType("varchar(30)");
            });

            // ====== AuthRefreshSession ======
            modelBuilder.Entity<AuthRefreshSession>(e =>
            {
                e.ToTable("auth_refresh_session");
                e.HasKey(x => x.SessionId).HasName("auth_refresh_session_pkey");
                e.HasIndex(x => x.Jti).IsUnique().HasDatabaseName("auth_refresh_session_jti_key");
                e.HasOne(x => x.Account)
                    .WithMany()
                    .HasForeignKey(x => x.AccountId)
                    .HasConstraintName("auth_refresh_session_account_id_fkey")
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // ====== DriverScheduleTemplate ======
            modelBuilder.Entity<DriverScheduleTemplate>(e =>
            {
                e.ToTable("driver_schedule_template");
                e.HasKey(x => x.TemplateId).HasName("driver_schedule_template_pkey");
                e.HasIndex(x => new { x.DriverAccountId, x.Weekday })
                    .HasFilter("\"is_active\" = true")
                    .HasDatabaseName("ix_dst_driver_weekday");
                e.Property(x => x.Weekday).HasColumnType("smallint"); // 0..6
                e.Property(x => x.IsActive).HasDefaultValue(true);
                e.Property(x => x.StartTime).HasColumnType("time without time zone");
                e.Property(x => x.EndTime).HasColumnType("time without time zone");
                e.HasOne(x => x.Driver)
                    .WithMany()
                    .HasForeignKey(x => x.DriverAccountId)
                    .OnDelete(DeleteBehavior.Cascade);
                e.HasOne(x => x.Vehicle)
                    .WithMany()
                    .HasForeignKey(x => x.VehicleId)
                    .OnDelete(DeleteBehavior.SetNull);
            });

            // ====== DriverSchedule ======
            modelBuilder.Entity<DriverSchedule>(e =>
            {
                e.ToTable("driver_schedule");
                e.HasKey(x => x.ScheduleId).HasName("driver_schedule_pkey");
                e.HasIndex(x => new { x.WorkDate, x.Status, x.DriverAccountId })
                    .HasDatabaseName("ix_driver_schedule_lookup");
                e.HasIndex(x => new { x.DriverAccountId, x.WorkDate, x.StartTime, x.EndTime })
                    .IsUnique().HasDatabaseName("uq_driver_schedule_uni");
                e.Property(x => x.Status).HasColumnType("public.shift_status");
                e.Property(x => x.StartTime).HasColumnType("time without time zone");
                e.Property(x => x.EndTime).HasColumnType("time without time zone");
                e.Property(x => x.CreatedAt).HasDefaultValueSql("now()");
                e.HasOne(x => x.Driver)
                    .WithMany()
                    .HasForeignKey(x => x.DriverAccountId)
                    .OnDelete(DeleteBehavior.Cascade);
                e.HasOne(x => x.Vehicle)
                    .WithMany()
                    .HasForeignKey(x => x.VehicleId)
                    .OnDelete(DeleteBehavior.SetNull);
            });

            // ====== DriverVehicleAssignment ======
            modelBuilder.Entity<DriverVehicleAssignment>(e =>
            {
                e.ToTable("driver_vehicle_assignment");
                e.HasKey(x => x.AssignmentId).HasName("driver_vehicle_assignment_pkey");
                e.HasIndex(x => new { x.VehicleId })
                    .HasDatabaseName("uq_dva_vehicle_open")
                    .HasFilter("\"end_at\" IS NULL")
                    .IsUnique();
                e.HasIndex(x => new { x.DriverAccountId, x.StartAt }).HasDatabaseName("ix_dva_driver_time");
                e.HasIndex(x => new { x.VehicleId, x.StartAt }).HasDatabaseName("ix_dva_vehicle_time");
                e.HasOne(x => x.Driver)
                    .WithMany()
                    .HasForeignKey(x => x.DriverAccountId)
                    .OnDelete(DeleteBehavior.Cascade);
                e.HasOne(x => x.Vehicle)
                    .WithMany()
                    .HasForeignKey(x => x.VehicleId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // ====== DrivingOrder ======
            modelBuilder.Entity<DrivingOrder>(e =>
            {
                e.ToTable("driving_order");
                e.HasKey(x => x.OrderId).HasName("driving_order_pkey");
                e.Property(x => x.Status).HasColumnType("public.order_status");
                e.Property(x => x.PaymentMethod).HasColumnType("public.payment_method");
                e.HasIndex(x => new { x.CompanyId, x.Status, x.CreatedAt }).HasDatabaseName("ix_order_company_status");
                e.HasIndex(x => new { x.DriverAccountId, x.PickupTime }).HasDatabaseName("ix_order_driver_time");
                e.HasIndex(x => new { x.FromProvinceId, x.ToProvinceId }).HasDatabaseName("ix_order_route");
                e.HasOne(x => x.Company).WithMany().HasForeignKey(x => x.CompanyId).OnDelete(DeleteBehavior.Cascade);
                e.HasOne(x => x.Customer).WithMany().HasForeignKey(x => x.CustomerAccountId).OnDelete(DeleteBehavior.SetNull);
                e.HasOne(x => x.Driver).WithMany().HasForeignKey(x => x.DriverAccountId).OnDelete(DeleteBehavior.SetNull);
                e.HasOne(x => x.Vehicle).WithMany().HasForeignKey(x => x.VehicleId).OnDelete(DeleteBehavior.SetNull);
                e.HasOne(x => x.Model).WithMany().HasForeignKey(x => x.ModelId).OnDelete(DeleteBehavior.Restrict);
                e.HasOne(x => x.PriceRef).WithMany().HasForeignKey(x => x.PriceRefId).OnDelete(DeleteBehavior.SetNull);
                e.HasOne(x => x.FromProvince).WithMany().HasForeignKey(x => x.FromProvinceId).OnDelete(DeleteBehavior.Restrict);
                e.HasOne(x => x.ToProvince).WithMany().HasForeignKey(x => x.ToProvinceId).OnDelete(DeleteBehavior.Restrict);
                e.Property(x => x.CreatedAt).HasDefaultValueSql("now()");
            });

            // ====== MembershipOrder ======
            modelBuilder.Entity<MembershipOrder>(e =>
            {
                e.ToTable("membership_order");
                e.HasKey(x => x.MembershipOrderId).HasName("membership_order_pkey");
                e.HasIndex(x => new { x.CompanyId, x.StartDate }).HasDatabaseName("ix_membership_company");
                e.HasOne(x => x.Company).WithMany().HasForeignKey(x => x.CompanyId).OnDelete(DeleteBehavior.Cascade);
                e.HasOne(x => x.Payer).WithMany().HasForeignKey(x => x.PayerAccountId).OnDelete(DeleteBehavior.Restrict);
            });

            // ====== ModelPriceProvince ======
            modelBuilder.Entity<ModelPriceProvince>(e =>
            {
                e.ToTable("model_price_province");
                e.HasKey(x => x.ModelPriceId).HasName("model_price_province_pkey");
                e.HasIndex(x => new { x.CompanyId, x.ProvinceId, x.ModelId, x.IsActive, x.DateStart })
                    .HasDatabaseName("ix_mpp_lookup");
                e.HasOne(x => x.Company).WithMany().HasForeignKey(x => x.CompanyId).OnDelete(DeleteBehavior.Cascade);
                e.HasOne(x => x.Province).WithMany().HasForeignKey(x => x.ProvinceId).OnDelete(DeleteBehavior.Restrict);
                e.HasOne(x => x.Model).WithMany().HasForeignKey(x => x.ModelId).OnDelete(DeleteBehavior.Cascade);
                e.HasOne(x => x.Parent).WithMany().HasForeignKey(x => x.ParentId).OnDelete(DeleteBehavior.SetNull);
            });

            // ====== Province ======
            modelBuilder.Entity<Province>(e =>
            {
                e.ToTable("province");
                e.HasKey(x => x.ProvinceId).HasName("province_pkey");
                e.HasIndex(x => x.Code).IsUnique().HasDatabaseName("province_code_key");
            });

            // ====== Ward ======
            modelBuilder.Entity<Ward>(e =>
            {
                e.ToTable("ward");
                e.HasKey(x => x.WardId).HasName("ward_pkey");
                e.HasIndex(x => new { x.ProvinceId, x.Name }).IsUnique().HasDatabaseName("ward_province_id_name_key");
                e.HasOne(x => x.Province).WithMany().HasForeignKey(x => x.ProvinceId).OnDelete(DeleteBehavior.Restrict);
            });

            // ====== Zone & ZoneWard ======
            modelBuilder.Entity<Zone>(e =>
            {
                e.ToTable("zone");
                e.HasKey(x => x.ZoneId).HasName("zone_pkey");
                e.HasIndex(x => new { x.CompanyId, x.ProvinceId, x.Code }).IsUnique().HasDatabaseName("zone_company_id_province_id_code_key");
                e.HasOne(x => x.Company).WithMany().HasForeignKey(x => x.CompanyId).OnDelete(DeleteBehavior.Cascade);
                e.HasOne(x => x.Province).WithMany().HasForeignKey(x => x.ProvinceId).OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<ZoneWard>(e =>
            {
                e.ToTable("zone_ward");
                e.HasKey(x => new { x.ZoneId, x.WardId }).HasName("zone_ward_pkey");
                e.HasOne(x => x.Zone).WithMany().HasForeignKey(x => x.ZoneId).OnDelete(DeleteBehavior.Cascade);
                e.HasOne(x => x.Ward).WithMany().HasForeignKey(x => x.WardId).OnDelete(DeleteBehavior.Cascade);
            });

            // ====== VehicleSegment / VehicleModel / Vehicle / VehicleInProvince / VehicleZonePreference ======
            modelBuilder.Entity<VehicleSegment>(e =>
            {
                e.ToTable("vehicle_segment");
                e.HasKey(x => x.SegmentId).HasName("vehicle_segment_pkey");
                e.HasIndex(x => new { x.CompanyId, x.Code }).IsUnique().HasDatabaseName("vehicle_segment_company_id_code_key");
                e.HasOne(x => x.Company).WithMany().HasForeignKey(x => x.CompanyId).OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<VehicleModel>(e =>
            {
                e.ToTable("vehicle_model");
                e.HasKey(x => x.ModelId).HasName("vehicle_model_pkey");
                e.HasIndex(x => new { x.CompanyId, x.Brand, x.ModelName })
                    .IsUnique().HasDatabaseName("vehicle_model_company_id_brand_model_name_key");
                e.Property(x => x.FuelType).HasColumnType("public.fuel_type_enum");
                e.Property(x => x.SeatCategory).HasColumnType("public.vehicle_category_enum");
                e.HasOne(x => x.Company).WithMany().HasForeignKey(x => x.CompanyId).OnDelete(DeleteBehavior.Cascade);
                e.HasOne(x => x.Segment).WithMany().HasForeignKey(x => x.SegmentId).OnDelete(DeleteBehavior.SetNull);
            });

            modelBuilder.Entity<Vehicle>(e =>
            {
                e.ToTable("vehicle");
                e.HasKey(x => x.VehicleId).HasName("vehicle_pkey");
                e.HasIndex(x => x.PlateNumber).IsUnique().HasDatabaseName("vehicle_plate_number_key");
                e.Property(x => x.Status).HasColumnType("public.active_flag");
                e.HasOne(x => x.Company).WithMany().HasForeignKey(x => x.CompanyId).OnDelete(DeleteBehavior.Cascade);
                e.HasOne(x => x.Model).WithMany().HasForeignKey(x => x.ModelId).OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<VehicleInProvince>(e =>
            {
                e.ToTable("vehicle_in_province");
                e.HasKey(x => new { x.VehicleId, x.ProvinceId }).HasName("vehicle_in_province_pkey");
                e.HasOne(x => x.Vehicle).WithMany().HasForeignKey(x => x.VehicleId).OnDelete(DeleteBehavior.Cascade);
                e.HasOne(x => x.Province).WithMany().HasForeignKey(x => x.ProvinceId).OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<VehicleZonePreference>(e =>
            {
                e.ToTable("vehicle_zone_preference");
                e.HasKey(x => new { x.VehicleId, x.ZoneId }).HasName("vehicle_zone_preference_pkey");
                e.HasOne(x => x.Vehicle).WithMany().HasForeignKey(x => x.VehicleId).OnDelete(DeleteBehavior.Cascade);
                e.HasOne(x => x.Zone).WithMany().HasForeignKey(x => x.ZoneId).OnDelete(DeleteBehavior.Cascade);
            });

            // ====== VIEW: vehicle_model_with_seats ======
            modelBuilder.Entity<VehicleModelWithSeats>(e =>
            {
                e.ToView("vehicle_model_with_seats"); // view có sẵn trong DB
                e.HasNoKey();                          // keyless
                // Nếu cần, map column types (không bắt buộc)
                e.Property(x => x.Seats);
            });

            base.OnModelCreating(modelBuilder);
        }
    }
}
