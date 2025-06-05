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

            // توليد token لتأكيد الإيميل
            var token = await userManager.GenerateEmailConfirmationTokenAsync(identityUser);

            // إنشاء رابط التأكيد
            var httpContext = httpContextAccessor.HttpContext!;
            var confirmUrl = $"{httpContext.Request.Scheme}://{httpContext.Request.Host}/api/Account/ConfirmEmail?token={Uri.EscapeDataString(token)}&userId={identityUser.Id}";

            // إرسال الإيميل
            await emailSender.SendEmailAsync(identityUser.Email, "Confirm Your Email - TMS Platform",
                $@"
                <div style='font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;'>
                    <div style='max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.05);'>
                        <div style='background-color: #0052cc; color: white; padding: 20px 30px; text-align: center;'>
                            <h1 style='margin: 0;'>TMS - Training Management System</h1>
                        </div>
                        <div style='padding: 30px; color: #333;'>
                            <h2 style='margin-top: 0;'>Hello {identityUser.UserName},</h2>
                            <p>Thank you for registering with <strong>TMS Platform</strong>. Please confirm your email address to activate your account and access our services.</p>
                            <div style='text-align: center; margin: 30px 0;'>
                                <a href='{confirmUrl}' 
                                   style='display: inline-block; padding: 12px 24px; background-color: #0052cc; color: white; text-decoration: none; border-radius: 5px; font-size: 16px;'>
                                   Confirm My Email
                                </a>
                            </div>
                            <p>If the button above doesn't work, you can copy and paste the following link into your browser:</p>
                            <p style='word-break: break-all;'>{confirmUrl}</p>
                            <p style='margin-top: 40px;'>Best regards,<br/><strong>The TMS Team</strong></p>
                        </div>
                        <div style='background-color: #f0f0f0; color: #888; text-align: center; padding: 15px; font-size: 12px;'>
                            &copy; {DateTime.Now.Year} TMS. All rights reserved.
                        </div>
                    </div>
                </div>");



            await dbContext.UserAccounts.AddAsync(userAccount);
            await dbContext.SaveChangesAsync();

            await userManager.AddToRoleAsync(identityUser, request.Role.ToString()); // DB داخل string الى enum لازم نحولها من 

            return result;
        }
    }
}
