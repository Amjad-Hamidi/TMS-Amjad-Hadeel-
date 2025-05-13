using TMS.API.DTOs.Pages;
using TMS.API.DTOs.TrainingPrograms.Requests;
using TMS.API.Models;
using TMS.API.Services.IService;

namespace TMS.API.Services.TrainingPrograms.All_except_Trainee
{
    public interface ITrainingProgramService : IService<TrainingProgram>
    {
        Task<PagedResult<TrainingProgram>> GetAsyncWithCondWithoutDetails(string? query, int page, int pageSize);
        Task<TrainingProgram?> GetOneAsyncWithoutDetails(int id);
        Task<TrainingProgram> AddAsync(AddTrainingProgramDto trainingProgramRequestDto, HttpContext httpContext);
        Task<bool> EditAsync(int id, UpdateTrainingProgramDto updateTrainingProgramDto, HttpContext httpContext);
        Task<bool> RemoveAsync(int id, CancellationToken cancellationToken);
        Task<bool> RemoveAllAsync(CancellationToken cancellationToken);

        Task<ProgramActionResult> ApproveAsync(int id);
        Task<PagedResult<TrainingProgram>> GetPendingAsync(int page, int limit);
        Task<PagedResult<TrainingProgram>> GetPendingByCompanyAsync(int companyId, int page, int limit);
        Task<ProgramActionResult> RejectAsync(int id, string reason);
        Task<PagedResult<TrainingProgram>> GetRejectedAsync(int page, int limit);
        Task<PagedResult<TrainingProgram>> GetRejectedByCompanyAsync(int companyId, int page, int limit);
        Task<PagedResult<TrainingProgram>> GetApprovedByCompanyAsync(int companyId, int page, int limit);
        Task<PagedResult<TrainingProgram>> GetBySupervisorAsync(int supervisorId, int page, int limit);
    }
}
