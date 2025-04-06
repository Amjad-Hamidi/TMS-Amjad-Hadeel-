using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using TMS.API.Data;
using TMS.API.Models;
using TMS.API.Services.TrainingPrograms;

namespace TMS.API.Services.Programs
{
    public class TrainingProgramService : ITrainingProgramService
    {
        private readonly TMSDbContext tMSDbContext;

        public TrainingProgramService(TMSDbContext tMSDbContext)
        {
            this.tMSDbContext = tMSDbContext;
        }

        public TrainingProgram Add(TrainingProgram trainingProgram)
        {
            tMSDbContext.TrainingPrograms.Add(trainingProgram);
            tMSDbContext.SaveChanges();
            return trainingProgram;
        }

        public bool Edit(int id, TrainingProgram trainingProgram)
        {
            TrainingProgram? trainingProgramInDb = tMSDbContext.TrainingPrograms.AsNoTracking().FirstOrDefault(tP => tP.TrainingProgramId == id);
            if (trainingProgramInDb == null) return false;

            trainingProgram.TrainingProgramId = id;
            tMSDbContext.TrainingPrograms.Update(trainingProgram);
            tMSDbContext.SaveChanges();
            return true;
        }

        public TrainingProgram? Get(Expression<Func<TrainingProgram, bool>> expression)
        {
            return tMSDbContext.TrainingPrograms.FirstOrDefault(expression);
        }

        public IEnumerable<TrainingProgram> GetTrainingPrograms()
        {
            return tMSDbContext.TrainingPrograms.ToList();
        }

        public bool Remove(int id)
        {
            TrainingProgram? trainingProgramInDb = tMSDbContext.TrainingPrograms.Find(id);
            if (trainingProgramInDb == null) return false;

            tMSDbContext.TrainingPrograms.Remove(trainingProgramInDb);
            tMSDbContext.SaveChanges();
            return true;
        }
    }
}
