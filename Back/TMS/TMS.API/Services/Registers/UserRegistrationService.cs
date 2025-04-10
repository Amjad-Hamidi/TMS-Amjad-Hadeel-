using Microsoft.AspNetCore.Identity;
using TMS.API.Data;
using TMS.API.Models.AuthenticationModels;
using TMS.API.Models;

namespace TMS.API.Services.Registers
{
    public class UserRegistrationService : IUserRegistrationService
    {
        private readonly UserManager<ApplicationUser> userManager;
        private readonly TMSDbContext dbContext;

        public UserRegistrationService(UserManager<ApplicationUser> userManager, TMSDbContext dbContext)
        {
            this.userManager = userManager;
            this.dbContext = dbContext;
        }

        public async Task<IdentityResult> RegisterUserAsync(RegisterRequestModel request)
        {
            var identityUser = new ApplicationUser
            {
                FirstName = request.FirstName.Trim(),
                LastName = request.LastName.Trim(),
                Email = request.Email.Trim(),
                UserName = $"{request.FirstName.Trim()+" "+request.LastName.Trim()}", // UserName is (FirstName + LastName) without space
                PhoneNumber = request.Phone.Trim(),
            };

            var result = await userManager.CreateAsync(identityUser, request.Password);
            if (!result.Succeeded)
                return result;

            var userAccount = new UserAccount
            {
                ApplicationUserId = identityUser.Id,
                Role = request.Role // UserRole.Company, UserRole.Supervisor, UserRole.Trainee, UserRole.Admin
            };

            await dbContext.UserAccounts.AddAsync(userAccount);
            await dbContext.SaveChangesAsync();

            await userManager.AddToRoleAsync(identityUser, request.Role.ToString()); // DB داخل string الى enum لازم نحولها من 

            return result;
        }
    }
}
