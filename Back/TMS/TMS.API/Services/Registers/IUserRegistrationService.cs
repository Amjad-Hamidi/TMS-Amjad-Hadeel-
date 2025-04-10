using Microsoft.AspNetCore.Identity;
using TMS.API.Models;
using TMS.API.Models.AuthenticationModels;

namespace TMS.API.Services.Registers
{
    public interface IUserRegistrationService
    {
        Task<IdentityResult> RegisterUserAsync(RegisterRequestModel request);
    }
}
