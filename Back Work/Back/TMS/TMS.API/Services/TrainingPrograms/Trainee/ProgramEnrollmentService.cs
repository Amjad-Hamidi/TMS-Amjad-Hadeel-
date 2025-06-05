using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using TMS.API.Data;
using TMS.API.DTOs.Pages;
using TMS.API.DTOs.TrainingPrograms.Requests;
using TMS.API.DTOs.TrainingPrograms.Responses;
using TMS.API.DTOs.Users.Trainees;
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

        // just for Trainee (request to join this TP)
        public async Task<(bool Success, string Message)> EnrollAsync(
            int traineeId,
            EnrollmentRequestDto request,
            HttpContext httpContext)
        {
            var program = await _context.TrainingPrograms
               .FirstOrDefaultAsync(p => p.TrainingProgramId == request.TrainingProgramId &&
                                         p.ApprovalStatus == TrainingProgramStatus.Approved);

            if (program == null)
                return (false, "❌ Training program not found.");

            // ✅ تحقق من وجود مقاعد متاحة
            if (program.SeatsAvailable <= 0)
                return (false, "❌ Sorry, no available seats for this program.");

            /* // في هذا الفنكشن 22 لا داعي لفحص مكرر في سطر
            if (program.ApprovalStatus != TrainingProgramStatus.Approved)
                return (false, "❌ Training program is not approved.");
            */

            var alreadyApplied = await _context.ProgramTrainees
                .AnyAsync(pt => pt.TraineeId == traineeId && pt.TrainingProgramId == request.TrainingProgramId);

            if (alreadyApplied)
                return (false, "❌ You have already applied for this program.");

            var cvPath = await FileHelper.SaveFileAync(request.CV, httpContext, "files/cv/applications");

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

        // just for Comapny (review specific applicant requests for specific TP, not to others) and determinate approve/reject
        public async Task<(bool Success, string Message)> ReviewApplicationAsync(
            int traineeId, 
            int programId,
            bool accept,
            int companyId)
        {
            var enrollment = await _context.ProgramTrainees
                .Include(pt => pt.TrainingProgram)
                .FirstOrDefaultAsync(pt => pt.TraineeId == traineeId && pt.TrainingProgramId == programId);

            if (enrollment == null)
                return (false, "❌ Enrollment not found.");

            if (enrollment.TrainingProgram.CompanyId != companyId)
                return (false, "❌ This program does not belong to your company.");

            // 🔒 لحماية الطلبات من التعديل بعد المراجعة من قبل الشركة
            if (enrollment.Status != EnrollmentStatus.Pending)
                return (false, "❌ This application has already been reviewed.");

            if (enrollment.TrainingProgram.SeatsAvailable <= 0)
                return (false, "❌ No available seats.");

            if (accept)
            {
                enrollment.TrainingProgram.SeatsAvailable -= 1;
            }
            enrollment.Status = accept ? EnrollmentStatus.Accepted : EnrollmentStatus.Rejected;


            await _context.SaveChangesAsync();
            return (true, accept ? "✅ Application accepted." : "❌ Application rejected.");
        }

        // just for Company (get all aplicants/some applicants just to it, not to others)
        public async Task<PagedResult<ApplicantDto>> GetAllCompanyApplicantsAsync
            (int companyId, 
            string? search, 
            EnrollmentStatus? status,
            int page, int limit)
        {   
            var query = _context.ProgramTrainees
                .Where(pt => pt.TrainingProgram.CompanyId == companyId)
                .Include(pt => pt.Trainee).ThenInclude(t => t.ApplicationUser)
                .Include(pt => pt.TrainingProgram)
                .AsNoTracking()
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                search = search.Trim().ToLower();
                query = query.Where(pt =>
                    // match by trainee’s full name or supervisor name or email or program title or program id
                    (pt.Trainee.ApplicationUser.FirstName + " " + pt.Trainee.ApplicationUser.LastName).ToLower().Contains(search) ||
                    (pt.TrainingProgram.Supervisor.ApplicationUser.FirstName + " " + pt.TrainingProgram.Supervisor.ApplicationUser.LastName).ToLower().Contains(search) ||
                    pt.Trainee.ApplicationUser.Email.ToLower().Contains(search) ||
                    pt.TrainingProgram.Title.ToLower().Contains(search) ||
                    pt.TrainingProgram.TrainingProgramId.ToString().Contains(search) ||
                    pt.TrainingProgram.Description.ToLower().Contains(search) ||
                    pt.TrainingProgram.Category.Name.ToLower().Contains(search) ||
                    pt.TrainingProgram.Location.ToLower().Contains(search)
                    );
            }

            if (status.HasValue) // not null
            {
                query = query.Where(pt => pt.Status == status.Value);
            }

            var total = await query.CountAsync(); // number of all items

            //if null => pick all applicants regardless wich its Status (Pending/Accepted/Rejected)
            var items =  await query
                .OrderByDescending(pt => pt.EnrolledAt)
                .Skip((page - 1) * limit)
                .Take(limit)
                .Select(pt => new ApplicantDto
                {
                    TraineeId = pt.TraineeId,
                    ProfileImageUrl = pt.Trainee.ApplicationUser.ProfileImageUrl,
                    FullName = pt.Trainee.ApplicationUser.FirstName + " " + pt.Trainee.ApplicationUser.LastName,
                    Email = pt.Trainee.ApplicationUser.Email,
                    CVPath = pt.CVPath,
                    Status = pt.Status,
                    EnrolledAt = pt.EnrolledAt,
                    TrainingProgramId = pt.TrainingProgramId,
                    ProgramTitle = pt.TrainingProgram.Title
                })
                .ToListAsync();

            return new PagedResult<ApplicantDto> { Items = items, TotalCount = total, Page = page, Limit = limit }; // TotalCount: total counts of all elements based in the Status
        }

        // just for Company (get all aplicants for a specific TP just to it, not to others)
        public async Task<(bool Exists, bool BelongsToCompany, PagedResult<ApplicantDto>?)> GetProgramApplicantsAsync(
            int programId,
            string? search,
            int companyId, 
            EnrollmentStatus? status, 
            int page, int limit)
        {
            var program = await _context.TrainingPrograms
                .FirstOrDefaultAsync(p => p.TrainingProgramId == programId);

            if (program == null)
                return (false, false, null);

            if (program.CompanyId != companyId)
                return (true, false, null);

            var query = _context.ProgramTrainees
              .Where(pt => pt.TrainingProgramId == programId)
              .Include(pt => pt.Trainee).ThenInclude(t => t.ApplicationUser)
              .AsNoTracking()
              .AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                search = search.Trim().ToLower();
                query = query.Where(pt =>
                    // match by trainee’s full name or supervisor name or email or program title or program id
                    (pt.Trainee.ApplicationUser.FirstName + " " + pt.Trainee.ApplicationUser.LastName).ToLower().Contains(search) ||
                    (pt.TrainingProgram.Supervisor.ApplicationUser.FirstName + " " + pt.TrainingProgram.Supervisor.ApplicationUser.LastName).ToLower().Contains(search) ||
                    pt.Trainee.ApplicationUser.Email.ToLower().Contains(search) ||
                    pt.TrainingProgram.Title.ToLower().Contains(search) ||
                    pt.TrainingProgram.TrainingProgramId.ToString().Contains(search) ||
                    pt.TrainingProgram.Description.ToLower().Contains(search) ||
                    pt.TrainingProgram.Category.Name.ToLower().Contains(search) ||
                    pt.TrainingProgram.Location.ToLower().Contains(search)
                    );
            }

            if (status.HasValue) // not null
            {
                query = query.Where(pt => pt.Status == status.Value);
            }

            var total = await query.CountAsync();

            //if null => pick all applicants to this TP regardless wich its Status (Pending/Accepted/Rejected)
            var items = await query
               .OrderByDescending(pt => pt.EnrolledAt)
               .Skip((page - 1) * limit)
               .Take(limit)
               .Select(pt => new ApplicantDto
               {
                   TraineeId = pt.TraineeId,
                   ProfileImageUrl = pt.Trainee.ApplicationUser.ProfileImageUrl,
                   FullName = pt.Trainee.ApplicationUser.FirstName + " " + pt.Trainee.ApplicationUser.LastName,
                   Email = pt.Trainee.ApplicationUser.Email,
                   CVPath = pt.CVPath,
                   Status = pt.Status,
                   EnrolledAt = pt.EnrolledAt,
                   TrainingProgramId = pt.TrainingProgramId,
                   ProgramTitle = pt.TrainingProgram.Title
               })
               .ToListAsync();

            var pagedResult = new PagedResult<ApplicantDto>
            {
                Items = items,
                TotalCount = total, // total counts of all elements based in the Status
                Page = page,
                Limit = limit
            };

            return (true, true, pagedResult);
        }

        // just for Trainee (get all applicants that he submitted to all companies), (Pending/Accepted/Rejected)
        public async Task<PagedResult<TraineeEnrollmentDto>> GetTraineeEnrollmentsAsync(
            int traineeId,
            string? search,
            EnrollmentStatus? status = null,
            int page = 1,
            int limit = 10)
        {
            var query = _context.ProgramTrainees
                   .Where(pt => pt.TraineeId == traineeId)
                   .Include(pt => pt.TrainingProgram).ThenInclude(tp => tp.Category)
                   .AsNoTracking()
                   .AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                search = search.Trim().ToLower();
                query = query.Where(pt =>
                    // match by trainee’s full name or supervisor name or email or program title or program id
                    (pt.Trainee.ApplicationUser.FirstName + " " + pt.Trainee.ApplicationUser.LastName).ToLower().Contains(search) ||
                    (pt.TrainingProgram.Supervisor.ApplicationUser.FirstName + " " + pt.TrainingProgram.Supervisor.ApplicationUser.LastName).ToLower().Contains(search) ||
                    pt.Trainee.ApplicationUser.Email.ToLower().Contains(search) ||
                    pt.TrainingProgram.Title.ToLower().Contains(search) ||
                    pt.TrainingProgram.TrainingProgramId.ToString().Contains(search) ||
                    pt.TrainingProgram.Description.ToLower().Contains(search) ||
                    pt.TrainingProgram.Category.Name.ToLower().Contains(search) ||
                    pt.TrainingProgram.Location.ToLower().Contains(search)
                    );
            }

            if (status.HasValue)
                query = query.Where(pt => pt.Status == status.Value);

            var total = await query.CountAsync();

            var items = await query
                .OrderByDescending(pt => pt.EnrolledAt) // الاحدث اولا
                .Skip((page - 1) * limit)
                .Take(limit)
                .Select(pt => new TraineeEnrollmentDto
                {
                    TrainingProgramId = pt.TrainingProgramId,
                    Title = pt.TrainingProgram.Title,
                    ImagePath = pt.TrainingProgram.ImagePath,
                    Description = pt.TrainingProgram.Description,
                    CategoryName = pt.TrainingProgram.Category.Name,
                    StartDate = pt.TrainingProgram.StartDate,
                    EndDate = pt.TrainingProgram.EndDate,
                    Location = pt.TrainingProgram.Location,
                    ContentUrl = pt.TrainingProgram.ContentUrl,
                    ClassroomUrl = pt.TrainingProgram.ClassroomUrl,
                    SupervisorName = $"{pt.TrainingProgram.Supervisor.ApplicationUser.FirstName} {pt.TrainingProgram.Supervisor.ApplicationUser.LastName}",
                    Status = pt.Status
                })
                .ToListAsync();

            return new PagedResult<TraineeEnrollmentDto>
            {
                Items = items,
                TotalCount = total, // total counts of all elements based in the Status
                Page = page,
                Limit = limit
            };




        }// كامل TrainingProgram هاي بتجيب معلومات كلاس ال Include(pt => pt.TrainingProgram) 
         // TrainingProgram كامل بعد ما بالبداية قدرنا نوصل لل Category بتجيب معلومات كلاس ال ThenInclude(tp => tp.Category) 
   
    
    }
}
