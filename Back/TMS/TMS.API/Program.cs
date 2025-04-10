
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Scalar.AspNetCore;
using System.Text;
using TMS.API.Data;
using TMS.API.Helpers;
using TMS.API.Models;
using TMS.API.Services.Categories;
using TMS.API.Services.Programs;
using TMS.API.Services.Registers;
using TMS.API.Services.Tokens;
using TMS.API.Services.TrainingPrograms;

namespace TMS.API
{
    public class Program
    {

        public static async Task SeedRolesAsync(WebApplication app)
        {
            using var scope = app.Services.CreateScope();
            var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
            await DataSeeder.SeedRoles(roleManager);
        }

        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddControllers();
            // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
            builder.Services.AddOpenApi();


            // وتشغيلها appsettings.json ربط الداتا بيس مع ال

            builder.Services.AddDbContext<TMSDbContext>(options =>
            options.UseSqlServer(builder.Configuration.GetConnectionString("DbConnection")));



            // Identity تسجيل ال
            builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
                .AddEntityFrameworkStores<TMSDbContext>() // Identity كمخزن لل EF لاستخدام
                .AddDefaultTokenProviders(); // لدعم التحقق من الايميل واعادة تعيين الباسورد

            // throw an exception at runtime اذا ما بحطها رح يضرب , JwtConfig اضافة ال
            builder.Services.AddScoped<JwtService>();

            // ICategoryService عملنا حقن فيه لل CategoriesController في ال DI لانا عملنا Service لل life cycle time يجب تحديد ال
            builder.Services.AddScoped<ICategoryService, CategoryService>();

            // ITrainingProgramService عملنا حقن فيه لل TrainingProgramsController في ال DI لانا عملنا Service لل life cycle time يجب تحديد ال
            builder.Services.AddScoped<ITrainingProgramService, TrainingProgramService>();

            // IUserRegistrationService عملنا حقن فيه لل ApplicationsController في ال DI لانا عملنا Service لل life cycle time يجب تحديد ال
            builder.Services.AddScoped<IUserRegistrationService, UserRegistrationService>(); 

            // ASP.NET Core. داخل  Dependency Injection container في الـ IHttpContextAccessor بتسجل خدمة 
            builder.Services.AddHttpContextAccessor(); // عشان موضوع توليد الملف وحفظه مع الامتداد كامل TrainingProgramService.cs مربوطة مع 


            /*
            builder.Services.AddSwaggerGen(options =>
            {
                var jwtSecurityScheme = new OpenApiSecurityScheme
                {
                    BearerFormat = "JWT",
                    Name = "Authorization",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.Http,
                    Scheme = JwtBearerDefaults.AuthenticationScheme,
                    Description = "Enter your JWT Acess Token",
                    Reference = new OpenApiReference
                    {
                        Id = JwtBearerDefaults.AuthenticationScheme,
                        Type = ReferenceType.SecurityScheme
                    }
                };
                options.AddSecurityDefinition(JwtBearerDefaults.AuthenticationScheme, jwtSecurityScheme);
                options.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    { jwtSecurityScheme, Array.Empty<string>() }
                });
            });
            */



            // AddAuthentication Service (انا ضفتها)
            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(options =>
            {
                options.RequireHttpsMetadata = false; // disable it (in development) and enable it in the production
                options.SaveToken = true;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidIssuer = builder.Configuration["JwtConfig:Issuer"], // read the Issuer from appsettings.json
                    ValidAudience = builder.Configuration["JwtConfig:Audience"], // read the Audience from appsettings.json
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JwtConfig:Key"]!)),
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true
                };
            });
            


            // AddAuthentication Service (انا ضفتها)
            /* // لازم بس وحدة تكون ممنوع في 2 منها
            builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.RequireHttpsMetadata = false;
                    options.SaveToken = true;
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JwtConfig:Key"]!)),
                        ValidateIssuer = false,
                        ValidateAudience = false
                    };
                });
            */



            var app = builder.Build();

            // CORS لامكانية الربط مع الفرونت
            app.UseCors(policy =>
                policy.AllowAnyOrigin()
                      .AllowAnyMethod()
                      .AllowAnyHeader());



            builder.Services.AddAuthorization(); // Autherization Service (انا ضفتها)
            //builder.Services.AddScoped<JwtService>(); // dependecy injection for Jwt


            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
                // تشتغل Scalar عشان 
                app.MapScalarApiReference();
            }

            app.UseHttpsRedirection();

            app.UseAuthentication(); // middleware (انا ضفتها)
            app.UseAuthorization(); // middleware (هي موجودة من حالها)

            // wwwroot/images السماح للمتصفح بتحميل الصور من ال 
            app.UseStaticFiles(); // wwwroot/images لتحميل الصور من ال 

            app.MapControllers();


            // ✅ استدعاء `SeedRoles` هنا لأن الخدمات أصبحت جاهزة
            SeedRolesAsync(app).GetAwaiter().GetResult(); // To avoid blocking the main thread, you can make this asynchronous properly

            app.Run();
        }
    }
}
