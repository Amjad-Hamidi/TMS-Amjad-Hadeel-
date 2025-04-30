using System.ComponentModel.DataAnnotations;

namespace TMS.API.Models.AuthenticationModels
{
    public class ChangeEmailModel
    {
        [Required(ErrorMessage = "Email is required.")]
        [EmailAddress(ErrorMessage = "Invalid email address.")]
        public string NewEmail { get; set; }
        [Required(ErrorMessage = "Confirm email is required.")]
        [EmailAddress(ErrorMessage = "Invalid email address.")]
        [Compare("NewEmail", ErrorMessage = "Emails don't match.")]
        public string ConfirmEmail { get; set; }
    }
}
