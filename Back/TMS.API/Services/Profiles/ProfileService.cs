using Mapster;
using Microsoft.EntityFrameworkCore;
using TMS.API.Data;
using TMS.API.DTOs.Pages;
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

        // display all users except the Admin and the user who uses this service
        public async Task<PagedResult<ProfileDto>> GetAllAsync(int userId, int page, int limit, string? search)
        {
            var query = _db.UserAccounts
                .Where(userAccount => userAccount.Role != UserRole.Admin && userAccount.Id != userId) // OR: userAccount => userAccount.Id != 1 && userAccount.Id != userId
                .Include(userAccount => userAccount.ApplicationUser)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(user =>
                user.Role.ToString().Contains(search)
                || user.Id.ToString().Contains(search)
                || user.ApplicationUser.FirstName.Contains(search)
                || user.ApplicationUser.LastName.Contains(search)
                || user.ApplicationUser.PhoneNumber.Contains(search)
                || user.ApplicationUser.Email.Contains(search)
                );
            }

            var totalCount = await query.CountAsync();

            var pagedItems = await query
                .AsNoTracking()
                .Skip((page - 1) * limit)
                .Take(limit)
                .Select(user => new ProfileDto
                {
                    Id = user.Id,
                    FullName = user.ApplicationUser.FirstName + " " + user.ApplicationUser.LastName,
                    Email = user.ApplicationUser.Email,
                    PhoneNumber = user.ApplicationUser.PhoneNumber,
                    Gender = user.ApplicationUser.Gender,
                    ProfileImageUrl = user.ApplicationUser.ProfileImageUrl,
                    Role = user.Role.ToString(),
                    CVPath = user.CVPath
                })
                .ToListAsync();


            return new PagedResult<ProfileDto>
            {
                Items = pagedItems,
                TotalCount = totalCount,
                Page = page,
                Limit = limit
            };
        }


        // display Companies except the user who uses this service
        public async Task<PagedResult<CompanyProfileDto>> GetCompaniesAsync(int userId, int page, int limit, string? search)
        {
            var query = _db.UserAccounts
                .Where(userAccount => userAccount.Role == UserRole.Company && userAccount.Id != userId)
                .Include(userAccount => userAccount.ApplicationUser)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(user =>
                user.Role.ToString().Contains(search)
                || user.Id.ToString().Contains(search)
                || user.ApplicationUser.FirstName.Contains(search)
                || user.ApplicationUser.LastName.Contains(search)
                || user.ApplicationUser.PhoneNumber.Contains(search)
                || user.ApplicationUser.Email.Contains(search)
                );
            }

            var totalCount = await query.CountAsync();

            var pagedItems = await query
                .AsNoTracking()
                .Skip((page - 1) * limit)
                .Take(limit)
                .Select(user => new CompanyProfileDto
                {
                    Id = user.Id,
                    FullName = user.ApplicationUser.FirstName + " " + user.ApplicationUser.LastName,
                    Email = user.ApplicationUser.Email,
                    PhoneNumber = user.ApplicationUser.PhoneNumber,
                    ProfileImageUrl = user.ApplicationUser.ProfileImageUrl,
                    Role = user.Role.ToString(),
                })
                .ToListAsync();

            return new PagedResult<CompanyProfileDto>
            {
                Items = pagedItems,
                TotalCount = totalCount,
                Page = page,
                Limit = limit
            };
        }


        // display Supervisors except the user who uses this service
        public async Task<PagedResult<ProfileDto>> GetSupervisorsAsync(int userId, int page, int limit, string? search)
        {
            var query = _db.UserAccounts
                .Where(userAccount => userAccount.Role == UserRole.Supervisor && userAccount.Id != userId)
                .Include(userAccount => userAccount.ApplicationUser)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(user =>
                user.Role.ToString().Contains(search)
                || user.Id.ToString().Contains(search)
                || user.ApplicationUser.FirstName.Contains(search)
                || user.ApplicationUser.LastName.Contains(search)
                || user.ApplicationUser.PhoneNumber.Contains(search)
                || user.ApplicationUser.Email.Contains(search)
                );
            }

            var totalCount = await query.CountAsync();

            var pagedItems = await query
                .AsNoTracking()
                .Skip((page - 1) * limit)
                .Take(limit)
                .Select(user => new ProfileDto
                {
                    Id = user.Id,
                    FullName = user.ApplicationUser.FirstName + " " + user.ApplicationUser.LastName,
                    Email = user.ApplicationUser.Email,
                    PhoneNumber = user.ApplicationUser.PhoneNumber,
                    Gender = user.ApplicationUser.Gender,
                    ProfileImageUrl = user.ApplicationUser.ProfileImageUrl,
                    Role = user.Role.ToString(),
                    CVPath = user.CVPath
                })
                .ToListAsync();

            return new PagedResult<ProfileDto>
            {
                Items = pagedItems,
                TotalCount = totalCount,
                Page = page,
                Limit = limit
            };
        }


        // display Trainees except the user who uses this service
        public async Task<PagedResult<ProfileDto>> GetTraineesAsync(int userId, int page, int limit, string? search)
        {
            var query = _db.UserAccounts
                .Where(userAccount => userAccount.Role == UserRole.Trainee && userAccount.Id != userId) 
                .Include(userAccount => userAccount.ApplicationUser)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(user =>
                user.Role.ToString().Contains(search)
                || user.Id.ToString().Contains(search)
                || user.ApplicationUser.FirstName.Contains(search)
                || user.ApplicationUser.LastName.Contains(search)
                || user.ApplicationUser.PhoneNumber.Contains(search)
                || user.ApplicationUser.Email.Contains(search)
                );
            }

            var totalCount = await query.CountAsync();

            var pagedItems = await query
                .AsNoTracking()
                .Skip((page - 1) * limit)
                .Take(limit)
                .Select(user => new ProfileDto
                {
                    Id = user.Id,
                    FullName = user.ApplicationUser.FirstName + " " + user.ApplicationUser.LastName,
                    Email = user.ApplicationUser.Email,
                    PhoneNumber = user.ApplicationUser.PhoneNumber,
                    Gender = user.ApplicationUser.Gender,
                    ProfileImageUrl = user.ApplicationUser.ProfileImageUrl,
                    Role = user.Role.ToString(),
                    CVPath = user.CVPath
                })
                .ToListAsync();

            return new PagedResult<ProfileDto>
            {
                Items = pagedItems,
                TotalCount = totalCount,
                Page = page,
                Limit = limit
            };
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
                Gender = user.ApplicationUser.Gender,
                ProfileImageUrl = user.ApplicationUser.ProfileImageUrl,
                Role = user.Role.ToString(),
                CVPath = (user.Role == UserRole.Trainee || user.Role == UserRole.Supervisor) ? user.CVPath : null
            };
        }

        public async Task<GetEditProfileDto?> GetEditMyProfileAsync(int userId)
        {
            var user = await _db.UserAccounts
                .Include(u => u.ApplicationUser)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
                return null;

            return new GetEditProfileDto
            {           
                FirstName = user.ApplicationUser.FirstName,
                LastName = user.ApplicationUser.LastName,
                UserName = user.ApplicationUser.UserName,
                Email = user.ApplicationUser.Email,
                PhoneNumber = user.ApplicationUser.PhoneNumber,
                Gender = user.ApplicationUser.Gender,
                BirthDate = user.ApplicationUser.BirthDate,
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
