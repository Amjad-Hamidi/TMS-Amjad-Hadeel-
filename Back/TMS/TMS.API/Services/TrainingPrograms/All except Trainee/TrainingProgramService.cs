using Mapster;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using TMS.API.ConstantClaims;
using TMS.API.Data;
using TMS.API.DTOs.Pages;
using TMS.API.DTOs.TrainingPrograms.Requests;
using TMS.API.Helpers;
using TMS.API.Models;
using TMS.API.Services.IService;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace TMS.API.Services.TrainingPrograms.All_except_Trainee
{
    public enum ProgramActionResult
    {
        NotFound,
        AlreadyApproved,
        AlreadyRejected,
        Rejected,
        Approved
    }


    public class TrainingProgramService : Service<TrainingProgram>, ITrainingProgramService
    {
        private readonly TMSDbContext tMSDbContext;

        public TrainingProgramService(TMSDbContext tMSDbContext) : base(tMSDbContext)
        {
            this.tMSDbContext = tMSDbContext;
        }


        // only for Approved Programs (it suits for all actors except guest)
        public async Task<PagedResult<TrainingProgram>> GetAsyncWithCondWithoutDetails(string? search, int page, int limit)
        {
            if (page < 1)
                page = 1;
            if (limit < 1)
                limit = 10; // العاشر, فشق عن اول عشرة TrainingProgram بلش من ال


            var query = tMSDbContext.TrainingPrograms
                .Where(tp => tp.ApprovalStatus == TrainingProgramStatus.Approved)
                .Include(tp => tp.Category)
                .Include(tp => tp.Company).ThenInclude(c => c.ApplicationUser) // CompanyName from ApplicationUser
                .Include(tp => tp.Supervisor).ThenInclude(s => s.ApplicationUser) // SupervisorName from ApplicationUser
                .AsNoTracking()
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(tp =>
                    tp.Title.Contains(search) ||
                    tp.Description.Contains(search));
            }

            var total = await query.CountAsync();

            // Apply pagination
            var items = query
                .Skip((page - 1) * limit)
                .Take(limit);

            //return await trainingPrograms.ToListAsync();
            return new PagedResult<TrainingProgram>
            {
                Items = items,
                TotalCount = total,
                Page = page,
                Limit = limit
            };
        }
        

        // only for Approved Programs (it suits for all actors except guest)
        public async Task<TrainingProgram?> GetOneAsyncWithoutDetails(int id)
        {
            var trainingProgram = await tMSDbContext.TrainingPrograms
                .Include(tp => tp.Category)
                .Include(tp => tp.Company).ThenInclude(c => c.ApplicationUser) // CompanyName from ApplicationUser
                .Include(tp => tp.Supervisor).ThenInclude(s => s.ApplicationUser) // SupervisorName from ApplicationUser
                .AsNoTracking()
                .FirstOrDefaultAsync(tp => tp.TrainingProgramId == id
                && tp.ApprovalStatus == TrainingProgramStatus.Approved);

            return trainingProgram;
        }


        // only for Company => make a request to Admin, Admin => accept/reject the pending requests (he can also add manually)
        public async Task<TrainingProgram> AddAsync(AddTrainingProgramDto addTrainingProgramDto, HttpContext httpContext)
        {
            var role = httpContext.User.FindFirst(ClaimTypes.Role)?.Value;
            var userIdClaim = httpContext.User.FindFirst(CustomClaimNames.UserAccountId)?.Value;
            if (role == null || userIdClaim == null)
                throw new ArgumentException("User role or ID not found in claims.");

            // تحديد الشركة المرسلة
            if (role == "Company")
            {
                addTrainingProgramDto.CompanyId = int.Parse(userIdClaim); // منع الإرسال اليدوي
            }
            else if (role == "Admin")
            {
                if (addTrainingProgramDto.CompanyId == null)
                    throw new ArgumentException("CompanyId is required for Admin.");
            }
            else
            {
                throw new UnauthorizedAccessException("Only Admin or Company can create programs.");
            }


            var companyExists = await tMSDbContext.UserAccounts
                .AnyAsync(userAccount => userAccount.Id == addTrainingProgramDto.CompanyId
                 && userAccount.Role == UserRole.Company);
            if (!companyExists)
                throw new ArgumentException("Invalid CompanyId."); // Controller لل BadRequest() 400 على طول برجع throw new ArgumentException("")

            var categoryExists = await tMSDbContext.Categories
                .AnyAsync(category => category.Id == addTrainingProgramDto.CategoryId);
            if (!categoryExists)
                throw new ArgumentException("Invalid CategoryId.");

            if (addTrainingProgramDto.SupervisorId == null)
                throw new ArgumentException("SupervisorId is required.");

            var supervisorExists = await tMSDbContext.UserAccounts
                .AnyAsync(userAccount => userAccount.Id == addTrainingProgramDto.SupervisorId
                && userAccount.Role == UserRole.Supervisor);
            if (!supervisorExists)
                throw new ArgumentException("Invalid SupervisorId.");

            var now = DateTime.Now;
            if (addTrainingProgramDto.StartDate < now)
                throw new ArgumentException($"Start date must be in the future.");
            if (addTrainingProgramDto.EndDate <= addTrainingProgramDto.StartDate)
                throw new ArgumentException("End date must be after start date.");

            var duration = addTrainingProgramDto.EndDate - addTrainingProgramDto.StartDate;
            if (duration.TotalDays < 7 || duration.TotalDays > 365)
                throw new ArgumentException("Duration must be between 1 week and 1 year.");

            var trainingProgram = addTrainingProgramDto.Adapt<TrainingProgram>();
            trainingProgram.CreatedAt = DateTime.Now;
            trainingProgram.DurationInDays = duration.TotalDays; // return double (fractional days)

            trainingProgram.ImagePath = await FileHelper.SaveFileAync(addTrainingProgramDto.ImageFile, httpContext, "images/programs");

            trainingProgram.ApprovalStatus = role == "Admin"
                ? TrainingProgramStatus.Approved
                : TrainingProgramStatus.Pending;

            await tMSDbContext.TrainingPrograms.AddAsync(trainingProgram);
            await tMSDbContext.SaveChangesAsync();

            // Load the related entities
            var result = await tMSDbContext.TrainingPrograms
                .Include(tp => tp.Category) // equivalent to => trainingProgram.Category = await tMSDbContext.Categories.FindAsync(trainingProgram.CategoryId);
                .Include(tp => tp.Company).ThenInclude(comp => comp.ApplicationUser) // equivalent to => trainingProgram.Company = await tMSDbContext.UserAccounts.FindAsync(trainingProgram.CompanyId);
                .Include(tp => tp.Supervisor).ThenInclude(sup => sup.ApplicationUser) // equivalent to => trainingProgram.Supervisor = await tMSDbContext.UserAccounts.FindAsync(trainingProgram.SupervisorId);
                .FirstOrDefaultAsync(tp => tp.TrainingProgramId == trainingProgram.TrainingProgramId);

            return result!;
        }


        // only for Company & Admin (with ensuring that the TP is for this Company not to others & Editting is for Pending TP only)
        public async Task<bool> EditAsync(int id, UpdateTrainingProgramDto updateTrainingProgramDto, HttpContext httpContext)
        {
            var trainingProgramInDb = await tMSDbContext.TrainingPrograms
                .FirstOrDefaultAsync(tp => tp.TrainingProgramId == id);
            if (trainingProgramInDb == null) return false;

            var role = httpContext.User.FindFirst(ClaimTypes.Role)?.Value;
            var userIdClaim = httpContext.User.FindFirst(CustomClaimNames.UserAccountId)?.Value;

            if (role == "Company" && trainingProgramInDb.CompanyId != int.Parse(userIdClaim)) // اذا مش هو معناها في شركة ثانية بتحاول تعدل على برنامج شركة غيرها ApplicationUserId عبارة عن userIdClaim ال 
            {
                throw new UnauthorizedAccessException("You can only edit your own training programs.");
            }

            // approved/rejected اضافة حماية: ممنوع تعديل برامج
            if (trainingProgramInDb.ApprovalStatus != TrainingProgramStatus.Pending)
                throw new InvalidOperationException("Only pending programs can be edited.");

            // تحقق من التصنيف
            if (updateTrainingProgramDto.CategoryId != null)
            {
                var categoryExists = await tMSDbContext.Categories
                    .AnyAsync(category => category.Id == updateTrainingProgramDto.CategoryId);
                if (!categoryExists)
                    throw new ArgumentException("Invalid CategoryId.");
            }

            // تحقق من المشرف
            if (updateTrainingProgramDto.SupervisorId == null)
                throw new ArgumentException("SupervisorId is required.");

            var supervisorExists = await tMSDbContext.UserAccounts
                .AnyAsync(userAccount => userAccount.Id == updateTrainingProgramDto.SupervisorId
                && userAccount.Role == UserRole.Supervisor);
            if (!supervisorExists)
                throw new ArgumentException("Invalid SupervisorId.");

            var now = DateTime.Now;
            DateTime? startDate = updateTrainingProgramDto.StartDate ?? trainingProgramInDb.StartDate;
            DateTime? endDate = updateTrainingProgramDto.EndDate ?? trainingProgramInDb.EndDate;

            if (updateTrainingProgramDto.StartDate != null && startDate < now)
                throw new ArgumentException("Start date must be in the future.");
            if (updateTrainingProgramDto.EndDate != null && endDate <= startDate)
                throw new ArgumentException("End date must be after start date.");

            var duration = endDate - startDate;
            if(updateTrainingProgramDto.StartDate != null || updateTrainingProgramDto.EndDate != null)
            {
                if (duration.Value.TotalDays < 7 || duration.Value.TotalDays > 365)
                    throw new ArgumentException("Duration must be between 1 week and 1 year.");
                trainingProgramInDb.DurationInDays = duration.Value.TotalDays; // return double (fractional days)
            }

            // MapsterConfig.cs موجود توزيعها وشكلها في != null تنسخ القيم فقط الي 
            updateTrainingProgramDto.Adapt(trainingProgramInDb);

            if (updateTrainingProgramDto.ImagePath != null && updateTrainingProgramDto.ImagePath.Length > 0)
            {
                FileHelper.DeleteFileFromUrl(trainingProgramInDb.ImagePath);
                // Save the new image
                trainingProgramInDb.ImagePath = await FileHelper.SaveFileAync(updateTrainingProgramDto.ImagePath, httpContext, "images/programs");
            }


            tMSDbContext.TrainingPrograms.Update(trainingProgramInDb);
            await tMSDbContext.SaveChangesAsync();

            return true;
        }

        // just for Admin
        public async Task<bool> RemoveAsync(int id, CancellationToken cancellationToken)
        {
            var trainingProgram = await tMSDbContext.TrainingPrograms.FindAsync(id);
            if (trainingProgram is null)
                return false;

            FileHelper.DeleteFileFromUrl(trainingProgram.ImagePath);
            tMSDbContext.TrainingPrograms.Remove(trainingProgram);
            await tMSDbContext.SaveChangesAsync(cancellationToken);
            return true;
        }

        // just for Admin
        public async Task<bool> RemoveAllAsync(CancellationToken cancellationToken)
        {
            var trainingPrograms = await tMSDbContext.TrainingPrograms.ToListAsync(cancellationToken);
            if (!trainingPrograms.Any())
                return false; // No TrainingPrograms to delete

            // RemoveAsync بس اعمل DbSet الي بتتبعن ال EF ال objects عشان نفصل عن paths تخزين ال
            var imagePaths = trainingPrograms // EF لل DbSet<TrainingProgram> من objects اخسن من List<string> بتعامل معهن كانهن
                .Where(tp => !string.IsNullOrEmpty(tp.ImagePath))
                .Select(tp => tp.ImagePath)
                .ToList();

            tMSDbContext.TrainingPrograms.RemoveRange(trainingPrograms);
            // Delete all image's path
            foreach (var path in imagePaths)
            { 
                FileHelper.DeleteFileFromUrl(path);
            }

            await tMSDbContext.SaveChangesAsync(cancellationToken);
            // Reset the identity column (using SQL Server)
            tMSDbContext.Database.ExecuteSqlRaw("DBCC CHECKIDENT ('TrainingPrograms', RESEED, 0)");

            return true;            
        }
      
        // just for Admin (accept requests of TP that coming from Companies)
        public async Task<ProgramActionResult> ApproveAsync(int id)
        {
            var program = await tMSDbContext.TrainingPrograms.FindAsync(id);
            if (program == null)
                return ProgramActionResult.NotFound;

            if (program.ApprovalStatus == TrainingProgramStatus.Approved)
                return ProgramActionResult.AlreadyApproved;

            if (program.ApprovalStatus == TrainingProgramStatus.Rejected)
                return ProgramActionResult.AlreadyRejected;

            program.ApprovalStatus = TrainingProgramStatus.Approved;
            //tMSDbContext.TrainingPrograms.Update(program); السطر الي تحت كفيل بعمل ذلك
            await tMSDbContext.SaveChangesAsync();
            return ProgramActionResult.Approved;
        }

        // just for Admin (Pending TP)
        public async Task<PagedResult<TrainingProgram>> GetPendingAsync(int page, int limit)
        {
            var query = tMSDbContext.TrainingPrograms
                .Where(tp => tp.ApprovalStatus == TrainingProgramStatus.Pending)
                .Include(tp => tp.Category)
                .Include(tp => tp.Company).ThenInclude(c => c.ApplicationUser) // CompanyName from ApplicationUser
                .Include(tp => tp.Supervisor).ThenInclude(s => s.ApplicationUser); // SupervisorName from ApplicationUser

            var total = await query.CountAsync();

            var items = await query
                .Skip((page - 1) * limit)
                .Take(limit)
                .ToListAsync();

            return new PagedResult<TrainingProgram>
            {
                Items = items,
                TotalCount = total,
                Page = page,
                Limit = limit
            };
        }

        // just for Company (Pending TP), note that TP is tailored for that Company, not to others
        public async Task<PagedResult<TrainingProgram>> GetPendingByCompanyAsync(int companyId, int page, int limit)
        {
            var query = tMSDbContext.TrainingPrograms
                .Where(tp => tp.ApprovalStatus == TrainingProgramStatus.Pending && tp.CompanyId == companyId)
                .Include(tp => tp.Category)
                .Include(tp => tp.Company).ThenInclude(c => c.ApplicationUser) // CompanyName from ApplicationUser
                .Include(tp => tp.Supervisor).ThenInclude(s => s.ApplicationUser); // SupervisorName from ApplicationUser

            var total = await query.CountAsync();
            var items = await query.Skip((page - 1) * limit).Take(limit).ToListAsync();

            return new PagedResult<TrainingProgram>
            {
                Items = items,
                TotalCount = total,
                Page = page,
                Limit = limit
            };

        }

        // just for Admin (Reject pending requests that come from Companies with rejection reason)
        public async Task<ProgramActionResult> RejectAsync(int id, string reason)
        {
            var program = await tMSDbContext.TrainingPrograms.FindAsync(id);
            if (program == null)
                return ProgramActionResult.NotFound;

            if (program.ApprovalStatus == TrainingProgramStatus.Rejected)
                return ProgramActionResult.AlreadyRejected;

            if (program.ApprovalStatus == TrainingProgramStatus.Approved)
                return ProgramActionResult.AlreadyApproved;

            program.ApprovalStatus = TrainingProgramStatus.Rejected;
            program.RejectionReason = reason;
            program.RejectionDate = DateTime.Now;

            await tMSDbContext.SaveChangesAsync(); // tMSDbContext.TrainingPrograms.Update(program); لا داعي ل
            return ProgramActionResult.Rejected;
        }

        // just for Admin (display all rejected requests for varient Companies)
        public async Task<PagedResult<TrainingProgram>> GetRejectedAsync(int page, int limit)
        {
            var query = tMSDbContext.TrainingPrograms
                .Where(tp => tp.ApprovalStatus == TrainingProgramStatus.Rejected)
                .Include(tp => tp.Category)
                .Include(tp => tp.Company).ThenInclude(c => c.ApplicationUser); // CompanyName from AoolicationUser

            var total = await query.CountAsync();
            var items = await query.Skip((page - 1) * limit).Take(limit).ToListAsync();

            return new PagedResult<TrainingProgram>
            {
                Items = items,
                TotalCount = total,
                Page = page,
                Limit = limit
            };

        }

        // just for Company, (this TP is for specific Company, others no)
        public async Task<PagedResult<TrainingProgram>> GetRejectedByCompanyAsync(int companyId, int page, int limit)
        {
            var query = tMSDbContext.TrainingPrograms
                .Where(tp => tp.ApprovalStatus == TrainingProgramStatus.Rejected && tp.CompanyId == companyId)
                .Include(tp => tp.Category)
                .Include(tp => tp.Supervisor).ThenInclude(c => c.ApplicationUser); // SupervisorName from ApplicationUser

            var total = await query.CountAsync();
            var items = await query.Skip((page - 1) * limit).Take(limit).ToListAsync();

            return new PagedResult<TrainingProgram>
            {
                Items = items,
                TotalCount = total,
                Page = page,
                Limit = limit
            };


        }

        // just for Company, (this TP is for specific Company, others no)
        public async Task<PagedResult<TrainingProgram>> GetApprovedByCompanyAsync(int companyId, int page, int limit)
        {
            var query = tMSDbContext.TrainingPrograms
                .Where(tp => tp.ApprovalStatus == TrainingProgramStatus.Approved && tp.CompanyId == companyId)
                .Include(tp => tp.Category)
                .Include(tp => tp.Supervisor).ThenInclude(s => s.ApplicationUser);

            var total = await query.CountAsync();
            var items = await query.Skip((page - 1) * limit).Take(limit).ToListAsync();

            return new PagedResult<TrainingProgram>
            {
                Items = items,
                TotalCount = total,
                Page = page,
                Limit = limit
            };
        }

        // just for Supervisor, (this TP is for specific Supervisor, others no)
        public async Task<PagedResult<TrainingProgram>> GetBySupervisorAsync(int supervisorId, int page, int limit)
        {
            var query = tMSDbContext.TrainingPrograms
                .Where(tp => tp.ApprovalStatus == TrainingProgramStatus.Approved && tp.SupervisorId == supervisorId)
                .Include(tp => tp.Category)
                .Include(tp => tp.Company).ThenInclude(c => c.ApplicationUser);

            var total = await query.CountAsync();
            var items = await query.Skip((page - 1) * limit).Take(limit).ToListAsync();

            return new PagedResult<TrainingProgram>
            {
                Items = items,
                TotalCount = total,
                Page = page,
                Limit = limit
            };
        }



    }
}
