using TMS.API.Models;

namespace TMS.API.DTOs.Profiles
{
    public class ProfileDto
    {
        public int Id { get; set; }
        public string FullName { get; set; } = "";
        public string Email { get; set; } = "";
        public string? PhoneNumber { get; set; }
        public ApplicationUserGender Gender { get; set; }
        public string? ProfileImageUrl { get; set; }
        public string Role { get; set; } = "";
        public string? CVPath { get; set; } // only for (Supervisor & Trainee)
    }
}
