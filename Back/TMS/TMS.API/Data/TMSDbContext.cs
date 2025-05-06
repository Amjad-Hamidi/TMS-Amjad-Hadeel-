using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using TMS.API.Models;

namespace TMS.API.Data
{
    public class TMSDbContext : IdentityDbContext<ApplicationUser>
    {
        public TMSDbContext(DbContextOptions options) : base(options)
        {
        }



        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<TrainingProgram>() // double مش decimal عشنه Rating عشان بس اخلص من التحذير لل
                .Property(p => p.Rating)
                .HasPrecision(3, 2);



            // 1-1 (UserAccount <-> ApplicationUser)
            modelBuilder.Entity<UserAccount>()
                .HasOne(u => u.ApplicationUser)
                .WithOne(a => a.UserAccount)
                .HasForeignKey<UserAccount>(u => u.ApplicationUserId)
                .OnDelete(DeleteBehavior.Cascade); // Cascade: إذا تم حذف ال UserAccount, يتم حذف ال ApplicationUser المرتبط به



            modelBuilder.Entity<UserAccount>()
                .Property(u => u.Role)
                .HasConversion<string>(); // Convert enum to string in DB
           


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
            // SetNull means SupervisorId must be nullable in TrainingProgram
            modelBuilder.Entity<TrainingProgram>()
                .Property(p => p.SupervisorId)
                .IsRequired(false);

            // DB في Category.Name منع تكرار ال   
            modelBuilder.Entity<Category>() // وبحط شرط CategoriesController هاي مش كافية بروح عال backend لو بدي اشتغل على مستوى
                .HasIndex(c => c.Name)
                .IsUnique(); // بمنعني SQL DB فقط, لو اجيت اضيف يدوي في DB بشتغل على نطاق ال 


            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<ApplicationUser>().ToTable("ApplicationUsers");
            modelBuilder.Entity<IdentityRole>().ToTable("Roles");
            modelBuilder.Entity<IdentityUserRole<string>>().ToTable("ApplicationUsersRoles");
            modelBuilder.Entity<IdentityUserClaim<string>>().ToTable("ApplicationUsersClaims");
            modelBuilder.Entity<IdentityUserLogin<string>>().ToTable("ApplicationUsersLogins");
            modelBuilder.Entity<IdentityRoleClaim<string>>().ToTable("RoleClaims");
            modelBuilder.Entity<IdentityUserToken<string>>().ToTable("ApplicationUsersTokens");
        }

        public DbSet<ApplicationUser> ApplicationUsers { get; set; } // Users in DB
        public DbSet<UserAccount> UserAccounts { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<TrainingProgram> TrainingPrograms { get; set; }


        public DbSet<ProgramTrainee> ProgramTrainees { get; set; }


    }
}
