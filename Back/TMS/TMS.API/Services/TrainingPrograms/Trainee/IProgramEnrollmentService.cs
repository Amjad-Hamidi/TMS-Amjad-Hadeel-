using TMS.API.DTOs.Pages;
using TMS.API.DTOs.TrainingPrograms.Requests;
using TMS.API.DTOs.TrainingPrograms.Responses;
using TMS.API.DTOs.Users.Trainees;
using TMS.API.Models;

namespace TMS.API.Services.TrainingPrograms.Trainee
{
    public interface IProgramEnrollmentService
    {
        Task<(bool Success, string Message)> EnrollAsync(int traineeId, EnrollmentRequestDto request, HttpContext httpContext);
        Task<(bool Success, string Message)> ReviewApplicationAsync(int traineeId, int programId, bool accept, int companyId);
        Task<PagedResult<ApplicantDto>> GetAllCompanyApplicantsAsync(int companyId, EnrollmentStatus? status, int page, int limit);
        Task<(bool Exists, bool BelongsToCompany, PagedResult<ApplicantDto>?)> GetProgramApplicantsAsync(int programId, int companyId, EnrollmentStatus? status, int page, int limit);
        Task<PagedResult<TraineeEnrollmentDto>> GetTraineeEnrollmentsAsync(int traineeId, EnrollmentStatus? status, int page, int limit);
    }
}
