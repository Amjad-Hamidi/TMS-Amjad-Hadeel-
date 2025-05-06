using Mapster;
using TMS.API.DTOs.Categories.Requests;
using TMS.API.DTOs.Categories.Responses;
using TMS.API.DTOs.TrainingPrograms.Requests;
using TMS.API.DTOs.TrainingPrograms.Responses;
using TMS.API.DTOs.Users;
using TMS.API.Models;

namespace TMS.API.Helpers
{
    public static class MapsterConfig // static class : property ولا يحتوي على اي static هون بس بنتعامل مع فنكشناته object لا حاجة لعمل منه utality class فهو Design Principles من ال clarity and intent بحقق مبدا ال
    {
        public static void RegisterMappings()
        {
            // Category -> CategoryResponse
            TypeAdapterConfig<Category, CategoryResponse>
                .NewConfig()
                .Map(dest => dest.CategoryImage, src => src.CategoryImageUrl);

            // UpdateCategoryDto -> Category (null values ignored)
            TypeAdapterConfig<UpdateCategoryDto, Category>
                .NewConfig()
                .IgnoreNullValues(true);

            // UpdateUserDto -> ApplicationUser (null values ignored)
            TypeAdapterConfig<UpdateUserDto, ApplicationUser>
                .NewConfig()
                .IgnoreNullValues(true);
                //.Ignore(dest => dest.RefreshToken) ApplicationUser مش رح يعملهن مابنج ل UpdateUserDto اذا لاحقا ضفتهن على
                //.Ignore(dest => dest.UserAccount)

            TypeAdapterConfig<UpdateTrainingProgramDto, TrainingProgram>
                .NewConfig()
                .IgnoreNullValues(true);

            // بالشكل الي بدي اياه duration وال SupervisorName و CompanyName و CategoryName عشان موضوع جلب  
            TypeAdapterConfig<TrainingProgram, ResponseProgramDto>
                .NewConfig()
                .Map(dest => dest.CategoryName, src => src.Category.Name)
                .Map(dest => dest.CompanyName,
                src => src.Company.ApplicationUser.FirstName + " " + src.Company.ApplicationUser.LastName)
                .Map(dest => dest.SupervisorName,
                src => src.Supervisor != null
                    ? src.Supervisor.ApplicationUser.FirstName + " " + src.Supervisor.ApplicationUser.LastName
                    : null)
                .Map(dest => dest.DurationInDays, src => (src.EndDate-src.StartDate).TotalDays + " days");

            // بالشكل الي بدي اياه duration وال SupervisorName و CompanyName و CategoryName عشان موضوع جلب  
            TypeAdapterConfig<TrainingProgram, PendingProgramDto>
                .NewConfig()
                .Map(dest => dest.CategoryName, src => src.Category.Name)
                .Map(dest => dest.CompanyName,
                src => src.Company.ApplicationUser.FirstName + " " + src.Company.ApplicationUser.LastName)
                .Map(dest => dest.SupervisorName,
                src => src.Supervisor != null
                    ? src.Supervisor.ApplicationUser.FirstName + " " + src.Supervisor.ApplicationUser.LastName
                    : null)
                .Map(dest => dest.Duration, src => (src.EndDate - src.StartDate).TotalDays + " days");

            TypeAdapterConfig<TrainingProgram, SupervisedProgramDto>
                .NewConfig()
                .Map(dest => dest.CategoryName, src => src.Category.Name)
                .Map(dest => dest.CompanyName,
                src => src.Company.ApplicationUser.FirstName + " " + src.Company.ApplicationUser.LastName)
                .Map(dest => dest.DurationInDays, src => (src.EndDate - src.StartDate).TotalDays + " days");

            TypeAdapterConfig<TrainingProgram, ApprovedProgramDto>
                .NewConfig()
                .Map(dest => dest.CategoryName, src => src.Category.Name)
                .Map(dest => dest.SupervisorName,
                src => src.Supervisor.ApplicationUser.FirstName + " " + src.Supervisor.ApplicationUser.LastName)
                .Map(dest => dest.DurationInDays, src => (src.EndDate - src.StartDate).TotalDays + " days");

            TypeAdapterConfig<TrainingProgram, RejectedCompanyProgramDto>
                .NewConfig()
                .Map(dest => dest.SupervisorName,
                     src => src.Supervisor != null
                 ? src.Supervisor.ApplicationUser.FirstName + " " + src.Supervisor.ApplicationUser.LastName
                 : null);

            TypeAdapterConfig<TrainingProgram, RejectedAdminProgramDto>
                .NewConfig()
                .Map(dest => dest.CompanyName,
                     src => src.Company != null
                 ? src.Company.ApplicationUser.FirstName + " " + src.Company.ApplicationUser.LastName
                 : null);


        }

    }
}
