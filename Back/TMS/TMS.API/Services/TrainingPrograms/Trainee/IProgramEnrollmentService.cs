using TMS.API.DTOs.TrainingPrograms.Requests;
using TMS.API.Models;

namespace TMS.API.Services.TrainingPrograms.Trainee
{
    public interface IProgramEnrollmentService
    {
        Task<(bool Success, string Message)> EnrollAsync(int traineeId, EnrollmentRequestDto request, HttpContext httpContext);
        Task<(bool Success, string Message)> ReviewApplicationAsync(int traineeId, int programId, bool accept, int companyId);
        Task<IEnumerable<ProgramTrainee>> GetProgramApplicantsAsync(int programId, int companyId);
        Task<IEnumerable<ProgramTrainee>> GetTraineeEnrollmentsAsync(int traineeId);
    }
}
