using System.Linq.Expressions;
using TMS.API.Models;

namespace TMS.API.Services.TrainingPrograms
{
    public interface ITrainingProgramService
    {
        IEnumerable<TrainingProgram> GetTrainingPrograms();
        TrainingProgram? Get(Expression<Func<TrainingProgram, bool>> expression);
        Task<TrainingProgram> AddAsync(TrainingProgram trainingProgram, IFormFile file); // IFormFile is used to get the file from the form
        Task<bool> EditAsync(int id, TrainingProgram trainingProgram, IFormFile file); // IFormFile is used to get the file from the form
        Task<bool> RemoveAsync(int id);
    }
}
