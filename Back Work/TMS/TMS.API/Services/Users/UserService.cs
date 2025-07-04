﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using TMS.API.Data;
using TMS.API.DTOs.Categories.Responses;
using TMS.API.DTOs.Pages;
using TMS.API.DTOs.TrainingPrograms.Responses;
using TMS.API.DTOs.Users;
using TMS.API.DTOs.Users.Admin;
using TMS.API.DTOs.Users.Supervisors;
using TMS.API.DTOs.Users.Trainees;
using TMS.API.Helpers;
using TMS.API.Models;
using TMS.API.Models.AuthenticationModels;
using TMS.API.Services.IService;
using TMS.API.Services.Registers;

namespace TMS.API.Services.Users
{
    public class UserService : Service<ApplicationUser>, IUserService
    {
        private readonly TMSDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IUserRegistrationService userRegistrationService;

        public UserService(TMSDbContext context,
            UserManager<ApplicationUser> userManager,
            IUserRegistrationService userRegistrationService) : base(context)
        {
            this._context = context;
            _userManager = userManager;
            this.userRegistrationService = userRegistrationService;
        }

        public async Task<PagedResult<GetUsersDto>> GetAll(int page, int limit, string? search, UserRole? role)
        {
            var query = await GetAsync(
                expression: u => u.UserAccount != null, // Example filter to fetch all users who have a UserAccount
                includes: new Expression<Func<ApplicationUser, object>>[] { u => u.UserAccount }, // Example include for related UserAccount
                isTracked: false
            );

            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(u =>
                    u.FirstName.Contains(search, StringComparison.OrdinalIgnoreCase) ||
                    u.LastName.Contains(search, StringComparison.OrdinalIgnoreCase) ||
                    u.UserName.Contains(search, StringComparison.OrdinalIgnoreCase) ||
                    u.Email.Contains(search, StringComparison.OrdinalIgnoreCase)
                );
            }

            if (role != null)
            {
                query = query.Where(u => u.UserAccount.Role == role);
            }

            query = query.AsQueryable();
            var totalCount = query.Count();


            // Map to DTO
            var pagedUsers = query
                .OrderBy(u => u.UserAccount.Id)
                .Skip((page-1) * limit)
                .Take(limit)
                .Select(user => new GetUsersDto
                {
                    UserAccountId = user.UserAccount.Id,
                    ApplicationUserId = user.Id,
                    UserName = user.UserName,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Email = user.Email,
                    Gender = Enum.GetName(typeof(ApplicationUserGender), user.Gender),
                    BirthDate = user.BirthDate,
                    Phone = user.PhoneNumber,
                    ProfileImageUrl = user.ProfileImageUrl,
                    Role = Enum.GetName(typeof(UserRole), user.UserAccount.Role)
                }).ToList();

            return new PagedResult<GetUsersDto>
            {
                Items = pagedUsers,
                TotalCount = totalCount,
                Page = page,
                Limit = limit
            };
        }


        public async Task<GetStatisticsDto> GetStatisticsAboutUsers()
        {
            // Count all users
            var usersCount = await _context.Users.CountAsync();

            // Count all companies
            var companiesCount = await _context.UserAccounts
                .Where(userAcc => userAcc.Role == UserRole.Company)
                .CountAsync();

            // Count all supervisors
            var supervisorsCount = await _context.UserAccounts
                .Where(userAcc => userAcc.Role == UserRole.Supervisor)
                .CountAsync();

            // Count all trainees
            var traineesCount = await _context.UserAccounts
                .Where(userAcc => userAcc.Role == UserRole.Trainee)
                .CountAsync();

            // Count all categories
            var categoriesCount = await _context.Categories.CountAsync();

            // Count all training programs
            var totalTrainingProgramsCount = await _context.TrainingPrograms.CountAsync();

            // Count training programs by status
            var approvedTrainingProgramsCount = await _context.TrainingPrograms
                .CountAsync(tp => tp.ApprovalStatus == TrainingProgramStatus.Approved);

            var rejectedTrainingProgramsCount = await _context.TrainingPrograms
                .CountAsync(tp => tp.ApprovalStatus == TrainingProgramStatus.Rejected);

            var pendingTrainingProgramsCount = await _context.TrainingPrograms
                .CountAsync(tp => tp.ApprovalStatus == TrainingProgramStatus.Pending);

            return new GetStatisticsDto
            {
                UsersCount = usersCount,
                CompainesCount = companiesCount,
                SupervisorsCount = supervisorsCount,
                TraineesCount = traineesCount,
                CategoriesCount = categoriesCount,
                TotalTrainingProgramsCount = totalTrainingProgramsCount,
                ApprovedTrainingProgramsCount = approvedTrainingProgramsCount,
                RejectedTrainingProgramsCount = rejectedTrainingProgramsCount,
                PendingTrainingProgramsCount = pendingTrainingProgramsCount
            };

        }


