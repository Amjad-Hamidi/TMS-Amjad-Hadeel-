using System.Linq.Expressions;
using TMS.API.DTOs.Categories.Requests;
using TMS.API.Models;
using TMS.API.Services.IService;

namespace TMS.API.Services.Categories
{
    public interface ICategoryService : IService<Category>
    {
        Task<Category> AddAsync(CategoryRequestDto categoryRequest, HttpContext httpContext);
        Task<bool> EditAsync(int id, UpdateCategoryDto updateCategoryDto, HttpContext httpContext);
        Task<bool> RemoveAllAsync(CancellationToken cancellationToken);
    }
}
