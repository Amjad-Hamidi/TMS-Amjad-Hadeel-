using TMS.API.Models;

namespace TMS.API.DTOs.Profiles
{
    public class GetEditProfileDto
    {
        public string FirstName { get; set; } = "";
        public string LastName { get; set; } = "";
        public string UserName { get; set; } = "";
        public string Email { get; set; } = "";
        public string? PhoneNumber { get; set; }
        public ApplicationUserGender Gender { get; set; }
        public DateTime BirthDate { get; set; }
        public string? ProfileImageUrl { get; set; }
        public string Role { get; set; } = "";
        public string? CVPath { get; set; } // only for (Supervisor & Trainee)
    }
}
