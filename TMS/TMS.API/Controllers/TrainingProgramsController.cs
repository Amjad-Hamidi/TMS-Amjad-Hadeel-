using Mapster;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TMS.API.DTOs.Categories.Requests;
using TMS.API.DTOs.Categories.Responses;
using TMS.API.DTOs.TrainingPrograms.Requests;
using TMS.API.DTOs.TrainingPrograms.Responses;
using TMS.API.Models;
using TMS.API.Services.Categories;
using TMS.API.Services.Programs;
using TMS.API.Services.TrainingPrograms;

namespace TMS.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TrainingProgramsController(ITrainingProgramService trainingProgramService) : ControllerBase
    {
        private readonly ITrainingProgramService trainingProgramService = trainingProgramService;

        [HttpGet("")]
        public IActionResult GetAll()
        {
            var trainingPrograms = trainingProgramService.GetTrainingPrograms();

            return Ok(trainingPrograms.Adapt<IEnumerable<TrainingProgramResponse>>());
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var trainingProgram = trainingProgramService.Get(tP => tP.TrainingProgramId == id);

            return trainingProgram == null ? NotFound() : Ok(trainingProgram.Adapt<TrainingProgramResponse>());
        }

        [HttpPost("")]
        public async Task<IActionResult> Create([FromForm] TrainingProgramRequest trainingProgramRequest)
        {
            // Task بدون TrainingProgram بتخليها ترجع Task<TrainingProgram> لانها هون بترجع AddAsync بتفك ال await
            var trainingProgramInDb = await trainingProgramService.AddAsync(trainingProgramRequest.Adapt<TrainingProgram>(), trainingProgramRequest.ImagePath);

            if (trainingProgramInDb is null)
                return BadRequest("Error creating training program");
            return CreatedAtAction(nameof(GetById), new { id = trainingProgramInDb.TrainingProgramId }, trainingProgramInDb); // Adapt<TrainingProgramResponse>() من حاله بعمل GetTrainingProgramById بس يحوله على
        }
        /*
        [HttpPut("{id}")]
        public async Task<IActionResult> Update([FromRoute] int id, [FromForm] TrainingProgramRequest trainingProgramRequest)
        {
            var trainingProgramInDb = trainingProgramService.EditAsync(id, trainingProgramRequest.Adapt<TrainingProgram>(), trainingProgramRequest.ImagePath);
            if (!trainingProgramInDb)
                return NotFound();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var trainingProgramInDb = trainingProgramService.RemoveAsync(id);
            if (!trainingProgramInDb)
                return NotFound();
            return NoContent();
        }
        */
    }
}
