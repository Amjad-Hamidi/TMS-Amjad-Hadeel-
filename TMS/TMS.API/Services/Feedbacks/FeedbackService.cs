using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using TMS.API.Data;
using TMS.API.DTOs.Feedbacks;
using TMS.API.DTOs.Pages;
using TMS.API.Helpers;
using TMS.API.Models;

namespace TMS.API.Services.Feedbacks
{
    public class FeedbackService : IFeedbackService
    {
        private readonly TMSDbContext tMSDbContext;

        public FeedbackService(TMSDbContext tMSDbContext)
        {
            this.tMSDbContext = tMSDbContext;
        }

        private int GetUserId(ClaimsPrincipal user)
        {
            var claim = user.FindFirst("UserAccountId");
            if (claim == null)
                throw new UnauthorizedAccessException("User is not authenticated.");

            return int.Parse(claim.Value);
        }


        public async Task<PagedResult<ReceivedFeedbackDto>> GetReceivedFeedbacksAsync(
            ClaimsPrincipal user, int? programId, string? search, int? rating, FeedbackType? type, int page, int limit)
        {
            int userId = GetUserId(user);

            IQueryable<Feedback> query = tMSDbContext.Feedbacks
                .AsNoTracking()
                .Where(f => f.ToUserAccountId == userId);

            if (programId.HasValue)
                query = query.Where(f => f.TrainingProgramId == programId);

            if (!string.IsNullOrWhiteSpace(search))
                query = query.Where(f =>
                    f.Message.Contains(search) ||
                    f.FromUserAccount.ApplicationUser.FirstName.Contains(search) ||
                    f.FromUserAccount.ApplicationUser.LastName.Contains(search));

            if (rating.HasValue)
                query = query.Where(f => f.Rating == rating);

            if (type.HasValue)
                query = query.Where(f => f.Type == type);

            query = query
                .Include(f => f.FromUserAccount).ThenInclude(u => u.ApplicationUser)
                .Include(f => f.TrainingProgram);

            var total = await query.CountAsync();
            var items = await query
                .OrderByDescending(f => f.CreatedAt)
                .Skip((page - 1) * limit)
                .Take(limit)
                .ToListAsync();

            var dtoItems = items.Select(f => new ReceivedFeedbackDto
            {
                FromFullName = $"{f.FromUserAccount.ApplicationUser.FirstName} {f.FromUserAccount.ApplicationUser.LastName}",
                FromImageUrl = f.FromUserAccount.ApplicationUser.ProfileImageUrl,
                Message = f.Message,
                Rating = f.Rating,
                CreatedAt = f.CreatedAt,
                ProgramName = f.TrainingProgram.Title,
                Type = f.Type,
                AttachmentUrl = f.AttachmentUrl
            }).ToList();

            return new PagedResult<ReceivedFeedbackDto>
            {
                Items = dtoItems,
                TotalCount = total,
                Page = page,
                Limit = limit
            };
        }

        public async Task<PagedResult<SentFeedbackDto>> GetSentFeedbacksAsync(
            ClaimsPrincipal user, int? programId, string? search, int? rating, FeedbackType? type, int page, int limit)
        {
            int userId = GetUserId(user);

            IQueryable<Feedback> query = tMSDbContext.Feedbacks
                .AsNoTracking()
                .Where(f => f.FromUserAccountId == userId);

            if (programId.HasValue)
                query = query.Where(f => f.TrainingProgramId == programId);

            if (!string.IsNullOrWhiteSpace(search))
                query = query.Where(f =>
                    f.Message.Contains(search) ||
                    f.ToUserAccount.ApplicationUser.FirstName.Contains(search) ||
                    f.ToUserAccount.ApplicationUser.LastName.Contains(search));

            if (rating.HasValue)
                query = query.Where(f => f.Rating == rating);

            if (type.HasValue)
                query = query.Where(f => f.Type == type);

            query = query
                .Include(f => f.ToUserAccount).ThenInclude(u => u.ApplicationUser)
                .Include(f => f.TrainingProgram);

            var total = await query.CountAsync();
            var items = await query
                .OrderByDescending(f => f.CreatedAt)
                .Skip((page - 1) * limit)
                .Take(limit)
                .ToListAsync();

            var dtoItems = items.Select(f => new SentFeedbackDto
            {
                FeedbackId = f.Id,
                ToUserAccountId = f.ToUserAccountId,
                ToFullName = $"{f.ToUserAccount.ApplicationUser.FirstName} {f.ToUserAccount.ApplicationUser.LastName}",
                ToImageUrl = f.ToUserAccount.ApplicationUser.ProfileImageUrl,
                Message = f.Message,
                Rating = f.Rating,
                CreatedAt = f.CreatedAt,
                ProgramName = f.TrainingProgram.Title,
                Type = f.Type,
                AttachmentUrl = f.AttachmentUrl
            }).ToList();

            return new PagedResult<SentFeedbackDto>
            {
                Items = dtoItems,
                TotalCount = total,
                Page = page,
                Limit = limit
            };
        }

