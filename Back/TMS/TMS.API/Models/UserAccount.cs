using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TMS.API.Models
{
    public enum UserRole // اسهل وافضل للقراءة string الى OnModelCreating بتبلش من 0 لاخر عنصر, لكن انا رح احولها في int على شكل DB السلوك الافتراضي الها تتخزن في C# في 
    {
        Admin, // = 0 (in Tooltip in C#) but in DB it will be "Admin" because i convert the default value (int) of enum to string
        Company, // = 1 in Tooltip in C#, "Company" in DB
        Supervisor, // = 2 in Tooltip in C#, "Supervisor" in DB
        Trainee // = 3 in Tooltip in C#, "Trainee" in DB
    }

    [Table("Users")] // تأكد أن اسم الجدول مطابق لما في `TMSDbContext`
    public class UserAccount : IdentityUser
    {
        // IdentityUser بحط خصائص اضافية غير الي موجودة في
        [Required,MaxLength(15)]
        public string FirstName { get; set; }
        [Required, MaxLength(25)]
        public string LastName { get; set; }
        public string? ProfileImageUrl { get; set; }

        public UserRole Role { get; set; } // Add, Update in TrainingProgramsController وبتفيدني في IdentityUser مش موجودة في 


        // RefreshToken, RefreshTokenExpiryTime: انا بضيفهم يدويا IdentityUser مش موجودات افتراضيا بال
        public string? RefreshToken { get; set; } // جديد دون الحاجة لتسجيل الدخول من جديد Access Token للحصول على 
        public DateTime? RefreshTokenExpiryTime { get; set; } // لتحديد وقت انتهاء صلاحية التوكن


        // every Company can create many Training Programs
        public ICollection<TrainingProgram> CreatedPrograms { get; set; } = new List<TrainingProgram>();

        // every Supervisor can supervise many Training Programs
        public ICollection<TrainingProgram> SupervisedPrograms { get; set; } = new List<TrainingProgram>();

        // every Trainee can enroll in many Training Programs
        public ICollection<ProgramTrainee> EnrolledPrograms { get; set; } = new List<ProgramTrainee>();


        // اله هي الايميل value فقط , الي ال UserName هو ان ترجع IdentityUser في ToString السلوك الافتراضي ل
        public override string ToString()
        {
            return $"ID: {Id}, Email: {Email}, FirstName: {FirstName}, LastName: {LastName}, Phone: {PhoneNumber}";
        }
    }
}
