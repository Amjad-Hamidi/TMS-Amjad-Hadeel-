namespace TMS.API.DTOs.Users.Supervisors
{
    public class SupervisorDto
    {
        public int Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; }
        public string? ProfileImageUrl { get; set; }
        public string? CVPath { get; set; }
    }
}
