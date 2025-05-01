using Microsoft.AspNetCore.Identity;
using TMS.API.Data;
using TMS.API.Models.AuthenticationModels;
using TMS.API.Models;
using TMS.API.Helpers;
using Microsoft.AspNetCore.Identity.UI.Services;

namespace TMS.API.Services.Registers
{
    public class UserRegistrationService : IUserRegistrationService
    {
        private readonly UserManager<ApplicationUser> userManager;
        private readonly TMSDbContext dbContext;
        private readonly IEmailSender emailSender;
        private readonly IHttpContextAccessor httpContextAccessor;

        public UserRegistrationService(UserManager<ApplicationUser> userManager,
            TMSDbContext dbContext,
            IEmailSender emailSender,
            IHttpContextAccessor httpContextAccessor)
        {
            this.userManager = userManager;
            this.dbContext = dbContext;
            this.emailSender = emailSender;
            this.httpContextAccessor = httpContextAccessor;
        }

        public async Task<IdentityResult> RegisterUserAsync(RegisterRequestModel request)
        {
            var identityUser = new ApplicationUser // Manual mapping, without using Mapster (auto mapping)
            {
                FirstName = request.FirstName.Trim(),
                LastName = request.LastName.Trim(),
                Email = request.Email.Trim(),
                // UserName ما بتسمح يكون في فراغ في ال Identity بتسبب مشكلة , ال //UserName = $"{request.FirstName.Trim()+" "+request.LastName.Trim()}", // UserName is (FirstName + LastName) without space
                UserName = request.UserName.Trim(),
                PhoneNumber = request.Phone.Trim(),
                Gender = request.Gender,
                BirthDate = request.BirthDate,
            };

            var result = await userManager.CreateAsync(identityUser, request.Password);
            if (!result.Succeeded)
                return result;


            try
            {
                // 2. حفظ الصورة إذا موجودة
                IFormFile checkForm = request.ProfileImageFile!; // ! null-forgiving operator
                if (checkForm is not null)
                {
                    var imageUrl = await FileHelper.SaveFileAync(checkForm, httpContextAccessor.HttpContext, "images/profiles");

                    // ✅ تخزين المسار في ApplicationUser
                    identityUser.ProfileImageUrl = imageUrl;
                    await userManager.UpdateAsync(identityUser); // حفظ التعديل
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("❌ Error while saving image: " + ex.Message);
            }           

            var userAccount = new UserAccount
            {
                ApplicationUserId = identityUser.Id,
                Role = request.Role // UserRole.Company, UserRole.Supervisor, UserRole.Trainee, UserRole.Admin
            };

            await emailSender.SendEmailAsync(identityUser.Email, "Welcome", // OR => _ = emailSender.SendEmailAsync
                   $"<h1>Hello ... {identityUser.UserName} </h1> <p> Thank you for registeration in our TMS platform. </p>");

            await dbContext.UserAccounts.AddAsync(userAccount);
            await dbContext.SaveChangesAsync();

            await userManager.AddToRoleAsync(identityUser, request.Role.ToString()); // DB داخل string الى enum لازم نحولها من 

            return result;
        }
    }
}
