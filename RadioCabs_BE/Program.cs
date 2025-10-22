using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Npgsql;
using RadioCabs_BE.Data;
using RadioCabs_BE.Models;
using System.Text.Json.Serialization;
// Repos & Services
using RadioCabs_BE.Repositories;                    // IGenericRepository<>, EfRepository<>, IUnitOfWork, EfUnitOfWork
using RadioCabs_BE.Repositories.Interfaces;         // IVehicleRepository, IDrivingOrderRepository, IModelPriceProvinceRepository
using RadioCabs_BE.Repositories.Implementations;    // VehicleRepository, DrivingOrderRepository, ModelPriceProvinceRepository
using RadioCabs_BE.Services;
using RadioCabs_BE.Services.Interfaces;
using Npgsql.NameTranslation;

var builder = WebApplication.CreateBuilder(args);

// ===== Connection string =====
var connStr = builder.Configuration.GetConnectionString("Postgres");

// ===== DbContext + Postgres enum mapping =====
builder.Services.AddDbContext<RadiocabsDbContext>(opt =>
    opt.UseNpgsql(connStr, npg =>
    {
        // Map PostgreSQL ENUM -> C# enum (đúng tên type trong DB)

        npg.MapEnum<RoleType>("role_type");
        npg.MapEnum<ActiveFlag>("active_flag");
        npg.MapEnum<OrderStatus>("order_status");
        npg.MapEnum<PaymentMethod>("payment_method");
        npg.MapEnum<FuelType>("fuel_type_enum");
        npg.MapEnum<VehicleCategory>("vehicle_category_enum");
        npg.MapEnum<ShiftStatus>("shift_status");
        npg.MapEnum<RevocationReason>("revocation_reason");
        npg.MapEnum<VerificationPurpose>("verification_purpose");
        
        opt.UseSnakeCaseNamingConvention();
    })
);

// AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true); // nếu cần

// ===== HealthChecks (tuỳ chọn) =====
// YÊU CẦU package: AspNetCore.HealthChecks.NpgSql
builder.Services.AddHealthChecks()
    .AddNpgSql(connStr!, name: "postgres");

// ===== CORS (dev) =====
builder.Services.AddCors(o =>
{
    o.AddDefaultPolicy(policy =>
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod());
});

// ===== DI: Repositories / UoW / Services =====

// Unit of Work
builder.Services.AddScoped<IUnitOfWork, EfUnitOfWork>();

// Generic repository cho mọi entity
builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));

// Repo chuyên biệt
builder.Services.AddScoped<IAccountRepository, AccountRepository>();
builder.Services.AddScoped<IVehicleRepository, VehicleRepository>();
builder.Services.AddScoped<IDrivingOrderRepository, DrivingOrderRepository>();
builder.Services.AddScoped<IModelPriceProvinceRepository, ModelPriceProvinceRepository>();
builder.Services.AddScoped<IDriverScheduleRepository, DriverScheduleRepository>();
builder.Services.AddScoped<IDriverScheduleTemplateRepository, DriverScheduleTemplateRepository>();
builder.Services.AddScoped<IMembershipRepository, MembershipRepository>();
builder.Services.AddScoped<IProvinceRepository, ProvinceRepository>();
builder.Services.AddScoped<IWardRepository, WardRepository>();
builder.Services.AddScoped<IZoneRepository, ZoneRepository>();
builder.Services.AddScoped<IZoneWardRepository, ZoneWardRepository>();

// Services
builder.Services.AddScoped<IAccountService, AccountService>();
builder.Services.AddScoped<ICompanyService, CompanyService>();
builder.Services.AddScoped<IDrivingOrderService, DrivingOrderService>();
builder.Services.AddScoped<IVehicleService, VehicleService>();
builder.Services.AddScoped<IVehicleModelService, VehicleModelService>();
builder.Services.AddScoped<IDriverScheduleService, DriverScheduleService>();
builder.Services.AddScoped<IMembershipService, MembershipService>();
builder.Services.AddScoped<IProvinceService, ProvinceService>();
builder.Services.AddScoped<IWardService, WardService>();
builder.Services.AddScoped<IZoneService, ZoneService>();

// ===== MVC / Swagger =====
builder.Services.AddControllers()
    .AddJsonOptions(o =>
    {
        o.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
        o.JsonSerializerOptions.PropertyNameCaseInsensitive = true; // cho chắc
    });
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// ===== Middleware pipeline =====
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();
app.UseHttpsRedirection();

// ===== Health check endpoint =====
app.MapHealthChecks("/healthz", new HealthCheckOptions());

// ===== Test DB endpoint =====
app.MapGet("/ping-db", async (RadiocabsDbContext db) =>
{
    var can = await db.Database.CanConnectAsync();
    var now = await db.Database
        .SqlQueryRaw<DateTimeOffset>("SELECT now() AS \"Value\"")
        .FirstAsync();

    return Results.Ok(new { database = can ? "OK" : "FAIL", serverTime = now });
});

app.MapControllers();
app.Run();
