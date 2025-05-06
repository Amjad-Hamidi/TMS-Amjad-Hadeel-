namespace TMS.API.DTOs.TrainingPrograms.Responses
{
    public class RejectedCompanyProgramDto
    {
        public int TrainingProgramId { get; set; }
        public string Title { get; set; }
        public string SupervisorName { get; set; }

        public string RejectionReason { get; set; }
        public DateTime? RejectionDate { get; set; }
    }
}
