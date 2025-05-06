using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using TMS.API.DTOs.Users;
using TMS.API.Helpers;
using TMS.API.Models;
using TMS.API.Models.AuthenticationModels;
using TMS.API.Services.Registers;
using TMS.API.Services.Users;

namespace TMS.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController] // من حالها !ModelState.IsValid  بتعمل ال [ApiController] : ملاحظة
    //[Authorize] // تأكد أن جميع العمليات تتطلب تسجيل الدخول
    [Authorize(Roles = $"{StaticData.Admin}")]
    public class UsersController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> userManager;
        private readonly RoleManager<IdentityRole> roleManager;
        private readonly IUserService userService;
        private readonly IUserRegistrationService userRegistrationService;

        public UsersController(UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager,
            IUserService userService,
            IUserRegistrationService userRegistrationService)
        {
            this.userManager = userManager;
            this.roleManager = roleManager;
            this.userService = userService;
            this.userRegistrationService = userRegistrationService;
        }



        // عرض جميع اليوزرز
        [HttpGet("")]
        public async Task<ActionResult<IEnumerable<ApplicationUser>>> GetAllUsers()
        {
            var usersDto = await userService.GetAll();
            return Ok(usersDto);
        }

        // UserAccountId احضار اليوزر بناء على ال
        [HttpGet("{id}")]
        public async Task<ActionResult<ApplicationUser>> GetById([FromRoute] int id)
        {
            try
            {
                var userDto = await userService.GetById(id); // سيتم تنفيذ الكود في Service
                return Ok(userDto);
            }
            catch (KeyNotFoundException)
            {
                return NotFound($"User with ID {id} not found"); // إرجاع خطأ إذا كان المستخدم غير موجود
            }
        }


        [HttpPost("Add-User")]
        public async Task<IActionResult> Add([FromForm] RegisterRequestModel registerRequestModel)
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

            if (registerRequestModel.Role == UserRole.Admin)
                return BadRequest(new
                {
                    Message = "You are not allowed to register as an Admin. Choose {Company, Supervisor, Trainee} role."
                }); // Admin لا يمكن تغيير دور المستخدم إلى 

            var result = await userService.Add(registerRequestModel);

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



        // Login عادي المهم يكون عامل User من قبل اي Email & Password & Role امكانية تحديث جميع الداتا باستثناء ال
        [HttpPatch("{id}")]
        [Authorize] 
        public async Task<ActionResult> Update([FromRoute] int id, [FromForm] UpdateUserDto updateUserDto)
        {
            var identityResult = await userService.Edit(id, updateUserDto, HttpContext);
           
            if (identityResult == null)
                return NotFound(new { Message = "User not found" });

            if (!identityResult.Succeeded) // Identity وهذا هو التصرف الافتراضي ل unique انو يكون UserName بتتضمن 
            {
                var errors = identityResult.Errors.Select(e => e.Description); // ?! يحتوي على UserName وكذلك ممكن يكون
                return BadRequest(new { // UpdateUserDto الموجودة في Data Annotation وكذلك بتنطبق على ال
                    Message = "Update failed",
                    Errors = errors
                }); 
            }

            return NoContent();

        }
        


        // Delete a user
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete([FromRoute] int id)
        {
            if(id == 1)
                return BadRequest(new { Message = "❌ You cannot delete the Admin user." });

            try
            {
                var result = await userService.RemoveUserAsync(id, CancellationToken.None);
                if (!result)
                    return NotFound(new { Message = "User not found." });

                return NoContent();
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }

        }

        [HttpDelete("delete-all")]
        public async Task<ActionResult> DeleteAllUsersExceptAdmin()
        {
            try
            {
                var result = await userService.RemoveAllExceptAdmin(CancellationToken.None);
                if (!result)
                    return NotFound("No users found to delete.");

                return NoContent();
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }


        [HttpPatch("ChangeRole/{userId}")]
        public async Task<ActionResult> ChangeRole([FromRoute] int userId, [FromBody] ChangeRoleDto changeRoleDto)
        {
            if(changeRoleDto.RoleName != UserRole.Company &&
                changeRoleDto.RoleName != UserRole.Supervisor &&
                changeRoleDto.RoleName != UserRole.Trainee)
            {
                return BadRequest(new        // او دخل رقم غريب مثل 8 Admin بمنعه من تغيير دور غير مسموح فيه بما في ذلك 
                {
                    Message = "Invalid role. Choose {Company, Supervisor, Trainee} role."
                });
            }

            try
            {
                var result = await userService.ChangeRole(userId, changeRoleDto.RoleName);
                if (!result)
                    return NotFound(new { Message = $"User with ID {userId} not found." });

                return NoContent();
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }

        }

        [HttpPatch("LockUnLock/{userId}")]
        public async Task<IActionResult> LockUnLock([FromRoute] int userId)
        {
            var result = await userService.LockUnLock(userId);
            if (result == null)
                return NotFound(new { Message = "❌ User not found." });

            if (result == "Locked")
                return Ok(new { Message = "🔒 User has been locked for 5 minutes." });

            if (result == "Unlocked")
                return Ok(new { Message = "🔓 User has been unlocked." });

            return BadRequest(new { Message = "❌ Error occurred while locking/unlocking the user." });
        }


    }


}
