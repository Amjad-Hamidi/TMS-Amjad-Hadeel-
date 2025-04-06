namespace TMS.API.DTOs.TrainingPrograms.Requests
{
    public class TrainingProgramRequest
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public TimeSpan Duration { get; set; } // مدة التدريب
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string Location { get; set; }
        public bool Status { get; set; } // true = Active, false = Inactive
        public string ImagePath { get; set; }
        public int SeatsAvailable { get; set; }
        public decimal Rating { get; set; }
        public int CategoryId { get; set; } // لإرسال التصنيف المرتبط
    }
}
