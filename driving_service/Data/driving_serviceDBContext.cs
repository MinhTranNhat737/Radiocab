using Microsoft.EntityFrameworkCore;
using driving_service.Models;
using Npgsql;

namespace driving_service.Data
{
    public class driving_serviceDBContext : DbContext
    {
        public driving_serviceDBContext(DbContextOptions<driving_serviceDBContext> options) : base(options) { }

        // DbSets
        public DbSet<DriverSchedule> DriverSchedules => Set<DriverSchedule>();
       
        public DbSet<DriverScheduleTemplate> DriverScheduleTemplate => Set<DriverScheduleTemplate>();
        public DbSet<DriverVehicleAssignment> DriverVehicleAssignments => Set<DriverVehicleAssignment>();
        public DbSet<DrivingOrder> DrivingOrders => Set<DrivingOrder>();
        
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Schema
            modelBuilder.HasDefaultSchema("driving");
            modelBuilder.HasPostgresExtension("pgcrypto");

            // Account configuration
            modelBuilder.Entity<DriverVehicleAssignment>(entity =>
            {
                entity.ToTable("driver_vehicle_assignment");
                entity.HasKey(e => e.AssignmentId).HasName("driver_vehicle_assignment_pkey");
                entity.Property(e => e.AssignmentId).ValueGeneratedOnAdd();
                entity.HasIndex(e => new { e.DriverAccountId, e.StartAt }).HasDatabaseName("ix_dva_driver_time");
                entity.HasIndex(e => new { e.VehicleId, e.StartAt }).HasDatabaseName("ix_dva_vehicle_time");
                entity.HasIndex(e => e.VehicleId).IsUnique().HasDatabaseName("uq_dva_vehicle_open").HasFilter("\"end_at\" IS NULL");
            });

            // DriverScheduleTemplate configuration
            modelBuilder.Entity<DriverScheduleTemplate>(entity =>
            {
                entity.ToTable("driver_schedule_template");
                entity.HasKey(e => e.TemplateId).HasName("driver_schedule_template_pkey");
                entity.Property(e => e.TemplateId).ValueGeneratedOnAdd();
                entity.HasIndex(e => new { e.DriverAccountId, e.Weekday }).HasDatabaseName("ix_dst_driver_weekday").HasFilter("\"is_active\" = true");
                entity.Property(e => e.Weekday).HasColumnType("smallint");
                entity.Property(e => e.IsActive).HasDefaultValue(true);
            });

            // DriverSchedule configuration
            modelBuilder.Entity<DriverSchedule>(entity =>
            {
                entity.ToTable("driver_schedule");
                entity.HasKey(e => e.ScheduleId).HasName("driver_schedule_pkey");
                entity.Property(e => e.ScheduleId).ValueGeneratedOnAdd();
                entity.HasIndex(e => new { e.WorkDate, e.Status, e.DriverAccountId }).HasDatabaseName("ix_driver_schedule_lookup");
                entity.HasIndex(e => new { e.DriverAccountId, e.WorkDate, e.StartTime, e.EndTime }).IsUnique().HasDatabaseName("uq_driver_schedule_uni");
                entity.Property(e => e.Status).HasColumnType("shift_status");
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("now()");
            });

            // DrivingOrder configuration
            modelBuilder.Entity<DrivingOrder>(entity =>
            {
                entity.ToTable("driving_order");
                entity.HasKey(e => e.OrderId).HasName("driving_order_pkey");
                entity.Property(e => e.OrderId).ValueGeneratedOnAdd();
                entity.HasIndex(e => new { e.CompanyId, e.Status, e.CreatedAt }).HasDatabaseName("ix_order_company_status");
                entity.HasIndex(e => new { e.DriverAccountId, e.PickupTime }).HasDatabaseName("ix_order_driver_time");
                entity.HasIndex(e => new { e.FromProvinceId, e.ToProvinceId }).HasDatabaseName("ix_order_route");
                entity.Property(e => e.Status).HasColumnType("order_status");
                entity.Property(e => e.PaymentMethod).HasColumnType("payment_method");
                entity.Property(e => e.FareBreakdown).HasColumnType("jsonb");
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("now()");
               });

        }
    }
}


