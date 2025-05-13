using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TMS.API.ConstantClaims;
using TMS.API.DTOs.TrainingPrograms.Requests;
using TMS.API.Helpers;
using TMS.API.Models;
using TMS.API.Services.TrainingPrograms.Trainee;

namespace TMS.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProgramEnrollmentsController : ControllerBase
    {
        private readonly IProgramEnrollmentService programEnrollmentService;

        public ProgramEnrollmentsController(IProgramEnrollmentService programEnrollmentService)
        {
            this.programEnrollmentService = programEnrollmentService;
        }

        [HttpPost("enroll")]
        [Authorize(Roles = StaticData.Trainee)]
        public async Task<IActionResult> Enroll([FromForm] EnrollmentRequestDto request)
        {
            var traineeIdClaim = User.FindFirst("UserAccountId");
            if (traineeIdClaim is null || !int.TryParse(traineeIdClaim.Value, out var traineeId))
                return Unauthorized("Invalid or missing UserAccountId.");

            var result = await programEnrollmentService.EnrollAsync(traineeId, request, HttpContext);

            return result.Success
                ? Ok(result.Message)
                : BadRequest(result.Message);
        }

        [HttpPatch("review/trainee/{traineeId}/program/{programId}")]
        [Authorize(Roles = StaticData.Company)]
        public async Task<IActionResult> ReviewApplication(
            [FromRoute] int traineeId,
            [FromRoute] int programId,
            [FromQuery] bool accept)
        {
            var companyId = int.Parse(User.FindFirst("UserAccountId")!.Value);
            var (success, message) = await programEnrollmentService.ReviewApplicationAsync(traineeId, programId, accept, companyId);
            return success ? Ok($"✅ {message}") : BadRequest($"❌ {message}");
        }

        
        [HttpGet("all-applicants")]
        [Authorize(Roles = StaticData.Company)]
        public async Task<IActionResult> GetAllApplicantsForMyCompany(
            [FromQuery] EnrollmentStatus? status = null,
            [FromQuery] int page = 1,
            [FromQuery] int limit = 10)
        {
            (page, limit) = PaginationHelper.Normalize(page, limit);

            var companyIdClaim = HttpContext.User.FindFirst(CustomClaimNames.UserAccountId);
            if (companyIdClaim == null || !int.TryParse(companyIdClaim.Value, out int companyId))
                return Unauthorized("Invalid company ID");

            var applicants = await programEnrollmentService.GetAllCompanyApplicantsAsync(companyId, status, page, limit);
            return Ok(applicants);
        }

        
        [HttpGet("applicants/{programId}")]
        [Authorize(Roles = StaticData.Company)]
        public async Task<IActionResult> GetApplicants(
            [FromRoute] int programId,
            [FromQuery] EnrollmentStatus? status = null,
            [FromQuery] int page = 1,
            [FromQuery] int limit = 10)
        {
            (page, limit) = PaginationHelper.Normalize(page, limit); 

            var companyId = int.Parse(User.FindFirst("UserAccountId")!.Value);

            var (exists, belongsToCompany, pagedResult) = await programEnrollmentService.GetProgramApplicantsAsync(programId, companyId, status, page, limit);

            if (!exists)
                return NotFound("❌ Training program not found.");

            if (!belongsToCompany)
                return StatusCode(StatusCodes.Status403Forbidden, "⛔ This program does not belong to your company.");

            return Ok(pagedResult);
        }


        [HttpGet("my-enrollments")]
        [Authorize(Roles = StaticData.Trainee)]
        public async Task<IActionResult> GetMyEnrollments(
            [FromQuery] EnrollmentStatus? status,
            [FromQuery] int page = 1,
            [FromQuery] int limit = 10)
        {
            (page, limit) = PaginationHelper.Normalize(page, limit); 

            var traineeId = int.Parse(User.FindFirst("UserAccountId")!.Value);
            var pagedResult = await programEnrollmentService
                .GetTraineeEnrollmentsAsync(traineeId, status, page, limit);

            return Ok(pagedResult);
        }
    }
}
