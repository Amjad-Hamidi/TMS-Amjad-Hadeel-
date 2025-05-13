using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using TMS.API.Data;
using TMS.API.DTOs.Users;
using TMS.API.Models;
using TMS.API.Services.IService;

namespace TMS.API.Services.Passwords
{
    public class PasswordResetCodeService : Service<PasswordResetCode>, IPasswordResetCodeService
    {
        private readonly UserManager<ApplicationUser> userManager;
        private readonly IEmailSender emailSender;

        public PasswordResetCodeService(TMSDbContext context, UserManager<ApplicationUser> userManager,
            IEmailSender emailSender) : base(context)
        {
            this.userManager = userManager;
            this.emailSender = emailSender;
        }


        public async Task<bool> ForgotPasswordSendCode(ForgotPasswordDto forgotPasswordDto)
        {
            var appUser = await userManager.FindByEmailAsync(forgotPasswordDto.Email);
            if (appUser is null)
                return false;

            var code = new Random().Next(1000, 9999).ToString();

            await AddAsync(new PasswordResetCode
            {
                ApplicationUserId = appUser.Id,
                Code = code,
                ExpirationCode = DateTime.Now.AddMinutes(30),
            });

            await emailSender.SendEmailAsync(appUser.Email, "Reset Your Password - TMS Platform",
                $@"<h1>Hello {appUser.UserName},</h1>
                    <p>You have requested to reset your password on the <strong>TMS Platform</strong>.</p>
                    <p>Please use the verification code below to proceed:</p>
                    <h2 style='color: #2e86de;'>{code}</h2>
                    <p><strong>Important Notes:</strong></p>
                    <ul>
                        <li>This code is valid for <strong>30 minutes</strong> only.</li>
                        <li>The code can be used <strong>once</strong> for a single password reset.</li>
                        <li>If the code expires or you wish to reset your password again, you will need to submit a new request using your email address.</li>
                    </ul>
                    <p>If you did not request this action, please ignore this email.</p>
                    <p>Best regards,<br/>TMS Support Team</p>");

            return true;
        }


        public async Task<(bool IsSuccess, string Message)> SendCodeVerification(SendCodeDto sendCodeDto)
        {
            var appUser = await userManager.FindByEmailAsync(sendCodeDto.Email);

            if (appUser is null)
                return await Task.FromResult((false, "Invalid Code."));

            var resetCode = (await GetAsync(e => e.ApplicationUserId == appUser.Id)) // Id جيب اليوزر بناء عهاد ال DB الي موجودين بال Id'es من ال 
                .OrderByDescending(e => e.ExpirationCode).FirstOrDefault(); // الي مدته اطول اشي رح تكون , وذلك من خلال الترتيب التنازلي واحضار اول واحد ExpirationCode جيب فقط احدث

            if (resetCode is null) // PasswordResetCodes كامل من جدول ال row مرتين او اكثر بالتغيير , لانو مجرد ما اول غير اول مرة , رح ينحذف ال Code في حالة استخدم نفس ال
                return await Task.FromResult((false, "You can't use same code to change password more than 1 attempt."));

            else if (resetCode.Code is null)
                return await Task.FromResult((false, "the Code you sent is Empty."));

            else if (sendCodeDto.Code != resetCode.Code) // DB المدخل مش نفسه الي في Code ال
                return await Task.FromResult((false, $"the code you sent: '{sendCodeDto.Code}' doesn't match the one that exists in Database."));

            else if (resetCode.ExpirationCode < DateTime.Now) // خالصة ExpirationCode مدة ال
                return await Task.FromResult((false, $"the Expiration Code in Database: '{resetCode.ExpirationCode}' is finished. It is less than {DateTime.Now}"));

            else
            {
                var token = await userManager.GeneratePasswordResetTokenAsync(appUser);
                var result = await userManager.ResetPasswordAsync(appUser, token, sendCodeDto.Password); // token للجديدة وذلك من خلال ال Password تغيير ال

                if (!result.Succeeded)
                    return await Task.FromResult((false, "Error in generating the token or assign new password you sent in Database."));

                await emailSender.SendEmailAsync(appUser.Email, "Your Password Has Been Successfully Changed",
                    $@"<h1>Hello {appUser.UserName},</h1>
                    <p>We wanted to let you know that your password for the <strong>TMS Platform</strong> has been successfully changed.</p>
                    <p>If you made this change, no further action is needed.</p>
                    <p>If you did <strong>not</strong> authorize this change, please reset your password immediately or contact our support team.</p>
                    <p>Thank you for using TMS.</p>
                    <p>Best regards,<br/>TMS Support Team</p>");

                // توفيرا للمساحة (PasswordResetCodes) جدول ال DB بعد ما يرسله عالايميل بحذفه من ال , DB من ال Code هيك بنحذف ال 
                await RemoveAsync(resetCode.Id, CancellationToken.None);

                return await Task.FromResult((true, "Password has been changed successfully."));
            }

        }



    }
}
