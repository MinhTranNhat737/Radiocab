using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System.Text;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Ocelot.DependencyInjection;
using Ocelot.Middleware;

var builder = WebApplication.CreateBuilder(args);

// load ocelot.json
builder.Configuration.AddJsonFile("ocelot.json", optional: false, reloadOnChange: true);

// CORS - production: replace AllowAnyOrigin with allowed origins list
builder.Services.AddCors(o =>
{
    o.AddDefaultPolicy(p => p
        .WithOrigins("http://localhost:3000") // <-- production
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials());
});

// JWT - set default scheme clearly
var jwtSecretKey = builder.Configuration["Jwt:SecretKey"] ?? throw new Exception("Jwt secret missing");
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "RadioCabs";
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "RadioCabs";

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = true; // production
    options.SaveToken = true;
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
builder.Services.AddOcelot(builder.Configuration);

// Health checks
builder.Services.AddHealthChecks();

// HttpContextAccessor (useful if you implement DelegatingHandler)
builder.Services.AddHttpContextAccessor();

builder.Services.AddControllers()
    .AddJsonOptions(o =>
    {
        o.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
        o.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Logging / telemetry (example: add OpenTelemetry here in real app)

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// ... builder config ở trên giữ nguyên


// IMPORTANT: đúng thứ tự middleware
app.UseRouting();

// CORS phải được gọi **sau** UseRouting và trước Auth/Authorization
app.UseCors();

// Authn / Authz
app.UseAuthentication();
app.UseAuthorization();

// Intercept preflight OPTIONS *sau* UseCors để đảm bảo header CORS được thêm
app.Use(async (context, next) =>
{
    if (HttpMethods.IsOptions(context.Request.Method))
    {
        // Nếu UseCors đã được chạy đúng, thường không cần thêm thủ công.
        // Nhưng để chắc chắn (và nếu Ocelot vẫn forward) ta trả preflight ở gateway:
        context.Response.StatusCode = StatusCodes.Status204NoContent;

        // Thêm các header CORS cơ bản (an toàn cho dev). Trong prod bạn sẽ dùng policy chi tiết.
        context.Response.Headers["Access-Control-Allow-Origin"] = context.Request.Headers["Origin"].ToString() ?? "*";
        context.Response.Headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS";
        context.Response.Headers["Access-Control-Allow-Headers"] = "Authorization, Content-Type, Accept";
        context.Response.Headers["Access-Control-Allow-Credentials"] = "true";

        await context.Response.CompleteAsync();
        return;
    }

    await next();
});

// Health + Controllers
app.MapHealthChecks("/healthz");
app.MapControllers();

// Ocelot (terminal middleware)
await app.UseOcelot();
app.Run();
