using Mapster;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TMS.API.Data;
using TMS.API.DTOs.Categories.Requests;
using TMS.API.DTOs.Categories.Responses;
using TMS.API.Models;
using TMS.API.Services.Categories;

namespace TMS.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController(ICategoryService categoryService) : ControllerBase
    {
        private readonly ICategoryService categoryService = categoryService;

        [HttpGet("")]
        public IActionResult GetAll()
        {
            var categories = categoryService.GetCategories();

            return Ok(categories.Adapt<IEnumerable<CategoryResponse>>());
        }

        [HttpGet("{id}")]
        public IActionResult GetCategoryById(int id)
        {
            var category = categoryService.Get(c => c.Id == id);

            return category == null? NotFound() : Ok(category.Adapt<CategoryResponse>());
        }

        [HttpPut("{id}")]
        public IActionResult UpdateCategory([FromRoute] int id, [FromBody] CategoryRequest categoryRequest)
        {
            var categoryInDb = categoryService.Edit(id, categoryRequest.Adapt<Category>());
            if(!categoryInDb)
                return NotFound();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var categoryInDb = categoryService.Remove(id);
            if (!categoryInDb)
                return NotFound();
            return NoContent();
        } 
    }
}
