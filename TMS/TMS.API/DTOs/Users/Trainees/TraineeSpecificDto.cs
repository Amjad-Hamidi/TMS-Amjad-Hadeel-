namespace TMS.API.DTOs.Users.Trainees
{
    public class TraineeSpecificDto
    {
        public int Id { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string? ProfileImageUrl { get; set; }
        public string? CVPath { get; set; }

        public int TrainingProgramId { get; set; }
        public string TrainingProgramName { get; set; }

        public int CategoryId { get; set; }
        public string CategoryName { get; set; }
    }
}
