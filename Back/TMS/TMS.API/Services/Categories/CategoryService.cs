using Azure.Core;
using Mapster;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using System.Threading.Tasks;
using TMS.API.Data;
using TMS.API.DTOs.Categories.Requests;
using TMS.API.Helpers;
using TMS.API.Models;
using TMS.API.Services.IService;

namespace TMS.API.Services.Categories
{
    public class CategoryService : Service<Category>, ICategoryService
    {
        private readonly TMSDbContext tMSDbContext;

        public CategoryService(TMSDbContext tMSDbContext) : base(tMSDbContext)
        {
            this.tMSDbContext = tMSDbContext;
        }

        
        public async Task<Category> AddAsync(CategoryRequestDto categoryRequest, HttpContext httpContext)
        {
            string? imageUrl = null;

            if (categoryRequest.CategoryImageFile != null)
            {
                imageUrl = await FileHelper.SaveFileAync(categoryRequest.CategoryImageFile, httpContext, "images/categories");
            }

            var category = categoryRequest.Adapt<Category>(); // Update action in CategoriesController موجودة في نهاية CategoryResponse بتتحول بال
            category.CategoryImageUrl = imageUrl; // CategoryResponse لل Adapt لانو بناء عليها بالسطر الي فوقها بدنا نعمل Category ضرورية , بدونها ما بحفظ الصورة في

            await tMSDbContext.Categories.AddAsync(category);
            await tMSDbContext.SaveChangesAsync();
            return category;
        }
       


        public async Task<bool> EditAsync(int id, UpdateCategoryDto updateCategoryDto, HttpContext httpContext)
        {
            var categoryInDb = await tMSDbContext.Categories
                //.AsNoTracking() ما بحطها لانو بدي اعدل فعلا , هيك مش رح يعدل صح بوجودها
                .FirstOrDefaultAsync(c => c.Id == id);
            if (categoryInDb == null) return false;

            string? imageUrl = categoryInDb.CategoryImageUrl;

            if(updateCategoryDto.CategoryImageFile != null && updateCategoryDto.CategoryImageFile.Length > 0)
            {
                FileHelper.DeleteFileFromUrl(imageUrl); 
                // Save the new image
                imageUrl = await FileHelper.SaveFileAync(updateCategoryDto.CategoryImageFile, httpContext, "images/categories");
            }

            // MapsterConfig.cs موجود توزيعها وشكلها في != null تنسخ القيم فقط الي 
            updateCategoryDto.Adapt(categoryInDb);
            categoryInDb.CategoryImageUrl = imageUrl; // imageUrl بدل ال if(updateCategoryDto.CategoryImageFile != null && updateCategoryDto.CategoryImageFile.Length > 0)  ال body ما بنحفظ بدونها , او بحطها مباشرة في DB يعني الرابط في Category ضرورية , بدونها ما بحفظ الصورة في

            tMSDbContext.Categories.Update(categoryInDb);
            await tMSDbContext.SaveChangesAsync();
            return true;
        }

        public async Task<bool> RemoveAsync(int id, CancellationToken cancellationToken)
        {
            var categoryInDb = await tMSDbContext.Categories.FindAsync(id);
            if (categoryInDb == null) return false;

            FileHelper.DeleteFileFromUrl(categoryInDb.CategoryImageUrl);


            tMSDbContext.Categories.Remove(categoryInDb);
            await tMSDbContext.SaveChangesAsync(cancellationToken);
            return true;
        }
   

        public async Task<bool> RemoveAllAsync(CancellationToken cancellationToken)
        {
            var all = await tMSDbContext.Categories.ToListAsync(cancellationToken);
            if (!all.Any())
                return false; // No categories to delete

            // حذف كل الصور
            foreach (var category in all)
            {
                FileHelper.DeleteFileFromUrl(category.CategoryImageUrl);
            }


            tMSDbContext.Categories.RemoveRange(all);
            await tMSDbContext.SaveChangesAsync(cancellationToken);

            // Reset the identity column (using SQL Server)
            tMSDbContext.Database.ExecuteSqlRaw("DBCC CHECKIDENT ('Categories', RESEED, 0)");

            return true; 
        }


    }
}
