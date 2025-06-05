using TMS.API.Models;

namespace TMS.API.DTOs.TrainingPrograms.Responses
{
    public class ApprovedAdminProgramDto
    {
        public int TrainingProgramId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public double DurationInDays { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string Location { get; set; }
        public bool Status { get; set; }
        public string ImagePath { get; set; }
        public int SeatsAvailable { get; set; }
        public decimal Rating { get; set; }
        public string ContentUrl { get; set; }
        public string ClassroomUrl { get; set; }
        public DateTime CreatedAt { get; set; }

        public int CategoryId { get; set; }
        public string CategoryName { get; set; }

        public int SupervisorId { get; set; }
        public string SupervisorName { get; set; }

        public int CompanyId { get; set; }
        public string CompanyName { get; set; }

        public TrainingProgramStatus ApprovalStatus { get; set; }
    }
}
