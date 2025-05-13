namespace TMS.API.Models
{
    public enum FeedbackType
    {
        General,
        Suggestion,
        Complaint,
        Praise
    }
    public class Feedback
    {
        public int Id { get; set; }

        public int FromUserAccountId { get; set; }
        public UserAccount FromUserAccount { get; set; }

        public int ToUserAccountId { get; set; }
        public UserAccount ToUserAccount { get; set; }

        public int TrainingProgramId { get; set; }
        public TrainingProgram TrainingProgram { get; set; }

        public string Message { get; set; }
        public int? Rating { get; set; } // optional


        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public FeedbackType Type { get; set; } // نوع الفيدباك
        public string? AttachmentUrl { get; set; } // رابط الملف المرفق
    }
}
