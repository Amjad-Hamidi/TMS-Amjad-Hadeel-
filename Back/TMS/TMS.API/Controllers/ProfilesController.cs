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

        [HttpGet("{userId}")]
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
        [Authorize(Roles = $"{StaticData.Admin}, {StaticData.Company}")]
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




    }
}
