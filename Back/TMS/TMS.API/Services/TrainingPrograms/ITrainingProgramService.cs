using System.Linq.Expressions;
using TMS.API.Models;

namespace TMS.API.Services.TrainingPrograms
{
    public interface ITrainingProgramService
    {
        IEnumerable<TrainingProgram> GetTrainingPrograms();
        TrainingProgram? Get(Expression<Func<TrainingProgram, bool>> expression);
        TrainingProgram Add(TrainingProgram trainingProgram);
        bool Edit(int id, TrainingProgram trainingProgram);
        bool Remove(int id);
    }
}
