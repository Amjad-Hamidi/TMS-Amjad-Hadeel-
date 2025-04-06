using System.ComponentModel.DataAnnotations;

namespace TMS.API.DTOs.Categories.Requests
{
    public class CategoryRequest
    {
        [Required(ErrorMessage = "Name is required!!!")]
        [MinLength(2)]
        [MaxLength(22)]
        public string Name { get; set; }
        public string Description { get; set; }
    }
}
