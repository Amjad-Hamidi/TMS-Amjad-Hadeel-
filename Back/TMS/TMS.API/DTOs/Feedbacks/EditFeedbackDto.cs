using System.ComponentModel.DataAnnotations;
using TMS.API.Models;

namespace TMS.API.DTOs.Feedbacks
{
    public class EditFeedbackDto
    {
        [MaxLength(400)]
        [MinLength(5, ErrorMessage = "Message must be at least 5 characters.")]
        public string? Message { get; set; }
        [Range(1, 5, ErrorMessage = "Rating must be between 1 and 5.")]
        public int? Rating { get; set; }
        public FeedbackType? Type { get; set; }
        public IFormFile? Attachment { get; set; }
    }
}
