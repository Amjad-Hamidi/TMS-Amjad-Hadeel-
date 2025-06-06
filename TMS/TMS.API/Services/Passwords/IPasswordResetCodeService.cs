using TMS.API.DTOs.Users;
using TMS.API.Models;
using TMS.API.Services.IService;

namespace TMS.API.Services.Passwords
{
    public interface IPasswordResetCodeService : IService<PasswordResetCode>
    {
        Task<bool> ForgotPasswordSendCode(ForgotPasswordDto forgotPasswordDto);
        Task<(bool IsSuccess, string Message)> SendCodeVerification(SendCodeDto sendCodeDto);
    }
}
