using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using System.Threading.Tasks;
using TMS.API.Data;
using TMS.API.DTOs.Users;
using TMS.API.Helpers;
using TMS.API.Models;
using TMS.API.Services.IService;

namespace TMS.API.Services.Users
{
    public class UserService : Service<ApplicationUser>, IUserService
    {
        private readonly TMSDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public UserService(TMSDbContext context, UserManager<ApplicationUser> userManager) : base(context)
        {
            this._context = context;
            _userManager = userManager;
        }

        public async Task<IEnumerable<GetUsersDto>> GetAll()
        {
            var users = await GetAsync(
                expression: u => u.Email != null, // Example filter to fetch all users with a Email
                includes: new Expression<Func<ApplicationUser, object>>[] { u => u.UserAccount }, // Example include for related UserAccount
                isTracked: false
            );

            var sortedUsers = users.OrderBy(userApp => userApp.UserAccount.Id).ToList();

            // Map to DTO
            var usersDto = sortedUsers.Select(user => new GetUsersDto
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
                Role = Enum.GetName(typeof(UserRole), user.UserAccount.Role)
            }).ToList();

            return usersDto;
        }


        public async Task<GetUsersDto> GetById(int id)
        {
            var user = await GetOneAsync(
                predicate: u => u.UserAccount.Id == id, // Filter to fetch the user by Id
                includes: new Expression<Func<ApplicationUser, object>>[] { u => u.UserAccount }, // Example include for related UserAccount
                isTracked: false
                );

            // تحقق إذا كان المستخدم غير موجود
            if (user == null)
            {
                throw new KeyNotFoundException("User not found"); // أو يمكن إرجاع NotFound من دون رمي الاستثناء
            }

            var userDto = new GetUsersDto{
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
                Role = Enum.GetName(typeof(UserRole), user.UserAccount.Role)
            };

            return userDto;
        }



        public async Task<bool> Edit(int id, ApplicationUser updatedUser, IFormFile? mainFile, HttpContext httpContext)
        {
            var applicationUserInDb = await _userManager.Users
               .FirstOrDefaultAsync(appUser => appUser.UserAccount.Id == id);  // Fixing the query by using Where instead of Include

            if (applicationUserInDb == null) return false;

            // Update the user details with the new values, if any
            applicationUserInDb.UserName = updatedUser.UserName ?? applicationUserInDb.UserName;
            applicationUserInDb.FirstName = updatedUser.FirstName ?? applicationUserInDb.FirstName;
            applicationUserInDb.LastName = updatedUser.LastName ?? applicationUserInDb.LastName;
            applicationUserInDb.PhoneNumber = updatedUser.PhoneNumber ?? applicationUserInDb.PhoneNumber;
            applicationUserInDb.Gender = updatedUser.Gender != default ? updatedUser.Gender : applicationUserInDb.Gender;
            applicationUserInDb.BirthDate = updatedUser.BirthDate; // 16 مسبقاانو لازم يكون اكبر من check معمولو


            // Check if there's a new profile image
            if (mainFile != null && mainFile.Length > 0) // إذا تم تحميل صورة جديدة
            {
                // Check if the old profile image exists to delete
                if (!string.IsNullOrEmpty(applicationUserInDb.ProfileImageUrl))
                {
                    Console.WriteLine($"Directory.GetCurrentDirectory() = {Directory.GetCurrentDirectory()}");
                    Console.WriteLine($"applicationUserInDb.ProfileImageUrl = {applicationUserInDb.ProfileImageUrl}");          // بنص فاضي 7035 استبدال ال
                    var oldImagePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", applicationUserInDb.ProfileImageUrl.Replace("https://localhost:7035/", "").Replace("http://localhost:5000/", "")); // 5000 عشان يتاكد يشيل ال http اذا موجود

                    try
                    {
                        // Attempt to delete the old image, but handle the possibility of it being in use.
                        if (File.Exists(oldImagePath))
                        {
                            File.Delete(oldImagePath); // حذف الصورة القديمة
                        }
                    }
                    catch(IOException ex)
                    {
                        Console.WriteLine($"File doesn't exists, error message => {ex.Message}");
                    }
   
                }

                // Save new profile image using FileHelper class
                applicationUserInDb.ProfileImageUrl = await FileHelper.SaveFileAync(mainFile, httpContext, "images/profiles");
            }

            /* // No need to save the old image, it exists by default because we don't delete it here
            else
            {
                // If no new image is uploaded, retain the old one
                applicationUserInDb.ProfileImageUrl = applicationUserInDb.ProfileImageUrl;
            }
            */


            //await _context.SaveChangesAsync(); // No need to apply it in the DB, cuz UpdateAsync() do that

            var result = await _userManager.UpdateAsync(applicationUserInDb);
            return result.Succeeded; // return 0 or 1, based on the Succeeded status

        }

        [Authorize(Roles = $"{StaticData.Admin}")]
        public async Task<bool> ChangeRole(int userId, UserRole role)
        {
            var user = await _userManager.Users
                .Include(appUser => appUser.UserAccount) // Include the UserAccount navigation property
                .FirstOrDefaultAsync(appUser => appUser.UserAccount.Id == userId);

            if (user is not null)
            {
                // remove the old role
                var oldRoles = await _userManager.GetRolesAsync(user);
                var removeResult = await _userManager.RemoveFromRolesAsync(user, oldRoles);
                if (!removeResult.Succeeded)
                    return false;

                string roleName = Enum.GetName(typeof(UserRole), role); // OR : string roleName = role.ToString();
                // add the new role
                var result = await _userManager.AddToRoleAsync(user, roleName);

                var userAccount = user.UserAccount;
                userAccount.Role = role; // Update the role in the UserAccount entity

                _context.UserAccounts.Update(userAccount); // Update the UserAccount entity in the context
                await _context.SaveChangesAsync(); // Save the changes to the database

                return result.Succeeded; // return 0 or 1 (if succeeded 1 if no 0)
            }

            return false;
        }

        public async Task<bool> RemoveUserAsync(int id, CancellationToken cancellationToken)
        {
            var user = await _userManager.Users
                .FirstOrDefaultAsync(appUser => appUser.UserAccount.Id == id);

            if (user == null)
                return false;

            var result = await _userManager.DeleteAsync(user);
            return result.Succeeded;
        }
    }
}
