using TMS.API.Models;

namespace TMS.API.DTOs.TrainingPrograms.Responses
{
    public class TraineeEnrollmentDto
    {
        public int TrainingProgramId { get; set; }
        public string Title { get; set; }
        public string CategoryName { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public EnrollmentStatus Status { get; set; }
    }
}
