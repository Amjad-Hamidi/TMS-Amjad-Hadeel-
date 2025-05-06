namespace TMS.API.DTOs.TrainingPrograms.Responses
{
    public class RejectedAdminProgramDto
    {
        public int TrainingProgramId { get; set; }
        public string Title { get; set; }
        public string CompanyName { get; set; }

        public string RejectionReason { get; set; }
        public DateTime? RejectionDate { get; set; }
    }
}
