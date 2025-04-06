using System.ComponentModel.DataAnnotations;

namespace TMS.API.Models.AuthenticationModels
{
    public class RegisterRequestModel
    {
        [Required, MaxLength(15)]
        public string FirstName { get; set; }
        [Required, MaxLength(25)]
        public string LastName { get; set; }
        [Required]
        // +? : تعني ان الزائد اختيارية
        // \d{1,4} : يعني ان يكون الرقم مكون من 1-4 ارقام , هاي عبارة عن المقدمة
        // (\+?\d{1,4})? : تعني ان المقدمة اختيارية
        // \d{8,10} : يجب ان ياتي 8 او 9 او 10 خانات بالزبط 
        [RegularExpression(@"^(\+?\d{1,4})?\d{8,10}$", ErrorMessage = "Invalid phone number format. A valid phone number must be:\\n\" +\r\n                  \"- A local number with 8 to 10 digits (e.g., 059123456 or 0591234567).\\n\" +\r\n                  \"- Or an international number with a country code followed by 8 to 10 digits (e.g., +972591234567 or 00972591234567).\")]")] //[RegularExpression(@"^01[0-2]{1}[0-9]{8}$", ErrorMessage = "Invalid phone number.")] // 01X-XXXX-XXXX
        public string Phone { get; set; }
        [Required, EmailAddress]
        public string Email { get; set; }
        [Required, MinLength(6, ErrorMessage ="Password must be at least 6 characters.")]
        public string Password { get; set; }
        [Required, Compare("Password", ErrorMessage = "Passwords don't match.")]
        public string ConfirmPassword { get; set; }

        public string Role { get; set; }
    }
}
