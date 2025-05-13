using TMS.API.DTOs.Profiles;

namespace TMS.API.Services.Profiles
{
    public interface IProfileService
    {
        Task<ProfileDto?> GetMyProfileAsync(int userId);
        Task<bool> EditProfileAsync(int userId, UpdateProfileDto updateUserDto, HttpContext httpContext);
        Task<bool> UploadCVAsync(int userId, IFormFile cvFile, HttpContext httpContext);
        Task<bool> DeleteCVAsync(int userId);
        Task<(string? Path, string? FileName)> GetCVDownloadInfoAsync(int userId);
    }
}
