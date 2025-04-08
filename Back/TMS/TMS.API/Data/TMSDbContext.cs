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
            // Fluent API
            modelBuilder.Entity<ProgramTrainee>()
                .HasKey(tp => new { tp.TraineeId, tp.TrainingProgramId }); // Composite Key

            // Many-to-Many (Trainee <-> TrainingProgram) => ProgramTrainee لذلك بنعمل جدول وسيط اسمه 
            // 1-to-Many (Trainee <-> ProgramTrainee)
            modelBuilder.Entity<ProgramTrainee>()
                .HasOne(tp => tp.Trainee)
                .WithMany(u => u.EnrolledPrograms)
                .HasForeignKey(tp => tp.TraineeId)
                .OnDelete(DeleteBehavior.Cascade);
            // 1-to-Many (TrainingProgram <-> ProgramTrainee)
            modelBuilder.Entity<ProgramTrainee>()
                .HasOne(tp => tp.TrainingProgram)
                .WithMany(p => p.ProgramTrainees)
                .HasForeignKey(tp => tp.TrainingProgramId)
                .OnDelete(DeleteBehavior.Cascade);
            // 1-to-Many (Company <-> TrainingProgram)
            modelBuilder.Entity<TrainingProgram>()
                .HasOne(p => p.Company)
                .WithMany(u => u.CreatedPrograms)
                .HasForeignKey(p => p.CompanyId)
                .OnDelete(DeleteBehavior.Restrict); // Restrict: إذا تم حذف الشركة، لا يمكن حذف البرامج التدريبية المرتبطة بها، يجب حذفها أولاً
            // 1-to-Many (Supervisor <-> TrainingProgram)
            modelBuilder.Entity<TrainingProgram>()
                .HasOne(p => p.Supervisor)
                .WithMany(u => u.SupervisedPrograms)
                .HasForeignKey(p => p.SupervisorId)
                .OnDelete(DeleteBehavior.SetNull); // SetNull: في البرامج التدريبية المرتبطة به SupervisorId = null إذا تم حذف المشرف، يتم تعيين قيمة       
            // SupervisorId in TrainingProgram can be null
            modelBuilder.Entity<TrainingProgram>()
                .Property(p => p.SupervisorId)
                .IsRequired(false);


            // DB في Category.Name منع تكرار ال   
            modelBuilder.Entity<Category>() // وبحط شرط CategoriesController هاي مش كافية بروح عال backend لو بدي اشتغل على مستوى
                .HasIndex(c => c.Name)
                .IsUnique(); // بمنعني SQL DB فقط, لو اجيت اضيف يدوي في DB بشتغل على نطاق ال 


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

        public DbSet<UserAccount> UserAccounts { get; set; } // Users in DB
        public DbSet<Category> Categories { get; set; }
        public DbSet<TrainingProgram> TrainingPrograms { get; set; }


        public DbSet<ProgramTrainee> ProgramTrainees { get; set; }


    }
}
