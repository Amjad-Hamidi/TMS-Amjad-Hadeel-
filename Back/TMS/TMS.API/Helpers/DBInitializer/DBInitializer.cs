using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using TMS.API.Data;
using TMS.API.Models;

namespace TMS.API.Helpers.DBInitializer
{
    public class DBInitializer : IDBInitializer
    {

        private readonly TMSDbContext context;
        private readonly RoleManager<IdentityRole> roleManager;
        private readonly UserManager<ApplicationUser> userManager;

        public DBInitializer(TMSDbContext context,
            RoleManager<IdentityRole> roleManager,
            UserManager<ApplicationUser> userManager)
        {
            this.context = context;
            this.roleManager = roleManager;
            this.userManager = userManager;
        }

        /*
        public static async Task SeedRoles(RoleManager<IdentityRole> roleManager)
        {
            string[] roleNames = { "Admin", "Trainee", "Supervisor", "Company" };

            foreach (var role in roleNames)
            { 
                if (!await roleManager.RoleExistsAsync(role)) // OR : if(roleManager.Roles.IsNullOrEmpty()) بس بشرط نكون معرفين فوق  private readonly RoleManager<IdentityRole> roleManager;
                {
                    await roleManager.CreateAsync(new IdentityRole(role));
                }
            }
        }
        */

        public async Task initialize()
        {
            try
            {
                if (context.Database.GetPendingMigrations().Any()) // Check if there are any pending migrations
                    context.Database.Migrate(); // Apply any pending migrations to the database (create the database if it doesn't exist) 
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }

            // لكن بجيب ايرور مش متعرف عليها roleManager.Roles.IsNullOrEmpty() يمكن استخدام
            if (!roleManager.Roles.Any()) // بالمرة ولا لا Roles بتفحص هل فيه 
            {
                await roleManager.CreateAsync(new(StaticData.Admin));
                await roleManager.CreateAsync(new(StaticData.Company));
                await roleManager.CreateAsync(new(StaticData.Supervisor));
                await roleManager.CreateAsync(new(StaticData.Trainee));

                var result = await userManager.CreateAsync(new()
                {
                    FirstName = "Admin",
                    LastName = "Admin",
                    UserName = "admin_admin",
                    Gender = ApplicationUserGender.Male,
                    BirthDate = new DateTime(2003, 10, 24),
                    Email = "admin@tms.com"
                }, "Admin@123");

                if (!result.Succeeded)
                {
                    foreach (var error in result.Errors)
                    {
                        Console.WriteLine($"Error: {error.Description}");
                    }
                    return; // أوقف التنفيذ إذا فشل الإنشاء
                }

                var user = await userManager.FindByEmailAsync("admin@tms.com");
                await userManager.AddToRoleAsync(user, StaticData.Admin);

                // Id من خلال ال ApplicationUser وربطه بال UserAccount انشاء
                if (!context.UserAccounts.Any(u => u.ApplicationUserId == user.Id)) // بس احتياط if الاصل بدون
                {
                    context.UserAccounts.Add(new UserAccount
                    {
                        ApplicationUserId = user.Id,
                    });

                    await context.SaveChangesAsync();
                }

            }

        }



    }
}
