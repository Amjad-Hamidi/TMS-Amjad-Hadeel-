namespace TMS.API.DTOs.Categories.Responses
{
    public class CategoryResponse
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string CategoryImage { get; set; }
        public List<string> GeneralSkills { get; set; }

    }
}
