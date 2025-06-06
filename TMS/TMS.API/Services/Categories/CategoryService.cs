using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using TMS.API.Data;
using TMS.API.Models;

namespace TMS.API.Services.Categories
{
    public class CategoryService : ICategoryService
    {
        private readonly TMSDbContext tMSDbContext;

        public CategoryService(TMSDbContext tMSDbContext)
        {
            this.tMSDbContext = tMSDbContext;
        }

        public Category Add(Category category)
        {
            tMSDbContext.Categories.Add(category);
            tMSDbContext.SaveChanges();
            return category;
        }

        public bool Edit(int id, Category category)
        {
            Category? categoryInDb = tMSDbContext.Categories.AsNoTracking().FirstOrDefault(c => c.Id == id);
            if (categoryInDb == null) return false;

            category.Id = id;
            tMSDbContext.Categories.Update(category);
            tMSDbContext.SaveChanges();
            return true;
        }

        public Category? Get(Expression<Func<Category, bool>> expression)
        {
            return tMSDbContext.Categories.FirstOrDefault(expression);
        }

        public IEnumerable<Category> GetCategories()
        {
            return tMSDbContext.Categories.ToList();
        }

        public bool Remove(int id)
        {
            Category? categoryInDb = tMSDbContext.Categories.Find(id);
            if (categoryInDb == null) return false;

            tMSDbContext.Categories.Remove(categoryInDb);
            tMSDbContext.SaveChanges();
            return true;
        }

        public int RemoveAll()
        {
            var all = tMSDbContext.Categories.ToList();
            tMSDbContext.Categories.RemoveRange(all);
            var count = tMSDbContext.SaveChanges();

            // Reset the identity column (using SQL Server)
            tMSDbContext.Database.ExecuteSqlRaw("DBCC CHECKIDENT ('Categories', RESEED, 0)");

            return count;
        }
    }
}
