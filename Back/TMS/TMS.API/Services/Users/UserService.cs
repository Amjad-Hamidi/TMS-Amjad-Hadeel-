using Mapster;
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
using TMS.API.Models.AuthenticationModels;
using TMS.API.Services.IService;
using TMS.API.Services.Registers;

namespace TMS.API.Services.Users
{
    public class UserService : Service<ApplicationUser>, IUserService
    {
        private readonly TMSDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IUserRegistrationService userRegistrationService;

        public UserService(TMSDbContext context,
            UserManager<ApplicationUser> userManager,
            IUserRegistrationService userRegistrationService) : base(context)
        {
            this._context = context;
            _userManager = userManager;
            this.userRegistrationService = userRegistrationService;
        }

        public async Task<IEnumerable<GetUsersDto>> GetAll()
        {
            var users = await GetAsync(
                expression: u => u.UserAccount != null, // Example filter to fetch all users who have a UserAccount
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


        public async Task<IdentityResult> Add(RegisterRequestModel registerRequestModel)
        {
            return await userRegistrationService.RegisterUserAsync(registerRequestModel);
        }


        public async Task<IdentityResult?> Edit(int id,
            UpdateUserDto updateUserDto,
            HttpContext httpContext)
        {
            var applicationUserInDb = await _userManager.Users
               //.Include(applicationUserInDb => applicationUserInDb.UserAccount) // لا داعي لعمل تضمين , لانا ما بدنا نعدل اشي من الداتا فيها
               .FirstOrDefaultAsync(appUser => appUser.UserAccount.Id == id);  // Fixing the query by using Where instead of Include

            if (applicationUserInDb == null) return null;
           
            // Check if there's a new profile image
            if (updateUserDto.ProfileImageFile != null && updateUserDto.ProfileImageFile.Length > 0) // إذا تم تحميل صورة جديدة
            {
                // Delete the old profile image from the server
                FileHelper.DeleteFileFromUrl(applicationUserInDb.ProfileImageUrl);

                // Save new profile image using FileHelper class
                applicationUserInDb.ProfileImageUrl = await FileHelper.SaveFileAync(updateUserDto.ProfileImageFile, httpContext, "images/profiles");
            }

            // Update only for the non-null properties
            updateUserDto.Adapt(applicationUserInDb);

            var result = await _userManager.UpdateAsync(applicationUserInDb);
            return result; // return IdentityResult

        }

        public async Task<bool> RemoveUserAsync(int id, CancellationToken cancellationToken)
        {
            var user = await _userManager.Users // DeleteAsync(user); لانو فعليا رح احذفه في AsNoTracking() غلط اعمل هون 
                .Include(appUser => appUser.UserAccount)
                .FirstOrDefaultAsync(appUser => appUser.UserAccount.Id == id);

            if (user == null)
                return false;

            if (user.UserAccount.Role == UserRole.Company)
            {
                var hasPrograms = await _context.TrainingPrograms
                    .AnyAsync(tp => tp.CompanyId == user.UserAccount.Id, cancellationToken);

                if (hasPrograms)
                {
                    // ⛔ ممنوع الحذف، لازم يحذف البرامج أولاً
                    throw new InvalidOperationException("Cannot delete this company. Please delete its training programs first.");
                }
            }

            // 🧹 حذف الصورة من السيرفر 
            FileHelper.DeleteFileFromUrl(user.ProfileImageUrl);

            var result = await _userManager.DeleteAsync(user);
            return result.Succeeded;
        }

        public async Task<bool> RemoveAllExceptAdmin(CancellationToken cancellationToken)
        {
            var users = await _userManager.Users
                .Include(appUser => appUser.UserAccount)
                .Where(user => user.UserAccount.Role != UserRole.Admin) // SQL وليس C# لانه هون SQL الى Enum رح يضرب سيرفر ايرور, ما بعرف يحول ال Enum.GetName(user.UserAccount.Role) != "Admin" لو احط
                .ToListAsync(cancellationToken);

            foreach (var user in users)
            {
                if (user.UserAccount.Role == UserRole.Company)
                {
                    var hasPrograms = await _context.TrainingPrograms
                        .AnyAsync(tp => tp.CompanyId == user.UserAccount.Id, cancellationToken);

                    if (hasPrograms)
                    {
                        throw new InvalidOperationException($"Cannot delete company '{user.UserName}' (ID: {user.UserAccount.Id}) because it still has training programs.");
                    }
                }

                FileHelper.DeleteFileFromUrl(user.ProfileImageUrl);

                var result = await _userManager.DeleteAsync(user);
                if (!result.Succeeded)
                    return false;
            }
            // reset identity to start from 2 (because Admin is already 1)
            await _context.Database.ExecuteSqlRawAsync("DBCC CHECKIDENT('UserAccounts', RESEED, 1);");

            return true;
        }

        [Authorize(Roles = $"{StaticData.Admin}")]
        public async Task<bool> ChangeRole(int userId, UserRole role)
        {
            var user = await _userManager.Users
                .Include(appUser => appUser.UserAccount) // Include the UserAccount navigation property
                .FirstOrDefaultAsync(appUser => appUser.UserAccount.Id == userId);

            if (user is null)
                return false;

            var currentRole = user.UserAccount.Role;

            // منع تغيير دور الشركة إذا عندها برامج تدريبية
            if (currentRole == UserRole.Company)
            {
                var hasPrograms = await _context.TrainingPrograms
                    .AnyAsync(tp => tp.CompanyId == user.UserAccount.Id);
                if (hasPrograms)
                    throw new InvalidOperationException("❌ Cannot change role: this company still has training programs. Please delete them first.");
            }

            // منع تغيير المشرف اذا كان يشرف على برامج تدريبية
            if (currentRole == UserRole.Supervisor)
            {
                var isSupervising = await _context.TrainingPrograms
                    .AnyAsync(tp => tp.SupervisorId == user.UserAccount.Id);
                if (isSupervising)
                    throw new InvalidOperationException("❌ Cannot change role: this supervisor is assigned to training programs.");
            }

            // remove the old role
            var oldRoles = await _userManager.GetRolesAsync(user);
            var removeResult = await _userManager.RemoveFromRolesAsync(user, oldRoles);
            if (!removeResult.Succeeded)
                return false;

            string roleName = Enum.GetName(typeof(UserRole), role); // OR : string roleName = role.ToString();
                                                                    // add the new role
            var addResult = await _userManager.AddToRoleAsync(user, roleName);

            var userAccount = user.UserAccount;
            userAccount.Role = role; // Update the role in the UserAccount entity

            _context.UserAccounts.Update(userAccount); // Update the UserAccount entity in the context
            await _context.SaveChangesAsync(); // Save the changes to the database

            return addResult.Succeeded; // return 0 or 1 (if succeeded 1 if no 0)

        }



        public async Task<string> LockUnLock(int id)
        {
            var user = await _userManager.Users
                .Include(appUser => appUser.UserAccount) // Include the UserAccount navigation property
                .FirstOrDefaultAsync(appUser => appUser.UserAccount.Id == id);
            if (user is not null)
            {
                user.LockoutEnabled = true; // Enable lockout

                if (user.LockoutEnd != null && user.LockoutEnd > DateTimeOffset.UtcNow) // انتهاء مدة الحظر , الان بدي الغي الحظر
                {
                    user.LockoutEnd = null; // الغاء الحظر
                    await _userManager.UpdateAsync(user);
                    return "Unlocked";
                }
                else
                {
                    user.LockoutEnd = DateTime.Now.AddMinutes(5); // قفل الحساب
                    await _userManager.UpdateAsync(user);
                    return "Locked";
                }
            }

            return null; // User not found
        }

    }
}
