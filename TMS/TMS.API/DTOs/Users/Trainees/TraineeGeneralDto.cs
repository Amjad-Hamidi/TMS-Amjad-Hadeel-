using TMS.API.DTOs.Categories.Responses;
using TMS.API.DTOs.TrainingPrograms.Responses;
using TMS.API.Models;

namespace TMS.API.DTOs.Users.Trainees
{
    public class TraineeGeneralDto
    {
        public int Id { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string? ProfileImageUrl { get; set; }
        public string? CVPath { get; set; }
        public IReadOnlyList<TrainingProgramSummaryDto> TrainingPrograms { get; set; }
        public IReadOnlyList<CategorySummaryDto> Categories { get; set; }
    }
}
