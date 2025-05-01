using Mapster;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Data;
using System.Net.Http;
using TMS.API.DTOs.Users;
using TMS.API.Helpers;
using TMS.API.Models;
using TMS.API.Models.AuthenticationModels;
using TMS.API.Services.Registers;
using TMS.API.Services.Users;

namespace TMS.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
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


            /*
             // OR : 
            var users = await userManager.Users
                .Include(appUser => appUser.UserAccount)
                .OrderBy(appUser => appUser.UserAccount.Id)
                .ToListAsync();

            IEnumerable<GetUsersDto> usersDto = users.Select(appUser => new GetUsersDto
            {
                UserAccountId = appUser.UserAccount.Id,
                ApplicationUserId = appUser.Id,
                UserName = appUser.UserName,
                FirstName = appUser.FirstName,
                LastName = appUser.LastName,
                Email = appUser.Email,
                Gender = Enum.GetName(typeof(ApplicationUserGender), appUser.Gender),
                BirthDate = appUser.BirthDate,
                Phone = appUser.PhoneNumber,
                ProfileImageUrl = appUser.ProfileImageUrl,
                Role = Enum.GetName(typeof(UserRole), appUser.UserAccount.Role),
            }
            ).ToList();

            return Ok(usersDto);
            */
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


            /* // OR :
            var user = await userManager.Users
                .Include(appUser => appUser.UserAccount)
                .FirstOrDefaultAsync(appUser => appUser.UserAccount.Id == id); // string نوعه id لازم يكون
           
            if (user == null)
                return NotFound(new { message = "User not found" });

            GetUsersDto userDto = new GetUsersDto
            {
                UserAccountId = user.UserAccount.Id,
                ApplicationUserId = user.Id,
                UserName = user.UserName,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                Gender = Enum.GetName(typeof(ApplicationUserGender), user.Gender),
                BirthDate = user.BirthDate,
                Phone = user.PhoneNumber,
                ProfileImageUrl = user.ProfileImageUrl,
                Role = Enum.GetName(typeof(UserRole), user.UserAccount.Role),
            };

            return Ok(userDto);
            */
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



        // Email & Password & Role امكانية تحديث جميع الداتا باستثناء ال
        [HttpPatch("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult> Update([FromRoute] int id, [FromForm] UpdateUserDto updateUserDto)
        {
            var user = await userService.Edit(id,
                updateUserDto.Adapt<ApplicationUser>(),
                updateUserDto.ProfileImageFile,
                HttpContext);
           
            if (!user)
                return NotFound();

            return NoContent();

            /*
            var user = await userManager.Users
                .Include(userApp => userApp.UserAccount.Id == id)
                .FirstOrDefaultAsync();


            if (user == null)
                return NotFound("User not found");

            user.FirstName = updateUserDto.FirstName ?? user.FirstName; // null-coalescing operator : استخدم القيمة الي عاليمين null اذا كانت القيمة عالشمال هي
            user.LastName = updateUserDto.LastName ?? user.LastName;
            user.UserName = updateUserDto.UserName ?? user.UserName;
            user.PhoneNumber = updateUserDto.Phone ?? user.PhoneNumber;
            user.Gender = updateUserDto.Gender != default ? updateUserDto.Gender : user.Gender;
            user.BirthDate = updateUserDto.BirthDate ?? user.BirthDate;



            // إذا تم تحميل صورة جديدة
            if (!string.IsNullOrEmpty(user.ProfileImageUrl))
            {
                // إذا كانت هناك صورة موجودة في الـ ProfileImageUrl
                var oldImagePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", user.ProfileImageUrl.Replace($"{this.HttpContext.Request.Scheme}://{this.HttpContext.Request.Host}/", ""));

                if (System.IO.File.Exists(oldImagePath))
                {
                    System.IO.File.Delete(oldImagePath);  // حذف الصورة القديمة من الخادم
                }
            }

            // معالجة الصورة الجديدة
            if (updateUserDto.ProfileImageFile != null)  // التأكد من أن الملف موجود
            {
                user.ProfileImageUrl = await FileHelper.SaveFileAync(updateUserDto.ProfileImageFile, this.HttpContext, "images/profiles");
            }
            var result = await userManager.UpdateAsync(user);
            if (!result.Succeeded)
                return BadRequest(result.Errors);

            return Ok(user);
            */


        }
        


        // Delete a user
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete([FromRoute] int id)
        {
            var result = await userService.RemoveUserAsync(id, CancellationToken.None);
            if (!result)
                return NotFound($"User not found");

            return NoContent();



            /* // OR :
            var user = await userManager.Users
                .FirstOrDefaultAsync(appUser => appUser.UserAccount.Id == id);

            if (user == null)
                return NotFound("User not found");
             
            var result = await userManager.DeleteAsync(user);
            if (!result.Succeeded)
                return BadRequest(result.Errors);

            return NoContent();
            */
        }

        [HttpDelete("Delete-All")]
        public async Task<ActionResult> DeleteAllUsersExceptAdmin()
        {
            var result = await userService.RemoveAllExceptAdmin(CancellationToken.None);
            if (!result)
                return NotFound("No users found to delete");
            return NoContent();
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

            var result = await userService.ChangeRole(userId, changeRoleDto.RoleName);
            if (!result)
                return NotFound($"User with ID {userId} not found");
            return NoContent();
            /*
            var user = await userManager.Users
                .Include(appUser => appUser.UserAccount)
                .FirstOrDefaultAsync(appUser => appUser.UserAccount.Id == userId);
            if (user == null)
                return NotFound("User not found");
            var roleExists = await roleManager.RoleExistsAsync(roleName);
            if (!roleExists)
                return BadRequest("Role does not exist");
            var currentRoles = await userManager.GetRolesAsync(user);
            await userManager.RemoveFromRolesAsync(user, currentRoles);
            await userManager.AddToRoleAsync(user, roleName);
            return NoContent();
            */
        }



    }


}
