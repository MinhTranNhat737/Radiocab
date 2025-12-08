using Microsoft.EntityFrameworkCore;
using auth_service.Models;
using Npgsql;

namespace auth_service.Data
{
    public class auth_serviceDBContext : DbContext
    {
        public auth_serviceDBContext(DbContextOptions<auth_serviceDBContext> options) : base(options) { }

        // DbSets
        public DbSet<Account> Accounts => Set<Account>();
       
        public DbSet<AuthEmailCode> AuthEmailCodes => Set<AuthEmailCode>();
        public DbSet<AuthRefreshSession> AuthRefreshSessions => Set<AuthRefreshSession>();
        
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Schema
            modelBuilder.HasDefaultSchema("auth");
            modelBuilder.HasPostgresExtension("pgcrypto");

            // Account configuration
            modelBuilder.Entity<Account>(entity =>
            {
                entity.ToTable("account");
                entity.HasKey(e => e.AccountId).HasName("account_pkey");
                entity.Property(e => e.AccountId).ValueGeneratedOnAdd();
                entity.HasIndex(e => e.Username).IsUnique().HasDatabaseName("account_username_key");
                entity.HasIndex(e => new { e.CompanyId, e.Role }).HasDatabaseName("ix_account_company_role");
                entity.Property(e => e.Role).HasColumnType("role_type");
                entity.Property(e => e.Status).HasColumnType("active_flag");
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("now()");
                
                
            });

            // AuthEmailCode configuration
            modelBuilder.Entity<AuthEmailCode>(entity =>
            {
                entity.ToTable("auth_email_code");
                entity.HasKey(e => e.CodeId).HasName("auth_email_code_pkey");
                entity.Property(e => e.CodeId).ValueGeneratedOnAdd();
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
                entity.Property(e => e.SessionId).ValueGeneratedOnAdd();
                entity.HasIndex(e => e.Jti).IsUnique().HasDatabaseName("auth_refresh_session_jti_key");
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("now()");

                entity.HasOne(e => e.Account)
                    .WithMany()
                    .HasForeignKey(e => e.AccountId)
                    .HasConstraintName("auth_refresh_session_account_id_fkey")
                    .OnDelete(DeleteBehavior.Cascade);
            });

        }
    }
}


