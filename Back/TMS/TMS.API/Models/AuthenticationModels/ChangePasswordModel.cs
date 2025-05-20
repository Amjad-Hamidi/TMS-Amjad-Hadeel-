using System.ComponentModel.DataAnnotations;

namespace TMS.API.Models.AuthenticationModels
{
    public class ChangePasswordModel
    {
        [Required]
        public string OldPassword { get; set; }
        [Required]
        [MinLength(6, ErrorMessage = "Password must be at least 6 characters.")]
        public string NewPassword { get; set; }
        [Required]
        [Compare("NewPassword", ErrorMessage = "Passwords don't match.")]
        public string ConfirmPassword { get; set; }
    }
}
