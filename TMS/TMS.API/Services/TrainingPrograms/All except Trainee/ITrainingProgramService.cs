using TMS.API.DTOs.Pages;
using TMS.API.DTOs.TrainingPrograms.Requests;
using TMS.API.DTOs.TrainingPrograms.Responses;
using TMS.API.Models;
using TMS.API.Services.IService;

namespace TMS.API.Services.TrainingPrograms.All_except_Trainee
{
    public interface ITrainingProgramService : IService<TrainingProgram>
    {
        Task<PagedResult<TrainingProgram>> GetAsyncWithCondWithoutDetails(string? search, int page, int pageSize);
        Task<TrainingProgram?> GetOneAsyncWithoutDetails(int id);

        Task<PagedResult<TrainingProgram>> GetByCategoryAsync(int categoryId, string? search, int page, int limit);
        Task<TrainingProgram> AddAsync(AddTrainingProgramDto trainingProgramRequestDto, HttpContext httpContext);
        Task<bool> EditAsync(int id, UpdateTrainingProgramDto updateTrainingProgramDto, HttpContext httpContext);
        Task<bool> RemoveAsync(int id, CancellationToken cancellationToken);
        Task<bool> RemoveAllAsync(CancellationToken cancellationToken);
        Task<ProgramActionResult> ApproveAsync(int id);
        Task<PagedResult<TrainingProgram>> GetPendingAsync(string? search, int page, int limit);
        Task<PagedResult<TrainingProgram>> GetPendingByCompanyAsync(int companyId, string? search, int page, int limit);
        Task<ProgramActionResult> RejectAsync(int id, string reason);
        Task<PagedResult<TrainingProgram>> GetRejectedAsync(string? search, int page, int limit);
        Task<PagedResult<TrainingProgram>> GetRejectedByCompanyAsync(int companyId, string? search, int page, int limit);
        Task<PagedResult<ApprovedAdminProgramDto>> GetApprovedAsync(string? search, int page, int limit);
        Task<PagedResult<TrainingProgram>> GetApprovedByCompanyAsync(int companyId, string? search, int page, int limit);
        Task<PagedResult<TrainingProgram>> GetBySupervisorAsync(int supervisorId, string? search, int page, int limit);
    }
}
