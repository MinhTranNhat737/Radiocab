using Microsoft.EntityFrameworkCore;
using company_service.Models;
using common.Models;

namespace company_service.Data
{
    public class company_serviceDbContext : DbContext
    {
        public company_serviceDbContext(DbContextOptions<company_serviceDbContext> options) : base(options) { }

        // DbSets
        public DbSet<Company> Companies => Set<Company>();
        public DbSet<MembershipOrder> MembershipOrders => Set<MembershipOrder>();
        public DbSet<Membership> Memberships => Set<Membership>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Schema
            modelBuilder.HasDefaultSchema("company");
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
            

            // Company configuration
            modelBuilder.Entity<Company>(entity =>
            {
                entity.ToTable("company");
                entity.HasKey(e => e.CompanyId).HasName("company_pkey");
                entity.Property(e => e.CompanyId).ValueGeneratedOnAdd();
                entity.HasIndex(e => e.Status).HasDatabaseName("ix_company_status");
                entity.Property(e => e.Status).HasColumnType("active_flag");
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("now()");
                
            });


            // Membership configuration
            modelBuilder.Entity<Membership>(entity =>
            {
                entity.ToTable("membership");
                entity.HasKey(e => e.MembershipId).HasName("membership_pkey");
                entity.Property(e => e.MembershipId).ValueGeneratedOnAdd();
                entity.HasIndex(e => new { e.CompanyId, e.Code }).HasDatabaseName("membership_company_id_code_key").IsUnique();
                entity.Property(e => e.UnitPrice).HasPrecision(12, 2);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("now()");
                
                entity.HasOne(e => e.Company)
                    .WithMany(c => c.Memberships)
                    .HasForeignKey(e => e.CompanyId)
                    .HasConstraintName("membership_company_id_fkey")
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // MembershipOrder configuration
            modelBuilder.Entity<MembershipOrder>(entity =>
            {
                entity.ToTable("membership_order");
                entity.HasKey(e => e.MembershipOrderId).HasName("membership_order_pkey");
                entity.Property(e => e.MembershipOrderId).ValueGeneratedOnAdd();
                entity.HasIndex(e => new { e.CompanyId, e.StartDate }).HasDatabaseName("ix_membership_company");
                entity.Property(e => e.PaymentMethod).HasColumnType("varchar(20)");
                entity.Property(e => e.PaymentCode).HasColumnType("varchar(50)");
                entity.Property(e => e.MembershipId).HasColumnName("membership_id");
                
                entity.HasOne(e => e.Company)
                    .WithMany(c => c.MembershipOrders)
                    .HasForeignKey(e => e.CompanyId)
                    .HasConstraintName("membership_order_company_id_fkey")
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(e => e.Membership)
                    .WithMany(m => m.MembershipOrders)
                    .HasForeignKey(e => e.MembershipId)
                    .HasConstraintName("membership_order_membership_id_fkey")
                    .OnDelete(DeleteBehavior.Restrict);
            });

        }
    }
}


