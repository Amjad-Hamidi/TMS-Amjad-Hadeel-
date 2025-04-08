using Azure.Core;
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
    [ApiController]              // Primary Constructor
    public class CategoriesController(ICategoryService categoryService) : ControllerBase
    {
        private readonly ICategoryService categoryService = categoryService;

        /* // لاحقا بفعلها
        [HttpGet("check-name")] // هون حاليا ما بتفيد , يمكن تفيد لو بدنا نعمل بالفرونت وهو يكتب تلقائي يقله انو الاسم مستخدم
        public IActionResult CheckName(string name)
        {
            var exists = categoryService.Get(c => c.Name.ToLower() == name.ToLower()) != null;
            return Ok(exists);
        }
        */


        [HttpGet("")]
        public IActionResult GetAll()
        {
            var categories = categoryService.GetCategories();

            return Ok(categories.Adapt<IEnumerable<CategoryResponse>>());
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var category = categoryService.Get(c => c.Id == id);

            return category == null? NotFound() : Ok(category.Adapt<CategoryResponse>()); // Adapt<CategoryResponse>() : CategoryResponse الواحدة فبظهرهمش لاني بستخدم Category الي بكونوا داخل ال group of Training Programs عشان نحل مشكلة ال
        }

        [HttpPost("")]
        public IActionResult Create([FromBody] CategoryRequest categoryRequest)
        {
            // Backend validation
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Check for duplicate name (case-insensitive) (backend validation)
            var isDuplicate = categoryService.Get(c => c.Name.ToLower() == categoryRequest.Name.ToLower()) != null;
            if (isDuplicate)
                return BadRequest("Category name already exists.");

            var categoryInDb = categoryService.Add(categoryRequest.Adapt<Category>()); // Navigation => ICollection <TrainingProgram> الوضع الافتراضي هون بحتوي برضو ال
            if (categoryInDb is null)
                return BadRequest("Error creating category");
            return CreatedAtAction(nameof(GetById), new { id = categoryInDb.Id }, categoryInDb); // Adapt<CategoryResponse>() من حاله بعمل GetCategoryById بس يحوله على
        }

        [HttpPut("{id}")]
        public IActionResult Update([FromRoute] int id, [FromBody] CategoryRequest categoryRequest)
        {
            // Backend validation
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Check for duplicate name (excluding the current category) (case-insensitive) (backend validation)
            var isDuplicate = categoryService.Get(c => c.Name.ToLower() == categoryRequest.Name.ToLower() && c.Id != id) != null;
            if (isDuplicate)
                return BadRequest("Another category with the same name already exists.");

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

        [HttpDelete("Delete All")]
        public IActionResult DeleteAll()
        {
            var categoriesInDb = categoryService.GetCategories();
            if (categoriesInDb.Count() == 0)
                return NotFound();
            foreach (var category in categoriesInDb)
            {
                categoryService.Remove(category.Id);
            }
            return NoContent();
        }
    }
}
