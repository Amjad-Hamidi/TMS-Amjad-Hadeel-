using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TMS.API.ConstantClaims;
using TMS.API.Data;
using TMS.API.DTOs.Profiles;
using TMS.API.Helpers;
using TMS.API.Services.Profiles;
using static HeyRed.Mime.MimeTypesMap;

namespace TMS.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProfilesController : ControllerBase
    {
        private readonly TMSDbContext _db;
        private readonly IProfileService profileService;

        public ProfilesController(TMSDbContext db,
            IProfileService profileService)
        {
            _db = db;
            this.profileService = profileService;
        }



        [HttpGet("all-profiles")]
        [Authorize(Roles = $"{StaticData.Company}, {StaticData.Supervisor}, {StaticData.Trainee}")]
        public async Task<IActionResult> GetAllProfiles(
            [FromQuery] int page = 1,
            [FromQuery] int limit = 10,
            [FromQuery] string? search = null)
        {
            var userIdClaim = User.FindFirst("UserAccountId");
            if (userIdClaim is null || !int.TryParse(userIdClaim.Value, out var userId))
                return Unauthorized("Invalid or missing UserAccountId.");

            var result = await profileService.GetAllAsync(userId, page, limit, search);
            return Ok(result);
        }


        [HttpGet("company-profiles")]
        [Authorize(Roles = $"{StaticData.Company}, {StaticData.Supervisor}, {StaticData.Trainee}")]
        public async Task<IActionResult> GetCompanyProfiles(
        [FromQuery] int page = 1,
        [FromQuery] int limit = 10,
        [FromQuery] string? search = null)
        {
            var userIdClaim = User.FindFirst("UserAccountId");
            if (userIdClaim is null || !int.TryParse(userIdClaim.Value, out var userId))
                return Unauthorized("Invalid or missing UserAccountId.");

            var result = await profileService.GetCompaniesAsync(userId, page, limit, search);
            return Ok(result);
        }


        [HttpGet("supervisor-profiles")]
        [Authorize(Roles = $"{StaticData.Company}, {StaticData.Supervisor}, {StaticData.Trainee}")]
        public async Task<IActionResult> GetSupervisorProfiles(
        [FromQuery] int page = 1,
        [FromQuery] int limit = 10,
        [FromQuery] string? search = null)
        {
            var userIdClaim = User.FindFirst("UserAccountId");
            if (userIdClaim is null || !int.TryParse(userIdClaim.Value, out var userId))
                return Unauthorized("Invalid or missing UserAccountId.");

            var result = await profileService.GetSupervisorsAsync(userId, page, limit, search);
            return Ok(result);
        }


        [HttpGet("trainee-profiles")]
        [Authorize(Roles = $"{StaticData.Company}, {StaticData.Supervisor}, {StaticData.Trainee}")]
        public async Task<IActionResult> GetTraineeProfiles(
        [FromQuery] int page = 1,
        [FromQuery] int limit = 10,
        [FromQuery] string? search = null)
        {
            var userIdClaim = User.FindFirst("UserAccountId");
            if (userIdClaim is null || !int.TryParse(userIdClaim.Value, out var userId))
                return Unauthorized("Invalid or missing UserAccountId.");

            var result = await profileService.GetTraineesAsync(userId, page, limit, search);
            return Ok(result);
        }


        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> GetMyProfile()
        {
            var userId = int.Parse(User.FindFirst(CustomClaimNames.UserAccountId)!.Value);
            var profile = await profileService.GetMyProfileAsync(userId);

            return profile == null
                ? NotFound("User not found.")
                : Ok(profile);
        }
        
        [HttpGet("form-edit-profile")]
        [Authorize]
        public async Task<IActionResult> GetFormEditProfile()
        {
            var userId = int.Parse(User.FindFirst(CustomClaimNames.UserAccountId)!.Value);
            var profile = await profileService.GetEditMyProfileAsync(userId);

            return profile == null
                ? NotFound("User not found.")
                : Ok(profile);
        }

        [HttpGet("{userId:int}")]
        [Authorize]
        public async Task<IActionResult> GetProfileById(int userId)
        {
            var profile = await profileService.GetMyProfileAsync(userId);
            return profile == null ? NotFound("User not found.") : Ok(profile);
        }

        [HttpPatch("update-profile")]
        [Authorize]
        public async Task<IActionResult> UpdateProfile([FromForm] UpdateProfileDto dto)
        {
            var userId = int.Parse(User.FindFirst(CustomClaimNames.UserAccountId)!.Value);
            var result = await profileService.EditProfileAsync(userId, dto, HttpContext);
            return result ? Ok("✅ Profile updated.") : NotFound("❌ User not found.");
        }

        [HttpPatch("upload-cv")]
        [Authorize(Roles = $"{StaticData.Trainee}, {StaticData.Supervisor}")]
        public async Task<IActionResult> UploadCV([FromForm] UploadCVDto cVDto)
        {
            var userId = int.Parse(User.FindFirst(CustomClaimNames.UserAccountId)!.Value);

            var success = await profileService.UploadCVAsync(userId, cVDto.CVFile, HttpContext);
            return success ? Ok("✅ CV uploaded successfully.") : BadRequest("❌ Failed to upload CV.");
        }


        [HttpDelete("delete-cv")]
        [Authorize(Roles = $"{StaticData.Trainee}, {StaticData.Supervisor}")]
        public async Task<IActionResult> DeleteCV()
        {
            var userId = int.Parse(User.FindFirst(CustomClaimNames.UserAccountId)!.Value);
            var success = await profileService.DeleteCVAsync(userId);
            return success ? Ok("🗑️ CV deleted successfully.") : NotFound("❌ No CV to delete.");
        }

        [HttpGet("download-cv")]
        [Authorize(Roles = $"{StaticData.Trainee}, {StaticData.Supervisor}")]
        public async Task<IActionResult> DownloadCV()
        {
            var userId = int.Parse(User.FindFirst(CustomClaimNames.UserAccountId)!.Value);
            var (path, fileName) = await profileService.GetCVDownloadInfoAsync(userId);

            if (string.IsNullOrEmpty(path))
                return NotFound("❌ CV not found.");

            var stream = System.IO.File.OpenRead(path);

            // GetMimeType => is from MimeTypesMap library
            var contentType = GetMimeType(fileName);

            return File(stream, contentType, fileName);
        }

        [HttpGet("download-cv/{userId}")]
        [Authorize]
        //[AllowAnonymous]
        public async Task<IActionResult> DownloadCVForUser([FromRoute] int userId)
        {
            var (path, fileName) = await profileService.GetCVDownloadInfoAsync(userId);

            if (string.IsNullOrEmpty(path))
                return NotFound("❌ CV not found.");

            var stream = System.IO.File.OpenRead(path);

            // GetMimeType => is from MimeTypesMap library
            var contentType = GetMimeType(fileName); 

            return File(stream, contentType, fileName);
        }

        [HttpGet("download-profileImage")]
        [Authorize]
        public async Task<IActionResult> DownloadImage()
        {
            var userId = int.Parse(User.FindFirst(CustomClaimNames.UserAccountId)!.Value);
            var (path, imageName) = await profileService.GetImageDownloadInfoAsync(userId);

            if (string.IsNullOrEmpty(path))
                return NotFound("❌ Image not found.");

            var stream = System.IO.File.OpenRead(path);

            // GetMimeType => is from MimeTypesMap library
            var contentType = GetMimeType(imageName);

            return File(stream, contentType, imageName);
        }

        [HttpDelete("delete-profieImage")]
        [Authorize]
        public async Task<IActionResult> DeleteImage()
        {
            var userId = int.Parse(User.FindFirst(CustomClaimNames.UserAccountId)!.Value);
            var success = await profileService.DeleteImageAsync(userId);
            return success ? Ok("🗑️ Image deleted successfully.") : NotFound("❌ No image to delete.");
        }



    }
}
