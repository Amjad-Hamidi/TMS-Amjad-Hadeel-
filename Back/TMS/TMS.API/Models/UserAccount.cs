using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TMS.API.Models
{
    [Table("Users")] // تأكد أن اسم الجدول مطابق لما في `TMSDbContext`
    public class UserAccount : IdentityUser
    {
        // IdentityUser بحط خصائص اضافية غير الي موجودة في
        [Required,MaxLength(15)]
        public string FirstName { get; set; }
        [Required, MaxLength(25)]
        public string LastName { get; set; }
        public string? ProfileImageUrl { get; set; }


        // RefreshToken, RefreshTokenExpiryTime: انا بضيفهم يدويا IdentityUser مش موجودات افتراضيا بال
        public string? RefreshToken { get; set; } // جديد دون الحاجة لتسجيل الدخول من جديد Access Token للحصول على 
        public DateTime? RefreshTokenExpiryTime { get; set; } // لتحديد وقت انتهاء صلاحية التوكن

        // اله هي الايميل value فقط , الي ال UserName هو ان ترجع IdentityUser في ToString السلوك الافتراضي ل
        public override string ToString()
        {
            return $"ID: {Id}, Email: {Email}, FirstName: {FirstName}, LastName: {LastName}, Phone: {PhoneNumber}";
        }
    }
}
