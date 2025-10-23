using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Npgsql;
using RadioCabs_BE.Data;
using RadioCabs_BE.Models;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

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

// ===== JWT Authentication =====
var jwtSecretKey = builder.Configuration["Jwt:SecretKey"] ?? "your-secret-key-here-must-be-at-least-32-characters-long";
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "RadioCabs";
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "RadioCabs";

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(jwtSecretKey)),
            ValidateIssuer = true,
            ValidIssuer = jwtIssuer,
            ValidateAudience = true,
            ValidAudience = jwtAudience,
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero
        };
    });

builder.Services.AddAuthorization();

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

app.UseAuthentication();
app.UseAuthorization();

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
