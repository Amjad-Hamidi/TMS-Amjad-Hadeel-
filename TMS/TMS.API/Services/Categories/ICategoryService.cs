using System.Linq.Expressions;
using TMS.API.DTOs.Categories.Requests;
using TMS.API.DTOs.Categories.Responses;
using TMS.API.DTOs.Pages;
using TMS.API.Models;
using TMS.API.Services.IService;

namespace TMS.API.Services.Categories
{
    public interface ICategoryService : IService<Category>
    {
        Task<PagedResult<CategoryResponse>> GetAllAsync(int page, int limit, string? search);
        Task<Category> AddAsync(AddCategoryDto categoryRequest, HttpContext httpContext);
        Task<bool> EditAsync(int id, UpdateCategoryDto updateCategoryDto, HttpContext httpContext);
        Task<bool> RemoveAllAsync(CancellationToken cancellationToken);
    }
}
