using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json;

namespace TMS.API.Models
{
    public class Category
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string CategoryImageUrl { get; set; }

        // GeneralSkills ومنصير نتعامل بالكود مع GeneralSkillsJson فاحنا منخزن بس EF لانها مش مدعومة من List<string> لم نستخدم
        public string GeneralSkillsJson { get; set; } 
        [NotMapped] // DB ليس عمود في
        public List<string> GeneralSkills
        {
            get => string.IsNullOrEmpty(GeneralSkillsJson)
                ? new List<string>()
                : JsonSerializer.Deserialize<List<string>>(GeneralSkillsJson); // ["Skill1", "Skill2"] → List<string> <= List الى Json تحويل من 

            set => GeneralSkillsJson = JsonSerializer.Serialize(value); // ["Skill1", "Skill2"] <= Json الى List تحويل من 
        }

        // Navigation Property
        public ICollection<TrainingProgram> TrainingPrograms { get; set; } = new List<TrainingProgram>();

    }
}