        public async Task<GetUsersDto> GetById(int id)
        {
            var user = await GetOneAsync(
                predicate: u => u.UserAccount.Id == id, // Filter to fetch the user by Id
                includes: new Expression<Func<ApplicationUser, object>>[] { u => u.UserAccount }, // Example include for related UserAccount
                isTracked: false
                );

            // تحقق إذا كان المستخدم غير موجود
            if (user == null)
            {
                throw new KeyNotFoundException("User not found"); // أو يمكن إرجاع NotFound من دون رمي الاستثناء
            }

            var userDto = new GetUsersDto{
                UserAccountId = user.UserAccount.Id,
                ApplicationUserId = user.Id,
                UserName = user.UserName,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                Gender = Enum.GetName(typeof(ApplicationUserGender), user.Gender),
                BirthDate = user.BirthDate,
                Phone = user.PhoneNumber,
                ProfileImageUrl = user.ProfileImageUrl,
                Role = Enum.GetName(typeof(UserRole), user.UserAccount.Role)
            };

            return userDto;
        }


        public async Task<PagedResult<SupervisorDto>> GetAllSupervisorsAsync(string? search, int page, int limit)
        {
            var query = _context.UserAccounts
                .Where(u => u.Role == UserRole.Supervisor)
                .Include(u => u.ApplicationUser)
                .AsNoTracking()
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(u =>
                    u.ApplicationUser.FirstName.Contains(search) ||
                    u.ApplicationUser.LastName.Contains(search) ||
                    u.ApplicationUser.Email.Contains(search));
            }

            var totalCount = await query.CountAsync();

            var items = await query
                .OrderBy(u => u.Id) // Order By SupervisorId ascending (1,2,3....)
                .Skip((page - 1) * limit)
                .Take(limit)
                .Select(u => new SupervisorDto
                {
                    Id = u.Id,
                    FullName = u.ApplicationUser.FirstName + " " + u.ApplicationUser.LastName,
                    Email = u.ApplicationUser.Email,
                    PhoneNumber = u.ApplicationUser.PhoneNumber,
                    ProfileImageUrl = u.ApplicationUser.ProfileImageUrl,
                    CVPath = u.CVPath
                })
                .ToListAsync();

