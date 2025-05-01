using Microsoft.AspNetCore.Mvc;
using TMS.API.DTOs.Users;
using TMS.API.Models;
using TMS.API.Services.IService;

namespace TMS.API.Services.Users
{
    public interface IUserService : IService<ApplicationUser>
    {
        Task<IEnumerable<GetUsersDto>> GetAll();
        Task<GetUsersDto> GetById(int id);
        Task<bool> ChangeRole(int userId, UserRole userRole);
        Task<bool> Edit(int id, ApplicationUser applicationUser, IFormFile? formFile, HttpContext httpContext);
        Task<bool> RemoveUserAsync(int id, CancellationToken cancellationToken);

    }
}
