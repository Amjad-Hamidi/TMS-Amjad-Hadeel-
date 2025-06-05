namespace TMS.API.DTOs.Users.Admin
{
    public class GetStatisticsDto
    {
        public int UsersCount { get; set; }
        public int CompainesCount { get; set; }
        public int SupervisorsCount { get; set; }
        public int TraineesCount { get; set; }
        public int CategoriesCount { get; set; }
        public int TotalTrainingProgramsCount { get; set; }
        public int ApprovedTrainingProgramsCount { get; set; }
        public int RejectedTrainingProgramsCount { get; set; }
        public int PendingTrainingProgramsCount { get; set; }
    }
}
