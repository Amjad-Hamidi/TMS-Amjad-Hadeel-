using System.Linq.Expressions;
using TMS.API.DTOs.TrainingPrograms.Requests;
using TMS.API.Models;
using TMS.API.Services.IService;
using TMS.API.Services.TrainingPrograms;

namespace TMS.API.Services.TrainingPrograms.All_except_Trainee
{
    public interface ITrainingProgramService : IService<TrainingProgram>
    {
        Task<IEnumerable<TrainingProgram>> GetAsyncWithCondWithoutDetails(string? query, int page, int pageSize);
        Task<TrainingProgram?> GetOneAsyncWithoutDetails(int id);
        Task<TrainingProgram> AddAsync(AddTrainingProgramDto trainingProgramRequestDto, HttpContext httpContext);
        Task<bool> EditAsync(int id, UpdateTrainingProgramDto updateTrainingProgramDto, HttpContext httpContext);
        Task<bool> RemoveAsync(int id, CancellationToken cancellationToken);
        Task<bool> RemoveAllAsync(CancellationToken cancellationToken);

        Task<ProgramActionResult> ApproveAsync(int id);
        Task<IEnumerable<TrainingProgram>> GetPendingAsync();
        Task<IEnumerable<TrainingProgram>> GetPendingByCompanyAsync(int companyId);
        Task<ProgramActionResult> RejectAsync(int id, string reason);
        Task<IEnumerable<TrainingProgram>> GetRejectedAsync();
        Task<IEnumerable<TrainingProgram>> GetRejectedByCompanyAsync(int companyId);
        Task<IEnumerable<TrainingProgram>> GetApprovedByCompanyAsync(int companyId);
        Task<IEnumerable<TrainingProgram>> GetBySupervisorAsync(int supervisorId);
    }
}
