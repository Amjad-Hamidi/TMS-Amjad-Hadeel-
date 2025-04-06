using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using TMS.API.Models;

namespace TMS.API.Data
{
    public class TMSDbContext : IdentityDbContext<UserAccount>
    {
        public TMSDbContext(DbContextOptions options) : base(options)
        {
        }



        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<UserAccount>().ToTable("Users");
            modelBuilder.Entity<IdentityRole>().ToTable("Roles");
            modelBuilder.Entity<IdentityUserRole<string>>().ToTable("UserRoles");
            modelBuilder.Entity<IdentityUserClaim<string>>().ToTable("UserClaims");
            modelBuilder.Entity<IdentityUserLogin<string>>().ToTable("UserLogins");
            modelBuilder.Entity<IdentityRoleClaim<string>>().ToTable("RoleClaims");
            modelBuilder.Entity<IdentityUserToken<string>>().ToTable("UserTokens");

            /* // اذا بدي اضيف اشي جاهز يدويا
            var admin = new UserAccount
            {
                Id = "93020b0c-ecf9-4b2a-9ec5-2ef5675f2cf3",
                UserName = "Admin",
                NormalizedUserName = "ADMIN",
                Email = "admin@gmail.com",
                NormalizedEmail = "ADMIN@GMAIL.COM",
                EmailConfirmed = true,
                PasswordHash = "AQAAAAIAAYagAAAAECrNWPQ/3zoKfIf/ye21teHJj3fS1E8ByVvMuxpStSCUzB64aU+jAdUWFYJxbAP4vA==", // قيمة ثابتة
                SecurityStamp = "41ee04f4-e323-4a88-b0e5-58bd514940c7", // قيمة ثابتة
                ConcurrencyStamp = "ae885420-6c72-4c70-bc08-4a74231f4a4e", // قيمة ثابتة
                PhoneNumberConfirmed = false,
                TwoFactorEnabled = false,
                LockoutEnabled = false,
                AccessFailedCount = 0,
                FullName = "Administartor"
            };
           

            // لانو التشفير بكون منفصل , لازم يكون كلشي ثابت مش اشي متغير HasData() هاي ممنوعة , ممنوع تيجي مع 
            var passwordHasher = new PasswordHasher<UserAccount>();
            admin.PasswordHash = passwordHasher.HashPassword(admin, "Admin@123");

            modelBuilder.Entity<UserAccount>().HasData(admin);
             */

        }

        public DbSet<UserAccount> UserAccounts { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<TrainingProgram> TrainingPrograms { get; set; }


    }
}
