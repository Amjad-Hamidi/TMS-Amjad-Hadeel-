using System.ComponentModel.DataAnnotations;

namespace TMS.API.DTOs.TrainingPrograms.Requests
{
    public class AddTrainingProgramDto
    {
        [MinLength(2, ErrorMessage = "Training Program name must be at least 2 characters long.")]
        [MaxLength(30, ErrorMessage = "Training Program name must not exceed 30 characters.")]
        public string Title { get; set; }
        [MaxLength(200, ErrorMessage = "Description must not exceed 200 characters.")]
        public string Description { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        [MinLength(3, ErrorMessage = "Location must be at least 5 characters long.")]
        [MaxLength(50, ErrorMessage = "Location must not exceed 50 characters.")]
        public string Location { get; set; }
        public bool Status { get; set; } // true = Active, false = Inactive
        public IFormFile ImageFile { get; set; }
        [Range(0,50)]
        public int SeatsAvailable { get; set; }
        [Range(0,5)]
        public decimal Rating { get; set; }

        [Url(ErrorMessage = "Invalid content URL.")]
        public string ContentUrl { get; set; }

        [Url(ErrorMessage = "Invalid classroom URL.")]
        public string ClassroomUrl { get; set; }
        public int CategoryId { get; set; } // لإرسال التصنيف المرتبط
        public int? CompanyId { get; set; }
        public int? SupervisorId { get; set; }

    }
}
