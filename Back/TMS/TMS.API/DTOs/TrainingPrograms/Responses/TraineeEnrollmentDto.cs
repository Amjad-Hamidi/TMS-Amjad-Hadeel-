using TMS.API.Models;

namespace TMS.API.DTOs.TrainingPrograms.Responses
{
    public class TraineeEnrollmentDto
    {
        public int TrainingProgramId { get; set; }
        public string Title { get; set; }
        public string ImagePath { get; set; }
        public string CategoryName { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string Location { get; set; }
        public string ContentUrl { get; set; }
        public string ClassroomUrl { get; set; }
        public string SupervisorName { get; set; }
        public string Description { get; set; }
        public int DurationInDays => (EndDate - StartDate).Days;
        public EnrollmentStatus Status { get; set; }
    }
}
