using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Scalar.AspNetCore;
using System.Text;
using TMS.API.Data;
using TMS.API.Helpers;
using TMS.API.Helpers.DBInitializer;
using TMS.API.Models;
using TMS.API.Services.Categories;
using TMS.API.Services.Programs;
using TMS.API.Services.Registers;
using TMS.API.Services.Tokens;
using TMS.API.Services.TrainingPrograms;
using TMS.API.Services.Users;

namespace TMS.API
{
    public class Program
    {

        /*
        public static async Task SeedRolesAsync(WebApplication app)
        {
            using var scope = app.Services.CreateScope();
            var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
            await DBInitializer.SeedRoles(roleManager);
        }
        */

        public static void Main(string[] args)
        {
            // Register the mappings for Mapster
            MapsterConfig.RegisterMappings();

            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddControllers();
            // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
            builder.Services.AddOpenApi();


            // وتشغيلها appsettings.json ربط الداتا بيس مع ال

            builder.Services.AddDbContext<TMSDbContext>(options =>
            options.UseSqlServer(builder.Configuration.GetConnectionString("DbConnection")));



            /* // لازم يكون هيك , عشان ما يتعارض مع الي تحتها
            // Identity تسجيل ال
            builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
                .AddEntityFrameworkStores<TMSDbContext>() // Identity كمخزن لل EF لاستخدام
                .AddDefaultTokenProviders(); // لدعم التحقق من الايميل واعادة تعيين الباسورد
            */

            builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
            {
                options.User.RequireUniqueEmail = true; // تأكيد انو الايميل فريد
                options.SignIn.RequireConfirmedAccount = true; // ConfirmEmail بدون Login تأكيد انو الايميل مفعل , ما بقدر يعمل
            })
            .AddEntityFrameworkStores<TMSDbContext>()
            .AddDefaultTokenProviders();


            // throw an exception at runtime اذا ما بحطها رح يضرب , JwtConfig اضافة ال
            builder.Services.AddScoped<JwtService>();

            // ICategoryService عملنا حقن فيه لل CategoriesController في ال DI لانا عملنا Service لل life cycle time يجب تحديد ال
            builder.Services.AddScoped<ICategoryService, CategoryService>();

            // ITrainingProgramService عملنا حقن فيه لل TrainingProgramsController في ال DI لانا عملنا Service لل life cycle time يجب تحديد ال
            builder.Services.AddScoped<ITrainingProgramService, TrainingProgramService>();

            // IUserRegistrationService عملنا حقن فيه لل ApplicationsController في ال DI لانا عملنا Service لل life cycle time يجب تحديد ال
            builder.Services.AddScoped<IUserRegistrationService, UserRegistrationService>();

            // Service فلازم نسجل ال run اول ما اعمل seeding data عمل 
            builder.Services.AddScoped<IDBInitializer, DBInitializer>();

            // IEmailSender عملنا حقن فيه لل UserRegestrationService في ال DI لانا عملنا Service لل life cycle time يجب تحديد ال
            builder.Services.AddTransient<IEmailSender, EmailSender>();

            // IUserService عملنا حقن فيه لل UsersController في ال DI لانا عملنا Service لل life cycle time يجب تحديد ال
            builder.Services.AddScoped<IUserService, UserService>();


            // ASP.NET Core. داخل  Dependency Injection container في الـ IHttpContextAccessor بتسجل خدمة 
            builder.Services.AddHttpContextAccessor(); // عشان موضوع توليد الملف وحفظه مع الامتداد كامل TrainingProgramService.cs مربوطة مع 

            /*
             // "$id" بانو برجعلها دايما endpoint باثر عاي
            // Include() بس استعمل UsersContoller الذي سيسمح بتسلسل الكائنات التي تحتوي على مراجع دائرية عن طريق استخدام المراجع بدلاً من التكرار في ReferenceHandler.Preserve لإضافة JsonSerializerOptions تعديل اعدادات ال 
            builder.Services.AddControllers()
                .AddJsonOptions(options =>
                {
                    options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.Preserve;
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


            /*
            // ✅ استدعاء `SeedRoles` هنا لأن الخدمات أصبحت جاهزة
            //SeedRolesAsync(app).GetAwaiter().GetResult(); // To avoid blocking the main thread, you can make this asynchronous properly
            */

            // (Admin لل seeding data هاد الكود رح يتشغل مرة وحدة فقط (موضوع ال
            // IDBInitializer وهو مربوط مع ال DB لل seeding بنعمل 
            var scope = app.Services.CreateScope();
            var service = scope.ServiceProvider.GetService<IDBInitializer>();
            service.initialize();

            app.Run();
        }
    }
}
