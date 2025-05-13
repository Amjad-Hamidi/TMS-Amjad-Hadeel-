namespace TMS.API.DTOs.TrainingPrograms.Responses
{
    public class PendingProgramDto
    {
        public int TrainingProgramId { get; set; }
        public string Title { get; set; }
        public string CompanyName { get; set; }
        public string SupervisorName { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string Duration { get; set; }
        public string CategoryName { get; set; }
        public DateTime CreatedAt { get; set; }
        public string ImagePath { get; set; }
    }
}
