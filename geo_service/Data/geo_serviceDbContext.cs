using Microsoft.EntityFrameworkCore;
using geo_service.Models;
using common.Models;

namespace geo_service.Data
{
    public class geo_serviceDbContext : DbContext
    {
        public geo_serviceDbContext(DbContextOptions<geo_serviceDbContext> options) : base(options) { }

        // DbSets

        public DbSet<Province> Provinces => Set<Province>();
        public DbSet<Ward> Wards => Set<Ward>();
        public DbSet<Zone> Zones => Set<Zone>();
        public DbSet<ZoneWard> ZoneWards => Set<ZoneWard>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Schema
            modelBuilder.HasDefaultSchema("geo");
            modelBuilder.HasPostgresExtension("pgcrypto");


            // Province configuration
            modelBuilder.Entity<Province>(entity =>
            {
                entity.ToTable("province");
                entity.HasKey(e => e.ProvinceId).HasName("province_pkey");
                entity.Property(e => e.ProvinceId).ValueGeneratedOnAdd();
                entity.HasIndex(e => e.Code).IsUnique().HasDatabaseName("province_code_key");
            });

            // Ward configuration
            modelBuilder.Entity<Ward>(entity =>
            {
                entity.ToTable("ward");
                entity.HasKey(e => e.WardId).HasName("ward_pkey");
                entity.Property(e => e.WardId).ValueGeneratedOnAdd();
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
                entity.Property(e => e.ZoneId).ValueGeneratedOnAdd();
                entity.HasIndex(e => new { e.CompanyId, e.ProvinceId, e.Code }).IsUnique().HasDatabaseName("zone_company_id_province_id_code_key");
                entity.Property(e => e.IsActive).HasDefaultValue(true);

                entity.HasOne(e => e.Province);
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
            });
        }
    }
}