            return new PagedResult<SupervisorDto>
            {
                Items = items,
                TotalCount = totalCount,
                Page = page,
                Limit = limit
            };
        }


        public async Task<PagedResult<CompanySupervisorWithProgramsDto>> GetSupervisorsWithProgramsByCompanyAsync(int companyId, string? search, int page, int limit)
        {
            var supervisorsQuery = _context.UserAccounts
                .Where(u => u.Role == UserRole.Supervisor &&
                             _context.TrainingPrograms.Any(tp => tp.SupervisorId == u.Id && tp.CompanyId == companyId))
                .Include(u => u.ApplicationUser)
                .AsNoTracking()
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                var normalizedSearch = search.Trim().ToLower();
                supervisorsQuery = supervisorsQuery.Where(s =>
                    (s.ApplicationUser.FirstName + " " + s.ApplicationUser.LastName).ToLower().Contains(normalizedSearch) ||
                    s.ApplicationUser.Email.ToLower().Contains(normalizedSearch));
            }

            var total = await supervisorsQuery.CountAsync();

            var supervisors = await supervisorsQuery
                .OrderBy(s => s.Id) // Order By SupervisorId ascending (1,2,3....)
                .Skip((page - 1) * limit)
                .Take(limit)
                .ToListAsync();

            var result = new List<CompanySupervisorWithProgramsDto>();

            foreach (var supervisor in supervisors)
            {
                var programs = await _context.TrainingPrograms
                    .Where(tp => tp.SupervisorId == supervisor.Id && tp.CompanyId == companyId)
                    .Select(tp => new SimpleProgramDto
                    {
                        ProgramId = tp.TrainingProgramId,
                        Title = tp.Title,
                        Description = tp.Description,
                        StartDate = tp.StartDate,
                        EndDate = tp.EndDate
                    })
                    .ToListAsync();

                result.Add(new CompanySupervisorWithProgramsDto
                {
                    SupervisorId = supervisor.Id,
                    FullName = $"{supervisor.ApplicationUser.FirstName} {supervisor.ApplicationUser.LastName}",
                    Email = supervisor.ApplicationUser.Email,
                    PhoneNumber = supervisor.ApplicationUser.PhoneNumber ?? "",
                    ProfileImageUrl = supervisor.ApplicationUser.ProfileImageUrl,
                    CVPath = supervisor.CVPath,
                    Programs = programs
                });
            }

            return new PagedResult<CompanySupervisorWithProgramsDto>
            {
                Items = result,
                TotalCount = total,
                Page = page,
                Limit = limit
            };
        }

        public async Task<PagedResult<TraineeGeneralDto>> GetAllTraineesAsync(string? search, int page, int limit)
        {
            var query = _context.UserAccounts
               .Where(u => u.Role == UserRole.Trainee)
               .Include(u => u.ApplicationUser)
               .Include(u => u.EnrolledPrograms)
                   .ThenInclude(ep => ep.TrainingProgram)
                       .ThenInclude(tp => tp.Category)
               .AsNoTracking()
               .AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(u =>
                    u.ApplicationUser.FirstName.Contains(search) ||
                    u.ApplicationUser.LastName.Contains(search) ||
                    u.ApplicationUser.Email.Contains(search) ||
                    u.ApplicationUser.PhoneNumber.Contains(search));
            }

            var totalCount = await query.CountAsync();

            var pagedUsers = await query
                .OrderBy(u => u.Id)
                .Skip((page - 1) * limit)
                .Take(limit)
                .ToListAsync();

            var items = pagedUsers
                .Select(u => new TraineeGeneralDto
                {
                    Id = u.Id,
                    FullName = u.ApplicationUser.FirstName + " " + u.ApplicationUser.LastName,
                    Email = u.ApplicationUser.Email,
                    PhoneNumber = u.ApplicationUser.PhoneNumber,
                    ProfileImageUrl = u.ApplicationUser.ProfileImageUrl,
                    CVPath = u.CVPath,

                    TrainingPrograms = u.EnrolledPrograms   
                        .Where(ep => ep.TrainingProgram != null)
                        .Select(ep => new TrainingProgramSummaryDto
                        {
                            TrainingProgramId = ep.TrainingProgram.TrainingProgramId,
                            Title = ep.TrainingProgram.Title
                        })
                        .ToList(),

                    Categories = u.EnrolledPrograms
                        .Where(ep => ep.TrainingProgram != null && ep.TrainingProgram.Category != null)
                        .Select(ep => ep.TrainingProgram.Category)
                        .GroupBy(cat => cat.Id)
                        .Select(g => new CategorySummaryDto
                        {
                            Id = g.Key,
                            Name = g.First().Name
                        })
                        .ToList()
                })
                .ToList();

            return new PagedResult<TraineeGeneralDto>
            {
                Items = items,
                TotalCount = totalCount,
                Page = page,
                Limit = limit
            };
        }


        public async Task<PagedResult<TraineeSpecificDto>> GetTraineesByCompanyAsync(int companyId, string? search, int page, int limit)
        {
            var query = _context.ProgramTrainees
               .Where(pt =>
                   pt.TrainingProgram.CompanyId == companyId &&
                   pt.TrainingProgram.ApprovalStatus == TrainingProgramStatus.Approved)
               .Include(pt => pt.Trainee)
                   .ThenInclude(t => t.ApplicationUser)
               .Include(pt => pt.TrainingProgram)
                   .ThenInclude(tp => tp.Category)
               .AsQueryable();

            // Check how many before search
            var countBeforeSearch = await query.CountAsync();
            Console.WriteLine($"Before search - Total matching ProgramTrainees: {countBeforeSearch}");

            if (!string.IsNullOrWhiteSpace(search))
            {
                var normalizedSearch = search.Trim().ToLower();
                query = query.Where(pt =>
                    pt.Trainee.ApplicationUser.FirstName.ToLower().Contains(normalizedSearch) ||
                    pt.Trainee.ApplicationUser.LastName.ToLower().Contains(normalizedSearch) ||
                    pt.Trainee.ApplicationUser.Email.ToLower().Contains(normalizedSearch));
            }

            var totalCount = await query.CountAsync();
            Console.WriteLine($"After search - Total matching ProgramTrainees: {totalCount}");

            var items = await query
                .OrderBy(pt => pt.TraineeId)
                .Skip((page - 1) * limit)
                .Take(limit)
                .Select(pt => new TraineeSpecificDto
                {
                    Id = pt.Trainee.Id,
                    FullName = pt.Trainee.ApplicationUser.FirstName + " " + pt.Trainee.ApplicationUser.LastName,
                    Email = pt.Trainee.ApplicationUser.Email,
                    PhoneNumber = pt.Trainee.ApplicationUser.PhoneNumber,
                    ProfileImageUrl = pt.Trainee.ApplicationUser.ProfileImageUrl,
                    CVPath = pt.CVPath,
                    TrainingProgramId = pt.TrainingProgram.TrainingProgramId,
                    TrainingProgramName = pt.TrainingProgram.Title,
                    CategoryId = pt.TrainingProgram.Category.Id,
                    CategoryName = pt.TrainingProgram.Category.Name
                })
                .ToListAsync();

            return new PagedResult<TraineeSpecificDto>
            {
                Items = items,
                TotalCount = totalCount,
                Page = page,
                Limit = limit
            };
            
        }



        public async Task<PagedResult<TraineeSpecificDto>> GetTraineesForSupervisorAsync(int supervisorId, string? search, int page, int limit)
        {
            var query = _context.ProgramTrainees
                .Where(pt => pt.TrainingProgram.SupervisorId == supervisorId)
                .Include(pt => pt.Trainee).ThenInclude(a => a.ApplicationUser)
                .Include(pt => pt.TrainingProgram).ThenInclude(tp => tp.Category)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(pt =>
                    pt.Trainee.ApplicationUser.FirstName.Contains(search) ||
                    pt.Trainee.ApplicationUser.LastName.Contains(search) ||
                    pt.Trainee.ApplicationUser.Email.Contains(search));
            }

            var totalCount = await query.CountAsync();

            var trainees = await query
                .OrderBy(pt => pt.TraineeId) 
                .Skip((page - 1) * limit)
                .Take(limit)
                .Select(pt => new TraineeSpecificDto
                {
                    Id = pt.Trainee.Id,
                    FullName = pt.Trainee.ApplicationUser.FirstName + " " + pt.Trainee.ApplicationUser.LastName,
                    Email = pt.Trainee.ApplicationUser.Email,
                    PhoneNumber = pt.Trainee.ApplicationUser.PhoneNumber,
                    ProfileImageUrl = pt.Trainee.ApplicationUser.ProfileImageUrl,
                    CVPath = pt.Trainee.CVPath,
                    TrainingProgramId = pt.TrainingProgram.TrainingProgramId,
                    TrainingProgramName = pt.TrainingProgram.Title,
                    CategoryId = pt.TrainingProgram.Category.Id,
                    CategoryName = pt.TrainingProgram.Category.Name
                })
                .ToListAsync();

            return new PagedResult<TraineeSpecificDto>
            {
                Items = trainees,
                TotalCount = totalCount,
                Page = page,
                Limit = limit
            };
        }


        public async Task<PagedResult<SupervisorDto>> GetSupervisorsForTraineeAsync(int traineeId, string? search, int page, int limit)
        {
            // Get Supervisors for approved training programs of the trainee with included ApplicationUser
            var supervisorQuery = _context.ProgramTrainees
                .Where(pt => pt.TraineeId == traineeId && pt.TrainingProgram.ApprovalStatus == TrainingProgramStatus.Approved)
                .Select(pt => pt.TrainingProgram.Supervisor)
                .Distinct()
                .Include(s => s.ApplicationUser) // Include before any projection
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                var normalizedSearch = search.Trim().ToLower();
                supervisorQuery = supervisorQuery.Where(s =>
                    (s.ApplicationUser.FirstName + " " + s.ApplicationUser.LastName).ToLower().Contains(normalizedSearch) ||
                    s.ApplicationUser.Email.ToLower().Contains(normalizedSearch));
            }

            var total = await supervisorQuery.CountAsync();

            var supervisors = await supervisorQuery
                .OrderBy(s => s.Id) // Order By SupervisorId ascending (1,2,3....)
                .Skip((page - 1) * limit)
                .Take(limit)
                .ToListAsync();

            var result = supervisors.Select(s => new SupervisorDto
            {
                Id = s.Id,
                FullName = $"{s.ApplicationUser.FirstName} {s.ApplicationUser.LastName}",
                Email = s.ApplicationUser.Email,
                PhoneNumber = s.ApplicationUser.PhoneNumber,
                ProfileImageUrl = s.ApplicationUser.ProfileImageUrl,
                CVPath = s.CVPath
            }).ToList();

            return new PagedResult<SupervisorDto>
            {
                Items = result,
                TotalCount = total,
                Page = page,
                Limit = limit
            };
        }




        public async Task<IdentityResult> Add(RegisterRequestModel registerRequestModel)
        {
            return await userRegistrationService.RegisterUserAsync(registerRequestModel);
        }

        /* // It is made on the ProfileService
        public async Task<IdentityResult?> Edit(int id,
            UpdateProfileDto updateUserDto,
            HttpContext httpContext)
        {
            var applicationUserInDb = await _userManager.Users
               //.Include(applicationUserInDb => applicationUserInDb.UserAccount) // لا داعي لعمل تضمين , لانا ما بدنا نعدل اشي من الداتا فيها
               .FirstOrDefaultAsync(appUser => appUser.UserAccount.Id == id);  // Fixing the query by using Where instead of Include

            if (applicationUserInDb == null) return null;
           
            // Check if there's a new profile image
            if (updateUserDto.ProfileImageFile != null && updateUserDto.ProfileImageFile.Length > 0) // إذا تم تحميل صورة جديدة
            {
                // Delete the old profile image from the server
                FileHelper.DeleteFileFromUrl(applicationUserInDb.ProfileImageUrl);

                // Save new profile image using FileHelper class
                applicationUserInDb.ProfileImageUrl = await FileHelper.SaveFileAync(updateUserDto.ProfileImageFile, httpContext, "images/profiles");
            }

            // Update only for the non-null properties
            updateUserDto.Adapt(applicationUserInDb);

            var result = await _userManager.UpdateAsync(applicationUserInDb);
            return result; // return IdentityResult

        }
        */


        public async Task<bool> RemoveUserAsync(int id, CancellationToken cancellationToken)
        {
            var user = await _userManager.Users // DeleteAsync(user); لانو فعليا رح احذفه في AsNoTracking() غلط اعمل هون 
                .Include(appUser => appUser.UserAccount)
                .FirstOrDefaultAsync(appUser => appUser.UserAccount.Id == id);

            if (user == null)
                return false;

            if (user.UserAccount.Role == UserRole.Company)
            {
                var hasPrograms = await _context.TrainingPrograms
                    .AnyAsync(tp => tp.CompanyId == user.UserAccount.Id, cancellationToken);

                if (hasPrograms)
                {
                    // ⛔ ممنوع الحذف، لازم يحذف البرامج أولاً
                    throw new InvalidOperationException("Cannot delete this company. Please delete its training programs first.");
                }
            }

            // 🧹 حذف الصورة من السيرفر 
            FileHelper.DeleteFileFromUrl(user.ProfileImageUrl);

            var result = await _userManager.DeleteAsync(user);
            return result.Succeeded;
        }

        public async Task<bool> RemoveAllExceptAdmin(CancellationToken cancellationToken)
        {
            var users = await _userManager.Users
                .Include(appUser => appUser.UserAccount)
                .Where(user => user.UserAccount.Role != UserRole.Admin) // SQL وليس C# لانه هون SQL الى Enum رح يضرب سيرفر ايرور, ما بعرف يحول ال Enum.GetName(user.UserAccount.Role) != "Admin" لو احط
                .ToListAsync(cancellationToken);

            foreach (var user in users)
            {
                if (user.UserAccount.Role == UserRole.Company)
                {
                    var hasPrograms = await _context.TrainingPrograms
                        .AnyAsync(tp => tp.CompanyId == user.UserAccount.Id, cancellationToken);

                    if (hasPrograms)
                    {
                        throw new InvalidOperationException($"Cannot delete company '{user.UserName}' (ID: {user.UserAccount.Id}) because it still has training programs.");
                    }
                }

                FileHelper.DeleteFileFromUrl(user.ProfileImageUrl);

                var result = await _userManager.DeleteAsync(user);
                if (!result.Succeeded)
                    return false;
            }
            // reset identity to start from 2 (because Admin is already 1)
            await _context.Database.ExecuteSqlRawAsync("DBCC CHECKIDENT('UserAccounts', RESEED, 1);");

            return true;
        }

        [Authorize(Roles = $"{StaticData.Admin}")]
        public async Task<bool> ChangeRole(int userId, UserRole role)
        {
            var user = await _userManager.Users
                .Include(appUser => appUser.UserAccount) // Include the UserAccount navigation property
                .FirstOrDefaultAsync(appUser => appUser.UserAccount.Id == userId);

            if (user is null)
                return false;

            var currentRole = user.UserAccount.Role;

            // منع تغيير دور الشركة إذا عندها برامج تدريبية
            if (currentRole == UserRole.Company)
            {
                var hasPrograms = await _context.TrainingPrograms
                    .AnyAsync(tp => tp.CompanyId == user.UserAccount.Id);
                if (hasPrograms)
                    throw new InvalidOperationException("❌ Cannot change role: this company still has training programs. Please delete them first.");
            }

            // منع تغيير المشرف اذا كان يشرف على برامج تدريبية
            if (currentRole == UserRole.Supervisor)
            {
                var isSupervising = await _context.TrainingPrograms
                    .AnyAsync(tp => tp.SupervisorId == user.UserAccount.Id);
                if (isSupervising)
                    throw new InvalidOperationException("❌ Cannot change role: this supervisor is assigned to training programs.");
            }

            // remove the old role
            var oldRoles = await _userManager.GetRolesAsync(user);
            var removeResult = await _userManager.RemoveFromRolesAsync(user, oldRoles);
            if (!removeResult.Succeeded)
                return false;

            string roleName = Enum.GetName(typeof(UserRole), role); // OR : string roleName = role.ToString();
                                                                    // add the new role
            var addResult = await _userManager.AddToRoleAsync(user, roleName);

            var userAccount = user.UserAccount;
            userAccount.Role = role; // Update the role in the UserAccount entity

            _context.UserAccounts.Update(userAccount); // Update the UserAccount entity in the context
            await _context.SaveChangesAsync(); // Save the changes to the database

            return addResult.Succeeded; // return 0 or 1 (if succeeded 1 if no 0)

        }



        public async Task<string> LockUnLock(int id)
        {
            var user = await _userManager.Users
                .Include(appUser => appUser.UserAccount) // Include the UserAccount navigation property
                .FirstOrDefaultAsync(appUser => appUser.UserAccount.Id == id);
            if (user is not null)
            {
                user.LockoutEnabled = true; // Enable lockout

                if (user.LockoutEnd != null && user.LockoutEnd > DateTimeOffset.UtcNow) // انتهاء مدة الحظر , الان بدي الغي الحظر
                {
                    user.LockoutEnd = null; // الغاء الحظر
                    await _userManager.UpdateAsync(user);
                    return "Unlocked";
                }
                else
                {
                    user.LockoutEnd = DateTime.Now.AddMinutes(5); // قفل الحساب
                    await _userManager.UpdateAsync(user);
                    return "Locked";
                }
            }

            return null; // User not found
        }

    }
}
