using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using driving_service.Data;
using common.Models;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using common.Repositories;
using driving_service.Services;
using driving_service.Services.Interfaces;

var builder = WebApplication.CreateBuilder(args);

// ===== Connection string =====
var connStr = builder.Configuration.GetConnectionString("Postgres")
    ?? throw new Exception("Postgres connection string missing");

// ===== DbContext với enum mapping =====
builder.Services.AddDbContext<driving_serviceDBContext>(opt =>
{
    opt.UseNpgsql(connStr, npgsqlOpt =>
    {
        npgsqlOpt.MapEnum<RoleType>("role_type");
        npgsqlOpt.MapEnum<ActiveFlag>("active_flag");
        npgsqlOpt.MapEnum<PaymentMethod>("payment_method");
        npgsqlOpt.MapEnum<OrderStatus>("order_status");
        npgsqlOpt.MapEnum<FuelType>("fuel_type_enum");
        npgsqlOpt.MapEnum<VehicleCategory>("vehicle_category_enum");
        npgsqlOpt.MapEnum<ShiftStatus>("shift_status");
    });
    opt.UseSnakeCaseNamingConvention();
});
builder.Services.AddScoped<DbContext>(sp =>
    sp.GetRequiredService<driving_serviceDBContext>());

// ===== HealthChecks =====
builder.Services.AddHealthChecks().AddNpgSql(connStr, name: "postgres");

// ===== CORS =====
// Nếu service nội bộ: chỉ cho phép origin của gateway
var gatewayOrigin = builder.Configuration["Gateway:Origin"] ?? "https://localhost:5000";
builder.Services.AddCors(o =>
{
    o.AddDefaultPolicy(p => p
        .WithOrigins(gatewayOrigin)
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials());
});

// ===== JWT Authentication =====
var jwtSecretKey = builder.Configuration["Jwt:SecretKey"] ?? throw new Exception("Jwt secret missing");
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "RadioCabs";
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "driving_service";

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = true; // production true
    options.SaveToken = false;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecretKey)),
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

// Dev-only swagger
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Correct middleware order
app.UseHttpsRedirection();

app.UseRouting();

// CORS must be after Routing and before Auth
app.UseCors();

app.UseAuthentication();
app.UseAuthorization();

// Health + DB ping
app.MapHealthChecks("/healthz", new HealthCheckOptions());

app.MapGet("/ping-db", async (driving_serviceDBContext db) =>
{
    var can = await db.Database.CanConnectAsync();
    var now = await db.Database
        .SqlQueryRaw<DateTimeOffset>("SELECT now() AS \"Value\"")
        .FirstAsync();

    return Results.Ok(new { database = can ? "OK" : "FAIL", serverTime = now });
});

app.MapControllers();
app.Run();
