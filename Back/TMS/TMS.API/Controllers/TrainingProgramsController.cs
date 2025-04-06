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
        public IActionResult GetTrainingProgramById(int id)
        {
            var trainingProgram = trainingProgramService.Get(tP => tP.TrainingProgramId == id);

            return trainingProgram == null ? NotFound() : Ok(trainingProgram.Adapt<TrainingProgramResponse>());
        }

        [HttpPut("{id}")]
        public IActionResult UpdateTrainingProgram([FromRoute] int id, [FromBody] TrainingProgramRequest trainingProgramRequest)
        {
            var trainingProgramInDb = trainingProgramService.Edit(id, trainingProgramRequest.Adapt<TrainingProgram>());
            if (!trainingProgramInDb)
                return NotFound();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var trainingProgramInDb = trainingProgramService.Remove(id);
            if (!trainingProgramInDb)
                return NotFound();
            return NoContent();
        }
    }
}
