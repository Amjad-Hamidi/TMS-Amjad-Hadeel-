using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TMS.API.DTOs.TrainingPrograms.Requests;
using TMS.API.Helpers;
using TMS.API.Services.TrainingPrograms.Trainee;

namespace TMS.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProgramEnrollmentsController : ControllerBase
    {
        private readonly IProgramEnrollmentService _service;

        public ProgramEnrollmentsController(IProgramEnrollmentService service)
        {
            _service = service;
        }

        [HttpPost("enroll")]
        [Authorize(Roles = StaticData.Trainee)]
        public async Task<IActionResult> Enroll([FromForm] EnrollmentRequestDto request)
        {
            var traineeIdClaim = User.FindFirst("UserAccountId");
            if (traineeIdClaim is null || !int.TryParse(traineeIdClaim.Value, out var traineeId))
                return Unauthorized("Invalid or missing UserAccountId.");

            var result = await _service.EnrollAsync(traineeId, request, HttpContext);

            return result.Success
                ? Ok(result.Message)
                : BadRequest(result.Message);
        }

        [HttpPatch("review")]
        [Authorize(Roles = StaticData.Company)]
        public async Task<IActionResult> ReviewApplication([FromQuery] int traineeId, [FromQuery] int programId, [FromQuery] bool accept)
        {
            var companyId = int.Parse(User.FindFirst("UserAccountId")!.Value);
            var (success, message) = await _service.ReviewApplicationAsync(traineeId, programId, accept, companyId);
            return success ? Ok($"✅ {message}") : BadRequest($"❌ {message}");
        }

        [HttpGet("applicants/{programId}")]
        [Authorize(Roles = StaticData.Company)]
        public async Task<IActionResult> GetApplicants(int programId)
        {
            var companyId = int.Parse(User.FindFirst("UserAccountId")!.Value);
            var applicants = await _service.GetProgramApplicantsAsync(programId, companyId);
            return Ok(applicants);
        }

        [HttpGet("my-enrollments")]
        [Authorize(Roles = StaticData.Trainee)]
        public async Task<IActionResult> GetMyEnrollments()
        {
            var traineeId = int.Parse(User.FindFirst("UserAccountId")!.Value);
            var enrollments = await _service.GetTraineeEnrollmentsAsync(traineeId);
            return Ok(enrollments);
        }
    }
}
