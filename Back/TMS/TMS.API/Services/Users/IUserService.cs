using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using TMS.API.DTOs.Users;
using TMS.API.Models;
using TMS.API.Models.AuthenticationModels;
using TMS.API.Services.IService;

namespace TMS.API.Services.Users
{
    public interface IUserService : IService<ApplicationUser>
    {
        Task<IEnumerable<GetUsersDto>> GetAll();
        Task<GetUsersDto> GetById(int id);
        Task<IdentityResult> Add(RegisterRequestModel request);
        Task<IdentityResult?> Edit(int id, UpdateUserDto updateUserDto, HttpContext httpContext);
        Task<bool> RemoveUserAsync(int id, CancellationToken cancellationToken);
        Task<bool> RemoveAllExceptAdmin(CancellationToken cancellationToken);
        Task<bool> ChangeRole(int userId, UserRole userRole);
        Task<string> LockUnLock(int id);
    
    }
}
