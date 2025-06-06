using Microsoft.AspNetCore.Identity;

namespace TMS.API.Models
{
    public enum ApplicationUserGender
    {
        Male, Female
    }

    public class ApplicationUser : IdentityUser
    {
        public UserAccount UserAccount { get; set; }


        // IdentityUser بحط خصائص اضافية غير الي موجودة في
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public ApplicationUserGender Gender { get; set; }
        public DateTime BirthDate { get; set; } 
        public string? ProfileImageUrl { get; set; }

        // RefreshToken, RefreshTokenExpiryTime: انا بضيفهم يدويا IdentityUser مش موجودات افتراضيا بال
        public string? RefreshToken { get; set; } // جديد دون الحاجة لتسجيل الدخول من جديد Access Token للحصول على 
        public DateTime? RefreshTokenExpiryTime { get; set; } // لتحديد وقت انتهاء صلاحية التوكن
    }
}
