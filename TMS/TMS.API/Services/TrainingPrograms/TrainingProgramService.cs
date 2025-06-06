using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using TMS.API.Data;
using TMS.API.Helpers;
using TMS.API.Models;
using TMS.API.Services.TrainingPrograms;

namespace TMS.API.Services.Programs
{
    public class TrainingProgramService : ITrainingProgramService
    {
        private readonly TMSDbContext tMSDbContext;
        private readonly IHttpContextAccessor httpContextAccessor;

        public TrainingProgramService(TMSDbContext tMSDbContext, IHttpContextAccessor httpContextAccessor)
        {
            this.tMSDbContext = tMSDbContext;
            this.httpContextAccessor = httpContextAccessor;
        }

        public async Task<TrainingProgram> AddAsync(TrainingProgram trainingProgram, IFormFile formFile)
        {
            // Check if the Category already exists        // this Id is in the Category.cs
            bool categoryExists = tMSDbContext.Categories.Any(cat => cat.Id == trainingProgram.CategoryId);
            if(!categoryExists) return null; // OR: throw new Exception("Category not found");

            // Check if the Company already exists         // this Id is in the UserAccount.cs (from Identity)
            bool companyExists = tMSDbContext.UserAccounts.Any(com => com.Id == trainingProgram.CompanyId);
            if (!companyExists) return null; // OR: throw new Exception("Company not found");

            // Check if the Supervisor already exists (if sent)      // this Id is in the UserAccount.cs (from Identity)
            if (trainingProgram.SupervisorId != null)
            {
                bool supervisorExists = tMSDbContext.UserAccounts                     // DB عشان يقارنها شو موجودة بال string الى enum تلقائيا بحول ال EF
                    .Any(super => super.Id == trainingProgram.SupervisorId && super.Role == UserRole.Supervisor);
                if (!supervisorExists) return null; // OR: throw new Exception("Supervisor not found");
            }

            var file = formFile;

            if (file != null && file.Length > 0)
            {
                trainingProgram.ImagePath = await FileHelper.SaveFileAync(file, httpContextAccessor.HttpContext);


                /*
                string fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName); // OR:  Guid.NewGuid().ToString() + Path.GetFileName(file.FileName);
                string filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", fileName);
                using (var stream = new FileStream(filePath, FileMode.Create)) // OR: using (var stream = System.IO.File.Create(filePath))
                {
                    file.CopyTo(stream);
                }
                string baseUrl = $"{httpContextAccessor.HttpContext?.Request.Scheme}://{httpContextAccessor.HttpContext?.Request.Host}";
                trainingProgram.ImagePath = $"{baseUrl}/images/{fileName}"; // OR: trainingProgram.ImagePath = fileName;
                */
            }

            tMSDbContext.TrainingPrograms.Add(trainingProgram);
            tMSDbContext.SaveChanges();
            return trainingProgram;
        }

        public async Task<bool> EditAsync(int id, TrainingProgram trainingProgram, IFormFile formFile)
        {
            TrainingProgram? trainingProgramInDb = tMSDbContext.TrainingPrograms.AsNoTracking().FirstOrDefault(tP => tP.TrainingProgramId == id);
            if (trainingProgramInDb == null) return false;

            trainingProgram.TrainingProgramId = id;

            var file = formFile;
            if (file != null && file.Length > 0)
            {
                string fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName); // OR:  Guid.NewGuid().ToString() + Path.GetFileName(file.FileName);
                string filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", fileName);
                using (var stream = new FileStream(filePath, FileMode.Create)) // OR: using (var stream = System.IO.File.Create(filePath))
                {
                    file.CopyTo(stream);
                }
                string baseUrl = $"{httpContextAccessor.HttpContext?.Request.Scheme}://{httpContextAccessor.HttpContext?.Request.Host}";
                trainingProgram.ImagePath = $"{baseUrl}/images/{fileName}"; // OR: trainingProgram.ImagePath = fileName;
            }
            /* // من حاله اصلا بمنعه لما يعدل الا يضيف صورة اجباري
            else
            {
                trainingProgram.ImagePath = trainingProgramInDb.ImagePath;
            }
            */
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

        public async Task<bool> RemoveAsync(int id)
        {
            TrainingProgram? trainingProgramInDb = tMSDbContext.TrainingPrograms.Find(id);
            if (trainingProgramInDb == null) return false;

            // Delete the image file from the server
            string filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", trainingProgramInDb.ImagePath);
            if (System.IO.File.Exists(filePath))
            {
                System.IO.File.Delete(filePath);
            }

            // Remove the training program from the database
            tMSDbContext.TrainingPrograms.Remove(trainingProgramInDb);
            tMSDbContext.SaveChanges();
            return true;
        }
    }
}
