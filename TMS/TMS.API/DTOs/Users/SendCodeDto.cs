using System.ComponentModel.DataAnnotations;

namespace TMS.API.DTOs.Users
{
    public class SendCodeDto
    {
        public string Email { get; set; }
        public string Code { get; set; }
        public string Password { get; set; }
        [Compare(nameof(Password))]
        public string ConfirmPassword { get; set; }
    }
}
