using Mapster;
using TMS.API.DTOs.Categories.Requests;
using TMS.API.DTOs.Categories.Responses;
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
        
        }

    }
}
