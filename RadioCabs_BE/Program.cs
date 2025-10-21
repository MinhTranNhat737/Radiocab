using Microsoft.EntityFrameworkCore;
using Npgsql;
using Radiocabs_BE.Data;  // nơi đặt DbContext sau scaffold
using RadioCabs_BE.Models; // nơi đặt các enum sau scaffold
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<RadiocabsDbContext>(opt =>
    opt.UseNpgsql(builder.Configuration.GetConnectionString("Postgres"), npg =>
    {
        npg.MapEnum<RoleType>("public.role_type");
        npg.MapEnum<ActiveFlag>("public.active_flag");
        npg.MapEnum<OrderStatus>("public.order_status");
        npg.MapEnum<PaymentMethod>("public.payment_method");
        npg.MapEnum<FuelType>("public.fuel_type_enum");
        npg.MapEnum<VehicleCategory>("public.vehicle_category_enum");
        npg.MapEnum<ShiftStatus>("public.shift_status");
    })
);

// AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true); // nếu cần tương thích timestamp cũ

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();
if (app.Environment.IsDevelopment()) { app.UseSwagger(); app.UseSwaggerUI(); }

app.MapGet("/ping-db", async (RadiocabsDbContext db) =>
{
    var ok = await db.Database.CanConnectAsync();
    var now = await db.Database
        .SqlQueryRaw<DateTimeOffset>("SELECT now() AS \"Value\"")
        .FirstAsync();
    return Results.Ok(new { database = ok ? "OK" : "FAIL", serverTime = now });
});


app.UseHttpsRedirection();
app.MapControllers();
app.Run();
