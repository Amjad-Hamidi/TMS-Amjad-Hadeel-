namespace TMS.API.Models
{
    public class Category
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }


        // Navigation Property
        public ICollection<TrainingProgram> TrainingPrograms { get; set; } = new List<TrainingProgram>();

    }
}
