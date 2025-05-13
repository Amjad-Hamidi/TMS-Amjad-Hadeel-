namespace TMS.API.DTOs.TrainingPrograms.Requests
{
    public class EnrollmentRequestDto
    {
        public int TrainingProgramId { get; set; }
        public IFormFile CV { get; set; } // CV file
    }
}