        public async Task<bool> Send(SendFeedbackDto dto, ClaimsPrincipal user, HttpContext context)
        {
            int senderId = GetUserId(user);

            var sender = await tMSDbContext.UserAccounts.FindAsync(senderId);
            var receiver = await tMSDbContext.UserAccounts.FindAsync(dto.ToUserAccountId);

            if (sender == null || receiver == null)
                throw new ArgumentException("Sender or receiver not found.");

            // الى من feedback التحقق من من يُسمح له بإرسال
            bool allowed = (sender.Role == UserRole.Trainee && (receiver.Role == UserRole.Supervisor || receiver.Role == UserRole.Company)) ||
                           (sender.Role == UserRole.Supervisor && (receiver.Role == UserRole.Trainee || receiver.Role == UserRole.Company)) ||
                           (sender.Role == UserRole.Company && (receiver.Role == UserRole.Trainee || receiver.Role == UserRole.Supervisor));

            if (!allowed)
                throw new UnauthorizedAccessException("You are not authorized to send feedback to this user.");

            // TP التحقق من 
            var programExists = await tMSDbContext.TrainingPrograms.AnyAsync(p => p.TrainingProgramId == dto.TrainingProgramId);
            if (!programExists)
                throw new ArgumentException("Training program not found.");

            // TP في هذا ال Trainee التحقق من وحود هذا ال
            bool isTraineeInProgram = await tMSDbContext.ProgramTrainees
                .AnyAsync(pt => pt.TraineeId == senderId && pt.TrainingProgramId == dto.TrainingProgramId);

            if (sender.Role == UserRole.Trainee && !isTraineeInProgram)
                throw new UnauthorizedAccessException("You are not part of this training program.");

            var feedback = new Feedback
            {
                FromUserAccountId = senderId,
                ToUserAccountId = dto.ToUserAccountId,
                TrainingProgramId = dto.TrainingProgramId,
                Message = dto.Message,
                Rating = dto.Rating,
                Type = dto.Type
            };

            if (dto.Attachment != null)
            {
                var allowedExtensions = new[] { ".pdf", ".png", ".jpg", ".jpeg", ".docx" };
                var extension = Path.GetExtension(dto.Attachment.FileName).ToLower();

                if (!allowedExtensions.Contains(extension))
                    throw new ArgumentException($"Unsupported attachment format. Allowed files are: '{string.Join(", ", allowedExtensions)}'");

                if (dto.Attachment.Length > 10 * 1024 * 1024)
                    throw new ArgumentException("Attachment size must not exceed 10MB.");

                feedback.AttachmentUrl = await FileHelper.SaveFileAync(dto.Attachment, context, "files/feedback-attachments");
            }

            await tMSDbContext.Feedbacks.AddAsync(feedback);
            await tMSDbContext.SaveChangesAsync();
            return true;
        }


