using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TMS.API.DTOs.Feedbacks;
using TMS.API.DTOs.Pages;
using TMS.API.Models;

namespace TMS.API.Services.Feedbacks
{
    public interface IFeedbackService
    {
        Task<PagedResult<ReceivedFeedbackDto>> GetReceivedFeedbacksAsync(
            ClaimsPrincipal user, int? programId, string? search, int? rating, FeedbackType? type, int page, int limit);

        Task<PagedResult<SentFeedbackDto>> GetSentFeedbacksAsync(
            ClaimsPrincipal user, int? programId, string? search, int? rating, FeedbackType? type, int page, int limit);

        Task<bool> Send(SendFeedbackDto dto, ClaimsPrincipal user, HttpContext context);

        Task<bool> EditAsync(int reciverId, int feedbackId, EditFeedbackDto dto, ClaimsPrincipal user, HttpContext context);
        Task<bool> DeleteAsync(int feedbackId, ClaimsPrincipal user, CancellationToken cancellationToken);
        Task<bool> DeleteAllSentAsync(ClaimsPrincipal user, CancellationToken cancellationToken);
        Task<FeedbackDashboardDto> GetDashboardAsync();

    }
}
