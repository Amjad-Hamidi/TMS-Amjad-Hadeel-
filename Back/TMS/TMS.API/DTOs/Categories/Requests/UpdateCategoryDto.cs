using System.ComponentModel.DataAnnotations;

namespace TMS.API.DTOs.Categories.Requests
{
    public class UpdateCategoryDto
    {
        //[Required(ErrorMessage = "Category name is required.")] مش ضرورية لانو ضامنين لما يضيف اصلا بدخلها فمش رح اطالبه لما يعدل يدخلها
        [MinLength(2, ErrorMessage = "Category name must be at least 2 characters long.")]
        [MaxLength(30, ErrorMessage = "Category name must not exceed 30 characters.")]
        public string? Name { get; set; }
        [MaxLength(200, ErrorMessage = "Description must not exceed 200 characters.")]
        public string? Description { get; set; }
        public IFormFile? CategoryImageFile { get; set; }
    }
}
