using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TMS.API.DTOs.Feedbacks;
using TMS.API.Models;
using TMS.API.Services.Feedbacks;

namespace TMS.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FeedbacksController : ControllerBase
    {
        private readonly IFeedbackService feedbackService;

        public FeedbacksController(IFeedbackService feedbackService)
        {
            this.feedbackService = feedbackService;
        }

        [HttpGet("received")]
        [Authorize]
        public async Task<IActionResult> GetReceivedFeedbacks(
            [FromQuery] int? programId,
            [FromQuery] string? search,
            [FromQuery] int? rating,
            [FromQuery] FeedbackType? type,
            [FromQuery] int page = 1,
            [FromQuery] int limit = 10)
        {
            var result = await feedbackService.GetReceivedFeedbacksAsync(User, programId, search, rating, type, page, limit);

            return Ok(result);
        }



        [HttpGet("sent")]
        [Authorize]
        public async Task<IActionResult> GetSentFeedbacks(
            [FromQuery] int? programId,
            [FromQuery] string? search,
            [FromQuery] int? rating,
            [FromQuery] FeedbackType? type,
            [FromQuery] int page = 1,
            [FromQuery] int limit = 10)
        {
            var result = await feedbackService.GetSentFeedbacksAsync(User, programId, search, rating, type, page, limit);

            return Ok(result);
        }


        [HttpPost("send")]
        [Authorize]
        public async Task<IActionResult> SendFeedback([FromForm] SendFeedbackDto sendFeedbackDto)
        {
            try
            {
                var result = await feedbackService.Send(sendFeedbackDto, User, HttpContext);

                if (!result)
                    return BadRequest("Failed to send feedback.");

                return Ok("✅ Feedback sent successfully.");
            }
            catch (ArgumentException ex)
            {
                return BadRequest($"❌ {ex.Message}");
            }
            catch (UnauthorizedAccessException ex)
            {
                return BadRequest($"{ex.Message}");
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest($"⚠️ {ex.Message}");
            }
            catch (Exception)
            {
                return StatusCode(500, "⚠️ Unexpected error occurred.");
            }

        }


        [HttpPatch("receiver-user/{receiverId}/feedback/{feedbackId}")]
        [Authorize]
        public async Task<IActionResult> EditFeedback([FromRoute] int reciverId, [FromRoute] int feedbackId, [FromForm] EditFeedbackDto dto)
        {
            var updated = await feedbackService.EditAsync(reciverId, feedbackId, dto, User, HttpContext);
            if (!updated)
                return NotFound("Feedback not found or unauthorized.");
            return Ok("✅ Feedback updated.");
        }


        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteFeedback(int id, CancellationToken cancellationToken)
        {
            var result = await feedbackService.DeleteAsync(id, User, cancellationToken);
            return result ? NoContent() : NotFound("Feedback not found or unauthorized.");
        }

        [HttpDelete("delete-all")]
        [Authorize]
        public async Task<IActionResult> DeleteAllSentFeedbacks(CancellationToken cancellationToken)
        {
            var result = await feedbackService.DeleteAllSentAsync(User, cancellationToken);
            return result ? NoContent() : NotFound("No feedbacks found or unauthorized.");
        }


        [HttpGet("dashboard")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetDashboard()
        {
            var stats = await feedbackService.GetDashboardAsync();
            return Ok(stats);
        }


    }
}
