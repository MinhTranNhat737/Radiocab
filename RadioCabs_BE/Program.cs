using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Npgsql;
using RadioCabs_BE.Data;
using RadioCabs_BE.Models;
using System.Text.Json.Serialization;

// Repositories & Services
using RadioCabs_BE.Repositories;
using RadioCabs_BE.Services;
using RadioCabs_BE.Services.Interfaces;

var builder = WebApplication.CreateBuilder(args);

// ===== Connection string =====
var connStr = builder.Configuration.GetConnectionString("Postgres");

// ===== DbContext với enum mapping =====
builder.Services.AddDbContext<RadiocabsDbContext>(opt =>
{
    opt.UseNpgsql(connStr, npgsqlOpt =>
    {
        npgsqlOpt.MapEnum<RoleType>("role_type");
        npgsqlOpt.MapEnum<ActiveFlag>("active_flag");
        npgsqlOpt.MapEnum<PaymentMethod>("payment_method");
        npgsqlOpt.MapEnum<OrderStatus>("order_status");
        npgsqlOpt.MapEnum<FuelType>("fuel_type_enum");
        npgsqlOpt.MapEnum<VehicleCategory>("vehicle_category_enum");
    });
    opt.UseSnakeCaseNamingConvention();
});

// ===== HealthChecks =====
builder.Services.AddHealthChecks().AddNpgSql(connStr!, name: "postgres");

// ===== CORS =====
builder.Services.AddCors(o =>
{
    o.AddDefaultPolicy(p => p.AllowAnyOrigin()
                             .AllowAnyHeader()
                             .AllowAnyMethod());
});

// ===== DI =====
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));

builder.Services.AddScoped<IAccountService, AccountService>();
builder.Services.AddScoped<ICompanyService, CompanyService>();
builder.Services.AddScoped<IVehicleService, VehicleService>();
builder.Services.AddScoped<IDrivingOrderService, DrivingOrderService>();

// ===== MVC / Swagger =====
builder.Services.AddControllers()
    .AddJsonOptions(o =>
    {
        o.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
        o.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
    });
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();
app.UseHttpsRedirection();

app.MapHealthChecks("/healthz", new HealthCheckOptions());

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
