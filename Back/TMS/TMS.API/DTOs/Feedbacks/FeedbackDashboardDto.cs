namespace TMS.API.DTOs.Feedbacks
{
    public class FeedbackDashboardDto
    {
        public int Total { get; set; }
        public Dictionary<string, int> ByType { get; set; }
        public double AverageRating { get; set; }
    }
}
