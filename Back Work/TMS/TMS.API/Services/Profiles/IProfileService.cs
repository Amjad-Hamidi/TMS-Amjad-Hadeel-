using TMS.API.DTOs.Pages;
using TMS.API.DTOs.Profiles;

namespace TMS.API.Services.Profiles
{
    public interface IProfileService
    {
        Task<PagedResult<ProfileDto>> GetAllAsync(int userId, int page, int limit, string? search);
        Task<PagedResult<CompanyProfileDto>> GetCompaniesAsync(int userId, int page, int limit, string? search);
        Task<PagedResult<ProfileDto>> GetSupervisorsAsync(int userId, int page, int limit, string? search);
        Task<PagedResult<ProfileDto>> GetTraineesAsync(int userId, int page, int limit, string? search);
        Task<ProfileDto?> GetMyProfileAsync(int userId);
        Task<GetEditProfileDto?> GetEditMyProfileAsync(int userId);
        Task<bool> EditProfileAsync(int userId, UpdateProfileDto updateUserDto, HttpContext httpContext);
        Task<bool> UploadCVAsync(int userId, IFormFile cvFile, HttpContext httpContext);
        Task<bool> DeleteCVAsync(int userId);
        Task<(string? Path, string? FileName)> GetCVDownloadInfoAsync(int userId);
    }
}
