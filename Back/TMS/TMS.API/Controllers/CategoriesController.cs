using Azure.Core;
using Mapster;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using TMS.API.Data;
using TMS.API.DTOs.Categories.Requests;
using TMS.API.DTOs.Categories.Responses;
using TMS.API.Helpers;
using TMS.API.Models;
using TMS.API.Services.Categories;

namespace TMS.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]              // Primary Constructor
    public class CategoriesController(ICategoryService categoryService) : ControllerBase
    {
        private readonly ICategoryService _categoryService = categoryService;

        /* // لاحقا بفعلها
        [HttpGet("check-name")] // هون حاليا ما بتفيد , يمكن تفيد لو بدنا نعمل بالفرونت وهو يكتب تلقائي يقله انو الاسم مستخدم
        public IActionResult CheckName(string name)
        {
            var exists = categoryService.Get(c => c.Name.ToLower() == name.ToLower()) != null;
            return Ok(exists);
        }
        */


        [HttpGet("")]
        public async Task<IActionResult> GetAll()
        {
            var categories = await _categoryService.GetAsync();

            return Ok(categories.Adapt<IEnumerable<CategoryResponse>>());
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var category = await _categoryService.GetOneAsync(c => c.Id == id);

            return category == null? NotFound() : Ok(category.Adapt<CategoryResponse>()); // Adapt<CategoryResponse>() : CategoryResponse الواحدة فبظهرهمش لاني بستخدم Category الي بكونوا داخل ال group of Training Programs عشان نحل مشكلة ال
        }

        [HttpPost("")]
        [Authorize(Roles = $"{StaticData.Admin}")] 
        public async Task<IActionResult> Create([FromForm] CategoryRequestDto categoryRequest)
        {
            // Backend validation
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Check for duplicate name (case-insensitive) (backend validation)
            var isDuplicate = (await _categoryService.GetOneAsync(c => c.Name.ToLower() == categoryRequest.Name.ToLower())) != null;
            if (isDuplicate)
                return BadRequest("Category name already exists.");

            var categoryInDb = await _categoryService.AddAsync(categoryRequest, HttpContext); // Navigation => ICollection <TrainingProgram> الوضع الافتراضي هون بحتوي برضو ال
            if (categoryInDb is null)
                return BadRequest("Error creating category");
            return CreatedAtAction(nameof(GetById), new { id = categoryInDb.Id }, categoryInDb.Adapt<CategoryResponse>()); // Adapt<CategoryResponse>() من حاله بعمل GetCategoryById بس يحوله على
        }

        [HttpPut("{id}")]
        [Authorize(Roles = $"{StaticData.Admin}")]
        public async Task<IActionResult> Update([FromRoute] int id, [FromForm] UpdateCategoryDto updateCategoryDto)
        {
            // Backend validation
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Check for duplicate name (excluding the current category) (case-insensitive) (backend validation)
            if (!string.IsNullOrWhiteSpace(updateCategoryDto.Name))
            {
                var isDuplicate = (await _categoryService.GetOneAsync(
                    c => c.Name.ToLower() == updateCategoryDto.Name.ToLower() && c.Id != id)) != null;

                if (isDuplicate)
                    return BadRequest("Another category with the same name already exists.");
            }

            var updated = await _categoryService.EditAsync(id, updateCategoryDto, HttpContext);
            if(!updated)
                return NotFound();
            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = $"{StaticData.Admin}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _categoryService.RemoveAsync(id, CancellationToken.None);
            if (!deleted)
                return NotFound("This category not found to delete.");
            return NoContent();
        }

        [HttpDelete("delete-all")]
        [Authorize(Roles = $"{StaticData.Admin}")]
        public async Task<IActionResult> DeleteAll()
        {
            var deleted = await _categoryService.RemoveAllAsync(CancellationToken.None);

            return deleted ? NoContent() : NotFound("No categories found to delete.");
        }
    }
}
