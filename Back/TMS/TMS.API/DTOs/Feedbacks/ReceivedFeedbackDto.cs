using TMS.API.Models;

namespace TMS.API.DTOs.Feedbacks
{
    public class ReceivedFeedbackDto
    {
        public string FromFullName { get; set; }
        public string FromImageUrl { get; set; } // صورة المرسل
        public string Message { get; set; }
        public int? Rating { get; set; }
        public DateTime CreatedAt { get; set; }
        public string ProgramName { get; set; }
        public FeedbackType Type { get; set; }
        public string? AttachmentUrl { get; set; }
    }
}
