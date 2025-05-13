using Mapster;
using Microsoft.EntityFrameworkCore;
using TMS.API.Data;
using TMS.API.DTOs.Profiles;
using TMS.API.Helpers;
using TMS.API.Models;

namespace TMS.API.Services.Profiles
{
    public class ProfileService : IProfileService
    {
        private readonly TMSDbContext _db;

        public ProfileService(TMSDbContext db)
        {
            _db = db;
        }

        public async Task<ProfileDto?> GetMyProfileAsync(int userId)
        {
            var user = await _db.UserAccounts
                .Include(u => u.ApplicationUser)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
                return null;

            return new ProfileDto
            {
                Id = user.Id,
                FullName = user.ApplicationUser.FirstName + " " + user.ApplicationUser.LastName,
                Email = user.ApplicationUser.Email,
                PhoneNumber = user.ApplicationUser.PhoneNumber,
                ProfileImageUrl = user.ApplicationUser.ProfileImageUrl,
                Role = user.Role.ToString(),
                CVPath = (user.Role == UserRole.Trainee || user.Role == UserRole.Supervisor) ? user.CVPath : null
            };
        }

        public async Task<bool> EditProfileAsync(int userId, UpdateProfileDto dto, HttpContext httpContext)
        {
            var user = await _db.Users
                .Include(u => u.UserAccount)
                .FirstOrDefaultAsync(u => u.UserAccount.Id == userId);

            if (user == null) return false;

            // Check if there's a new profile image
            if (dto.ProfileImageFile != null && dto.ProfileImageFile.Length > 0)
            {
                // Delete the old profile image from the server
                FileHelper.DeleteFileFromUrl(user.ProfileImageUrl);

                // Save new profile image using FileHelper class
                user.ProfileImageUrl = await FileHelper.SaveFileAync(dto.ProfileImageFile, httpContext, "images/profiles");
            }

            dto.Adapt(user);

            // Update only for the non-null properties
            _db.Users.Update(user);
            await _db.SaveChangesAsync();

            return true;
        }



        public async Task<bool> UploadCVAsync(int userId, IFormFile cvFile, HttpContext httpContext)
        {
            var user = await _db.UserAccounts.FindAsync(userId);
            if (user == null)
                return false;

            if (user.Role != UserRole.Trainee && user.Role != UserRole.Supervisor)
                return false;

            // حذف القديم
            if (!string.IsNullOrEmpty(user.CVPath))
                FileHelper.DeleteFileFromUrl(user.CVPath);

            if (user.Role == UserRole.Trainee)
                user.CVPath = await FileHelper.SaveFileAync(cvFile, httpContext, "files/cv/trainees");
            else
                user.CVPath = await FileHelper.SaveFileAync(cvFile, httpContext, "files/cv/supervisors");

            await _db.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteCVAsync(int userId)
        {
            var user = await _db.UserAccounts.FindAsync(userId);
            if (user == null ||
                (user.Role != UserRole.Trainee && user.Role != UserRole.Supervisor))
                return false;

            if (string.IsNullOrEmpty(user.CVPath))
                return false;

            FileHelper.DeleteFileFromUrl(user.CVPath);
            user.CVPath = null;

            await _db.SaveChangesAsync();
            return true;
        }


        public async Task<(string? Path, string? FileName)> GetCVDownloadInfoAsync(int userId)
        {
            var user = await _db.UserAccounts.FindAsync(userId);
            if (user == null || string.IsNullOrEmpty(user.CVPath))
                return (null, null);

            // نحاول استخراج المسار النسبي من الرابط الكامل
            var uri = new Uri(user.CVPath);
            var relativePath = uri.AbsolutePath.TrimStart('/'); // "files/cv/..."

            // بناء المسار الفعلي للملف
            var fullPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", relativePath.Replace("/", Path.DirectorySeparatorChar.ToString()));

            if (!System.IO.File.Exists(fullPath))
                return (null, null);

            var fileName = Path.GetFileName(fullPath);
            return (fullPath, fileName);
        }



    }
}
