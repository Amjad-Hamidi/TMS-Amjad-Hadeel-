using TMS.API.Models;

namespace TMS.API.DTOs.TrainingPrograms.Responses
{
    public class SupervisedProgramDto
    {
        public int TrainingProgramId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string DurationInDays { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string Location { get; set; }
        public bool Status { get; set; }
        public string ImagePath { get; set; }
        public int SeatsAvailable { get; set; }
        public decimal Rating { get; set; }

        public DateTime CreatedAt { get; set; }

        // المعلومات المرتبطة بالعلاقات (بس بشكل مختصر)
        public int CategoryId { get; set; }
        public string CategoryName { get; set; } // من الكيان Category

        public int CompanyId { get; set; }
        public string CompanyName { get; set; } // من الكيان UserAccount الخاص بالشركة

        public TrainingProgramStatus ApprovalStatus { get; set; }
    }
}
