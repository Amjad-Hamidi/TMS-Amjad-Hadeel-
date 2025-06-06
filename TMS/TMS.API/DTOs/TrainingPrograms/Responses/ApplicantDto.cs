using TMS.API.Models;

namespace TMS.API.DTOs.TrainingPrograms.Responses
{
    public class ApplicantDto
    {
        public int TraineeId { get; set; }
        public string ProfileImageUrl { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string CVPath { get; set; }
        public EnrollmentStatus Status { get; set; }
        public DateTime EnrolledAt { get; set; }

        public int TrainingProgramId { get; set; }
        public string ProgramTitle { get; set; }
    }
}
