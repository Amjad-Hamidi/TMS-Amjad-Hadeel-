using TMS.API.Models;

namespace TMS.API.DTOs.Feedbacks
{
    public class SentFeedbackDto
    {
        public int FeedbackId { get; set; }
        public int ToUserAccountId { get; set; }
        public string ToFullName { get; set; }
        public string ToImageUrl { get; set; } // صورة المستقبل
        public string Message { get; set; }
        public int? Rating { get; set; }
        public DateTime CreatedAt { get; set; }
        public string ProgramName { get; set; }
        public FeedbackType Type { get; set; }
        public string? AttachmentUrl { get; set; }
    }
}
