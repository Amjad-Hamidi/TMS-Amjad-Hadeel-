using Mapster;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TMS.API.ConstantClaims;
using TMS.API.DTOs.Pages;
using TMS.API.DTOs.TrainingPrograms.Requests;
using TMS.API.DTOs.TrainingPrograms.Responses;
using TMS.API.Helpers;
using TMS.API.Services.TrainingPrograms.All_except_Trainee;

namespace TMS.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class TrainingProgramsController(ITrainingProgramService trainingProgramService) : ControllerBase
    {
        private readonly ITrainingProgramService trainingProgramService = trainingProgramService;

        // only for Approved Programs (it suits for all actors except guest)
        [HttpGet("")] 
        public async Task<IActionResult> GetAll([FromQuery] string? search, [FromQuery] int page, [FromQuery] int limit = 10)
        {
            (page, limit) = PaginationHelper.Normalize(page, limit);

            var result = await trainingProgramService.GetAsyncWithCondWithoutDetails(search, page, limit);

            return Ok(new PagedResult<ResponseProgramDto>
            {
                Items = result.Items.Adapt<IEnumerable<ResponseProgramDto>>(),
                TotalCount = result.TotalCount,
                Page = result.Page,
                Limit = result.Limit
            });
        }

        // only for Approved Programs (it suits for all actors except guest)
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            var trainingProgram = await trainingProgramService.GetOneAsyncWithoutDetails(id);

            return trainingProgram == null ? NotFound() : Ok(trainingProgram.Adapt<ResponseProgramDto>());
        }

        [HttpPost("")]
        [Authorize(Roles = $"{StaticData.Admin}, {StaticData.Company}")]
        public async Task<IActionResult> Create([FromForm] AddTrainingProgramDto addTrainingProgramDto)
        {
            if (!ModelState.IsValid) // StartDate = default مفيدة جدا اذا دخل مثلا
                return BadRequest(ModelState);

            try
            {
                var createdProgram = await trainingProgramService.AddAsync(addTrainingProgramDto, HttpContext);
                return CreatedAtAction(nameof(GetById), new { id = createdProgram.TrainingProgramId }, createdProgram.Adapt<ResponseProgramDto>());
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }

        }



        [HttpPatch("{id}")]
        [Authorize(Roles = $"{StaticData.Admin}, {StaticData.Company}")]
        public async Task<IActionResult> Update([FromRoute] int id ,[FromForm] UpdateTrainingProgramDto updateTrainingProgramDto)
        {
            if (!ModelState.IsValid) // StartDate = default مفيدة جدا اذا دخل مثلا
                return BadRequest(ModelState);

            try
            {
                var updated = await trainingProgramService.EditAsync(id, updateTrainingProgramDto, HttpContext);
                if (!updated)
                    return NotFound($"Program with Id {id} not found.");
                return NoContent();
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = $"{StaticData.Admin}")]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            var deleted = await trainingProgramService.RemoveAsync(id, CancellationToken.None);
            if (!deleted)
                return NotFound($"This program with Id {id} not found to delete.");
            return NoContent();
        }

        [HttpDelete("delete-all")]
        [Authorize(Roles = $"{StaticData.Admin}")]
        public async Task<IActionResult> DeleteAll()
        {
            var deleted = await trainingProgramService.RemoveAllAsync(CancellationToken.None);
            if (!deleted)
                return NotFound("No programs found to delete");
            return NoContent();
        }



        [HttpPatch("approve/{id}")]
        [Authorize(Roles = StaticData.Admin)]
        public async Task<IActionResult> ApproveProgram([FromRoute] int id)
        {
            var result = await trainingProgramService.ApproveAsync(id);

            return result switch
            {
                ProgramActionResult.NotFound => NotFound("❌ Program not found."),
                ProgramActionResult.AlreadyApproved => BadRequest("ℹ️ This program is already approved."),
                ProgramActionResult.AlreadyRejected => BadRequest("❌ Cannot approve a rejected program."),
                ProgramActionResult.Approved => Ok("✅ Program approved successfully."),
                _ => StatusCode(500, "⚠️ Unexpected error.")
            };
        }

        [HttpGet("all-pending")]
        [Authorize(Roles = StaticData.Admin)]
        public async Task<IActionResult> GetPendingPrograms([FromQuery] int page = 1, [FromQuery] int limit = 10)
        {
            (page, limit) = PaginationHelper.Normalize(page, limit);

            var result = await trainingProgramService.GetPendingAsync(page, limit);

            return Ok(new PagedResult<PendingProgramDto>
            {
                Items = result.Items.Adapt<IEnumerable<PendingProgramDto>>(),
                TotalCount = result.TotalCount,
                Page = result.Page,
                Limit = result.Limit
            });
        }

        [HttpGet("my-pending")]
        [Authorize(Roles = StaticData.Company)]
        public async Task<IActionResult> GetMyPendingPrograms([FromQuery] int page = 1, [FromQuery] int limit = 10)
        {
            (page, limit) = PaginationHelper.Normalize(page, limit);

            var companyIdClaim = HttpContext.User.Claims.FirstOrDefault(c => c.Type == "UserAccountId");
            if (companyIdClaim == null)
                return Unauthorized("UserAccountId claim not found.");

            int companyId = int.Parse(companyIdClaim.Value);
            var pendingPrograms = await trainingProgramService.GetPendingByCompanyAsync(companyId, page, limit);
            return Ok(pendingPrograms.Adapt<IEnumerable<PendingProgramDto>>());
        }


        [HttpPatch("reject/{id}")]
        [Authorize(Roles = StaticData.Admin)]
        public async Task<IActionResult> RejectProgram([FromRoute] int id,[FromQuery] string reason)
        {
            if (string.IsNullOrWhiteSpace(reason))
                return BadRequest("Rejection reason is required.");

            var result = await trainingProgramService.RejectAsync(id, reason);

            return result switch
            {
                ProgramActionResult.NotFound => NotFound("❌ Program not found."),
                ProgramActionResult.AlreadyRejected => BadRequest("ℹ️ Program is already rejected."),
                ProgramActionResult.AlreadyApproved => BadRequest("❌ Cannot reject an approved program."),
                ProgramActionResult.Rejected => Ok("❌ Program rejected successfully."),
                _ => StatusCode(500, "⚠️ Unexpected error.")
            };
        }

        [HttpGet("all-rejected")]
        [Authorize(Roles = $"{StaticData.Admin}")]
        public async Task<IActionResult> GetRejectedPrograms([FromQuery] int page = 1, [FromQuery] int limit = 10)
        {
            (page, limit) = PaginationHelper.Normalize(page, limit);

            var result = await trainingProgramService.GetRejectedAsync(page, limit);

            return Ok(new PagedResult<RejectedAdminProgramDto>
            {
                Items = result.Items.Adapt<IEnumerable<RejectedAdminProgramDto>>(),
                TotalCount = result.TotalCount,
                Page = result.Page,
                Limit = result.Limit
            });
        }

        [HttpGet("my-rejected")]
        [Authorize(Roles = StaticData.Company)]
        public async Task<IActionResult> GetMyRejectedPrograms([FromQuery] int page = 1, [FromQuery] int limit = 10)
        {
            (page, limit) = PaginationHelper.Normalize(page, limit);

            var companyIdClaim = HttpContext.User.FindFirst("UserAccountId");
            if (companyIdClaim == null)
                return Unauthorized("UserAccountId claim not found.");

            if (!int.TryParse(companyIdClaim.Value, out int companyId))
                return BadRequest("Invalid UserAccountId claim.");

            var result = await trainingProgramService.GetRejectedByCompanyAsync(companyId, page, limit);

            return Ok(new PagedResult<RejectedCompanyProgramDto>
            {
                Items = result.Items.Adapt<IEnumerable<RejectedCompanyProgramDto>>(),
                TotalCount = result.TotalCount,
                Page = result.Page,
                Limit = result.Limit
            });
        }

        [HttpGet("my-approved")]
        [Authorize(Roles = StaticData.Company)]
        public async Task<IActionResult> GetMyApprovedPrograms([FromQuery] int page = 1, [FromQuery] int limit = 10)
        {
            (page, limit) = PaginationHelper.Normalize(page, limit);

            var companyIdClaim = HttpContext.User.Claims.FirstOrDefault(c => c.Type == CustomClaimNames.UserAccountId);
            if (companyIdClaim == null)
                return Unauthorized("UserAccountId claim not found.");

            int companyId = int.Parse(companyIdClaim.Value);
            var result = await trainingProgramService.GetApprovedByCompanyAsync(companyId, page, limit);

            return Ok(new PagedResult<ApprovedProgramDto>
            {
                Items = result.Items.Adapt<IEnumerable<ApprovedProgramDto>>(),
                TotalCount = result.TotalCount,
                Page = result.Page,
                Limit = result.Limit
            });
        }

        [HttpGet("my-supervised")]
        [Authorize(Roles = StaticData.Supervisor)]
        public async Task<IActionResult> GetMySupervisedPrograms([FromQuery] int page = 1, [FromQuery] int limit = 10)
        {
            (page, limit) = PaginationHelper.Normalize(page, limit); // Separation of Concerns (SoC) & Single of Responsibility (SoR)

            var supervisorIdClaim = HttpContext.User.Claims.FirstOrDefault(c => c.Type == CustomClaimNames.UserAccountId);
            if (supervisorIdClaim == null)
                return Unauthorized("UserAccountId claim not found.");

            int supervisorId = int.Parse(supervisorIdClaim.Value);
            var result = await trainingProgramService.GetBySupervisorAsync(supervisorId, page, limit);

            return Ok(new PagedResult<SupervisedProgramDto>
            {
                Items = result.Items.Adapt<IEnumerable<SupervisedProgramDto>>(),
                TotalCount = result.TotalCount,
                Page = result.Page,
                Limit = result.Limit
            });
        }


    }
}
