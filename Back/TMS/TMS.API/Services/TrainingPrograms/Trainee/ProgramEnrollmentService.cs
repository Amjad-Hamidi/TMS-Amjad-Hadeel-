using Microsoft.EntityFrameworkCore;
using TMS.API.Data;
using TMS.API.DTOs.TrainingPrograms.Requests;
using TMS.API.DTOs.TrainingPrograms.Responses;
using TMS.API.Helpers;
using TMS.API.Models;

namespace TMS.API.Services.TrainingPrograms.Trainee
{
    public class ProgramEnrollmentService : IProgramEnrollmentService
    {
        private readonly TMSDbContext _context;
        public ProgramEnrollmentService(TMSDbContext context)
        {
            _context = context;
        }

        public async Task<(bool Success, string Message)> EnrollAsync(int traineeId, EnrollmentRequestDto request, HttpContext httpContext)
        {
            var program = await _context.TrainingPrograms
               .FirstOrDefaultAsync(p => p.TrainingProgramId == request.TrainingProgramId &&
                                         p.ApprovalStatus == TrainingProgramStatus.Approved);

            if (program == null)
                return (false, "❌ Training program not found.");

            if(program.ApprovalStatus != TrainingProgramStatus.Approved)
                return (false, "❌ Training program is not approved.");

            var alreadyApplied = await _context.ProgramTrainees
                .AnyAsync(pt => pt.TraineeId == traineeId && pt.TrainingProgramId == request.TrainingProgramId);

            if (alreadyApplied)
                return (false, "❌ You have already applied for this program.");

            var cvPath = await FileHelper.SaveFileAync(request.CV, httpContext, "files/cv");

            var enrollment = new ProgramTrainee
            {
                TraineeId = traineeId,
                TrainingProgramId = request.TrainingProgramId,
                CVPath = cvPath,
                Status = EnrollmentStatus.Pending
            };

            await _context.ProgramTrainees.AddAsync(enrollment);
            await _context.SaveChangesAsync();

            return (true, "✅ Enrollment submitted successfully.");
        }


        public async Task<(bool Success, string Message)> ReviewApplicationAsync(int traineeId, int programId, bool accept, int companyId)
        {
            var enrollment = await _context.ProgramTrainees
                .Include(pt => pt.TrainingProgram)
                .FirstOrDefaultAsync(pt => pt.TraineeId == traineeId && pt.TrainingProgramId == programId);

            if (enrollment == null)
                return (false, "❌ Enrollment not found.");

            if (enrollment.TrainingProgram.CompanyId != companyId)
                return (false, "❌ This program does not belong to your company.");

            enrollment.Status = accept ? EnrollmentStatus.Accepted : EnrollmentStatus.Rejected;

            await _context.SaveChangesAsync();
            return (true, accept ? "✅ Application accepted." : "❌ Application rejected.");
        }

        public async Task<IEnumerable<ProgramTrainee>> GetProgramApplicantsAsync(int programId, int companyId)
        {
            return await _context.ProgramTrainees
                .Where(pt => pt.TrainingProgramId == programId &&
                             pt.TrainingProgram.CompanyId == companyId)
                .Include(pt => pt.Trainee).ThenInclude(t => t.ApplicationUser)
                .Include(pt => pt.TrainingProgram)
                .ToListAsync();
        }

        public async Task<IEnumerable<ProgramTrainee>> GetTraineeEnrollmentsAsync(int traineeId)
        {
            return await _context.ProgramTrainees
                .Where(pt => pt.TraineeId == traineeId)
                .Include(pt => pt.TrainingProgram).ThenInclude(tp => tp.Category) 
                .ToListAsync();
        }// كامل TrainingProgram هاي بتجيب معلومات كلاس ال Include(pt => pt.TrainingProgram) 
         // TrainingProgram كامل بعد ما بالبداية قدرنا نوصل لل Category بتجيب معلومات كلاس ال ThenInclude(tp => tp.Category) 
    }
}
