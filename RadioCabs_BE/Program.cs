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
builder.Services.AddScoped<IVehicleRepository, VehicleRepository>();
builder.Services.AddScoped<IDrivingOrderRepository, DrivingOrderRepository>();
builder.Services.AddScoped<IModelPriceProvinceRepository, ModelPriceProvinceRepository>();
// Nếu có repo riêng cho DriverSchedule thì mở dòng sau:
// builder.Services.AddScoped<IDriverScheduleRepository, DriverScheduleRepository>();

// Services
builder.Services.AddScoped<ICompanyService, CompanyService>();
builder.Services.AddScoped<IDrivingOrderService, DrivingOrderService>();
builder.Services.AddScoped<IVehicleService, VehicleService>();
builder.Services.AddScoped<IDriverScheduleService, DriverScheduleService>();
builder.Services.AddScoped<IMembershipService, MembershipService>();

// ===== MVC / Swagger =====
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services
    .AddControllers()
    .AddJsonOptions(o =>
    {
        o.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
        o.JsonSerializerOptions.PropertyNameCaseInsensitive = true; // cho chắc
    });

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
