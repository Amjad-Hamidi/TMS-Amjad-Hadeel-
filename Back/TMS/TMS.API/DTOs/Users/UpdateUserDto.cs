using System.ComponentModel.DataAnnotations;
using TMS.API.Models;
using TMS.API.Validations;

namespace TMS.API.DTOs.Users
{
    public class UpdateUserDto
    {
        [MaxLength(15)]
        public string? FirstName { get; set; } // ? جعل ادخالهن اختياري

        [MaxLength(25)]
        public string? LastName { get; set; }

        public string? UserName { get; set; }

        [RegularExpression(@"^(\+?\d{1,4})?\d{8,10}$", ErrorMessage = "Invalid phone number format. A valid phone number must be:\\n\" +\r\n                  \"- A local number with 8 to 10 digits (e.g., 059123456 or 0591234567).\\n\" +\r\n                  \"- Or an international number with a country code followed by 8 to 10 digits (e.g., +972591234567 or 00972591234567).")]
        public string? Phone { get; set; }

        public ApplicationUserGender? Gender { get; set; }

        [OverYears(16)]
        public DateTime? BirthDate { get; set; }

        public IFormFile? ProfileImageFile { get; set; }
    }
}
