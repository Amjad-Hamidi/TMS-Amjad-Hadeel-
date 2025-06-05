namespace TMS.API.DTOs.Users.Supervisors
{
    public class CompanySupervisorWithProgramsDto
    {
        public int SupervisorId { get; set; }
        public string FullName { get; set; } = null!;
        public string PhoneNumber { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string? ProfileImageUrl { get; set; }
        public string? CVPath { get; set; }
        public List<SimpleProgramDto> Programs { get; set; } = new();
    }

    public class SimpleProgramDto
    {
        public int ProgramId { get; set; }
        public string Title { get; set; } = null!;
        public string Description { get; set; } = null!;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }

}
