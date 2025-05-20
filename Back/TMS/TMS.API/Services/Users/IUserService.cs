using Microsoft.AspNetCore.Identity;
using TMS.API.DTOs.Pages;
using TMS.API.DTOs.Users;
using TMS.API.DTOs.Users.Supervisors;
using TMS.API.DTOs.Users.Trainees;
using TMS.API.Models;
using TMS.API.Models.AuthenticationModels;
using TMS.API.Services.IService;

namespace TMS.API.Services.Users
{
    public interface IUserService : IService<ApplicationUser>
    {
        Task<PagedResult<GetUsersDto>> GetAll(int page, int limit, string? search, UserRole? role = null);
        Task<GetUsersDto> GetById(int id);
        Task<PagedResult<SupervisorDto>> GetAllSupervisorsAsync(string? search, int page, int limit);
        Task<PagedResult<TraineeDto>> GetTraineesForSupervisorAsync(int supervisorId, string? search, int page, int limit);
        Task<IdentityResult> Add(RegisterRequestModel request);

        // It is made on the IProfileService
        //Task<IdentityResult?> Edit(int id, UpdateProfileDto updateUserDto, HttpContext httpContext);

        Task<bool> RemoveUserAsync(int id, CancellationToken cancellationToken);
        Task<bool> RemoveAllExceptAdmin(CancellationToken cancellationToken);
        Task<bool> ChangeRole(int userId, UserRole userRole);
        Task<string> LockUnLock(int id);
    
    }
}