        // No need to re-validate sender/receiver roles:
        // Sender already validated during feedback creation (Send method)
        public async Task<bool> EditAsync(int reciverId, int feedbackId, EditFeedbackDto dto, ClaimsPrincipal user, HttpContext context)
        {
            int userId = GetUserId(user);

            var feedback = await tMSDbContext.Feedbacks.FindAsync(feedbackId);
            if (feedback == null || feedback.FromUserAccountId != userId)
                return false;

            if (!string.IsNullOrWhiteSpace(dto.Message))
                feedback.Message = dto.Message;

            if (dto.Rating.HasValue)
                feedback.Rating = dto.Rating.Value;

            if (dto.Type.HasValue)
                feedback.Type = dto.Type.Value;

            if (dto.Attachment != null)
            {
                var allowedExtensions = new[] { ".pdf", ".png", ".jpg", ".jpeg", ".docx" };
                var extension = Path.GetExtension(dto.Attachment.FileName).ToLower();

                if (!allowedExtensions.Contains(extension))
                    throw new ArgumentException($"Unsupported attachment format. Allowed: {string.Join(", ", allowedExtensions)}");

                if (dto.Attachment.Length > 10 * 1024 * 1024)
                    throw new ArgumentException("Attachment size must not exceed 10MB.");

                FileHelper.DeleteFileFromUrl(feedback.AttachmentUrl);
                feedback.AttachmentUrl = await FileHelper.SaveFileAync(dto.Attachment, context, "files/feedback-attachments");
            }

            tMSDbContext.Feedbacks.Update(feedback);
            await tMSDbContext.SaveChangesAsync();
            return true;
        }


        // No need to re-validate sender/receiver roles:
        // Sender already validated during feedback creation (Send method)
        public async Task<bool> DeleteAsync(int feedbackId, ClaimsPrincipal user, CancellationToken cancellationToken)
        {
            int userId = GetUserId(user); // feedback الحذف يكون فقط من الطرف المرسل لل

            var feedback = await tMSDbContext.Feedbacks.FindAsync(feedbackId);
            if (feedback == null || feedback.FromUserAccountId != userId)
                return false;

            FileHelper.DeleteFileFromUrl(feedback.AttachmentUrl);

            tMSDbContext.Feedbacks.Remove(feedback); // المرسلة من قبل المرسل , وكذلك بتنحذف عند المستقبل feedback يتم حذف ال
            await tMSDbContext.SaveChangesAsync(cancellationToken);
            return true;
        }

        public async Task<bool> DeleteAllSentAsync(ClaimsPrincipal user, CancellationToken cancellationToken)
        {
            int userId = GetUserId(user); // feedback الحذف يكون فقط من الطرف المرسل لل

            var feedbacks = await tMSDbContext.Feedbacks
                .Where(f => f.FromUserAccountId == userId)
                .ToListAsync();

            if (!feedbacks.Any())
                return false;

            foreach (var feedback in feedbacks)
            {
                FileHelper.DeleteFileFromUrl(feedback.AttachmentUrl);
            }

            tMSDbContext.Feedbacks.RemoveRange(feedbacks); // من الشخص المرسل , وايضا بتنحذف عند المستقبل feedbacks يتم الحذف جميع ال 
            await tMSDbContext.SaveChangesAsync(cancellationToken);

            // Reset the identity column (using SQL Server)
            tMSDbContext.Database.ExecuteSqlRaw("DBCC CHECKIDENT ('Feedbacks', RESEED, 0)");

            return true;
        }


        public async Task<FeedbackDashboardDto> GetDashboardAsync()
        {
            return new FeedbackDashboardDto
            {
                Total = await tMSDbContext.Feedbacks.CountAsync(),
                ByType = await tMSDbContext.Feedbacks
                    .GroupBy(f => f.Type)
                    .Select(g => new { g.Key, Count = g.Count() })
                    .ToDictionaryAsync(g => g.Key.ToString(), g => g.Count),
                AverageRating = await tMSDbContext.Feedbacks
                    .Where(f => f.Rating.HasValue)
                    .AverageAsync(f => f.Rating.Value)
            };
        }

    }
}
