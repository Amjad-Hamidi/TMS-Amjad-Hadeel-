using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using TMS.API.Models;
using TMS.API.Models.AuthenticationModels;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using TMS.API.Services.Tokens;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Net;
using System.Threading.Tasks;
using TMS.API.Services.Registers;
using Mapster;

namespace TMS.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> userManager;
        private readonly IConfiguration configuration;
        private readonly JwtService jwtService;

        public IUserRegistrationService registrationService { get; }

        public AccountController(UserManager<ApplicationUser> userManager,
            IConfiguration configuration,
            JwtService jwtService,
            IUserRegistrationService registrationService)
        {
            this.userManager = userManager;
            this.configuration = configuration;
            this.jwtService = jwtService;
            this.registrationService = registrationService;
        }


        [HttpPost("Register")]
        public async Task<IActionResult> Register([FromForm] RegisterRequestModel request)
        {
            if (!ModelState.IsValid)
            {
                var modelErrors = ModelState
                    .Where(ms => ms.Value.Errors.Count > 0)
                    .Select(ms => new
                    {
                        Field = ms.Key,
                        Errors = ms.Value.Errors.Select(e => e.ErrorMessage).ToList()
                    });

                return BadRequest(new
                {
                    Message = "Validation failed",
                    Errors = modelErrors
                });
            }

            var existingUser = await userManager.FindByEmailAsync(request.Email);
            if (existingUser is not null)
                return BadRequest(new
                {
                    Message = "User with this email already exists"
                });

            var result = await registrationService.RegisterUserAsync(request);

            if (!result.Succeeded)
            {
                var identityErrors = result.Errors.Select(e => e.Description);
                return BadRequest(new
                {
                    Message = "Registration failed",
                    Errors = identityErrors
                });
            }

            return Ok(new
            {
                Message = "User registered successfully. Please login."
            });
        }


        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestModel request)
        {
            if (!ModelState.IsValid)  // تحقق من صلاحية البيانات أولاً
            {
                var errors = ModelState
                     .Where(x => x.Value.Errors.Count > 0)
                     .Select(x => new
                     {
                         Field = x.Key,
                         Errors = x.Value.Errors.Select(e => e.ErrorMessage)
                     });

                return BadRequest(new
                {
                    Message = "Validation failed",
                    Errors = errors
                });
            }

            var loginResponse = await jwtService.Authenticate(request);
            if (loginResponse is null)
                return Unauthorized(new
                {
                    Message = "Invalid email or password."
                });

            return Ok(loginResponse);
        }

        [Authorize]
        [HttpPost("ChangeEmail")]
        public async Task<IActionResult> ChangeEmail([FromBody] ChangeEmailModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = await userManager.GetUserAsync(User);
            if (user == null)
                return Unauthorized(new { Message = "User not found." });

            var token = await userManager.GenerateChangeEmailTokenAsync(user, model.NewEmail);

            var result = await userManager.ChangeEmailAsync(user, model.NewEmail, token);
            if (!result.Succeeded)
                return BadRequest(new
                {
                    Message = "Failed to change email",
                    Errors = result.Errors.Select(e => e.Description)
                });

            return Ok(new { Message = "Email changed successfully" });
        }


        [Authorize] // للاستخدام => Key : Authorization , Value : Bearer <Access Token>
        [HttpPost("ChangePassword")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // ApplicationUser.cs خاصة فيه لو بدي اطبعه, راجع ال ToString كامل وانا خصصت وعملت user بجيب ال
            var user = await userManager.GetUserAsync(User);

            Console.WriteLine($"ID: {user.Id}");
            Console.WriteLine($"Email: {user.Email}");
            Console.WriteLine($"Phone: {user.PhoneNumber}");
            Console.WriteLine($"First Name: {user.FirstName}");
            Console.WriteLine($"Last Name: {user.LastName}");
            Console.WriteLine($"UserName: {user.UserName}");

            Console.WriteLine(user);
            if (user == null)
                return Unauthorized(new { Message = "User not found." });

            var passwordCheck = await userManager.CheckPasswordAsync(user, model.OldPassword);
            if (!passwordCheck)
                return BadRequest(new { message = "Old password is incorrect." });

            // تلقائيا DB وبتم التحديث في UpdateAsync(user) وبتنادي داخليا على Password, PasswordHash  من حالها بتحدث ال ChangePasswordAsync
            var result = await userManager.ChangePasswordAsync(user, model.OldPassword, model.NewPassword);
            if (!result.Succeeded)
                return BadRequest(new
                {
                    Message = "Failed to change password",
                    Errors = result.Errors.Select(e => e.Description)
                });

            return Ok(new {Message = "Password changed successfully"});
        }

        [Authorize] // للاستخدام => Key : Authorization , Value : Bearer <Access Token>
        [HttpGet("protected-endpoint")]
        public IActionResult GetProtectedData()
        {
            Console.WriteLine(Request.Headers[nameof(Authorization)]);
            var userName = User.Identity.Name; // الحصول على اسم المستخدم من الـ Token
            return Ok(new { message = $"Hello, {userName}. You accessed protected data!" });
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh([FromBody] RefreshTokenRequestModel request)
        {
            /*
            // انا مبرمجها تكون مقدار 30 دقيقة بداية وبصير يتناقص Access Token الوقت المتبقي لانتهاء ال 
            var remainingTime = jwtService.GetAccessTokenRemainingTime(request.AccessToken);

            if (remainingTime > TimeSpan.Zero)
            {
                Console.WriteLine($"Access Token remaining : {remainingTime.TotalMinutes} minutes.");
                return BadRequest(new { message = "Access token is still valid. No need to refresh." });
            }
            */

            // اذا كان الطلب غير موجود او غير صالح
            if (request is null || string.IsNullOrEmpty(request.AccessToken) || string.IsNullOrEmpty(request.RefreshToken))
                return BadRequest("Invalid client request. Please add Access Token and Refresh Token.");

            var isTokenValid = jwtService.ValidateToken(request.AccessToken);
            if (isTokenValid)
            {
                // إذا كان التوكن صالحًا، يمكن رفض الطلب أو إعطاء إشعار
                return BadRequest(new { message = "Access token is still valid. No need to refresh." });
            }

            string userId = jwtService.ExtractUserIdFromExpiredToken(request.AccessToken);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized(new { message = "Invalid access token." });

            // userId التحقق من وجود اليوزر بالـ 
            //var user = await userManager.Users.FirstOrDefaultAsync(u => u.Id == request.UserId);
            var user = await userManager.FindByIdAsync(userId);
            if (user is null)
                return Unauthorized(new
                {
                    Message = "User not found"
                });

            // مقارنة القيم مباشرة
            if (user.RefreshToken != request.RefreshToken)
            {
                return Unauthorized(new
                {
                    Message = "Invalid refresh token"
                });
            }

            // ولازم تسجل الدخول من جديد Unauthorized بنحكيله انك  Refresh Token في حال انتهاء صلاحية الـ 
            if (user.RefreshTokenExpiryTime <= DateTime.UtcNow)
                return Unauthorized(new
                {
                    Message = "Refresh token has expired"
                });

            // جديدتين Refresh Token و Access Token غير هيك منعمل 
            var roles = await userManager.GetRolesAsync(user);
            var role = roles.FirstOrDefault();
            var newAccessToken = jwtService.GenerateJwtToken(user, role);
            var newRefreshToken = jwtService.GenerateRefreshToken();


            user.RefreshToken = newRefreshToken;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
            await userManager.UpdateAsync(user);

            // Expires In و UserName و Access Token و Refresh Token ارجاع الـ 
            return Ok(new LoginResponseModel
            {
                AccessToken = newAccessToken,
                RefreshToken = newRefreshToken,
                UserName = user.UserName,
                ExpiresIn = configuration.GetValue<int>("JwtConfig:TokenValidityMins") * 60
            });
        }



    }
}