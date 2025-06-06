using System.Linq.Expressions;
using TMS.API.Models;

namespace TMS.API.Services.Categories
{
    public interface ICategoryService
    {
        IEnumerable<Category> GetCategories();
        Category? Get(Expression<Func<Category, bool>> expression);
        Category Add(Category category);
        bool Edit(int id, Category category);
        bool Remove(int id);
        int RemoveAll();
    }
}
