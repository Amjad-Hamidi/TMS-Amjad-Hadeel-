namespace TMS.API.DTOs.Pages
{
    public class PagedResult <T> where T : class
    {
        public IEnumerable<T> Items { get; set; } = new List<T>();
        public int TotalCount { get; set; }
        public int Page { get; set; }
        public int Limit { get; set; }

        public int TotalPages => (int)Math.Ceiling((double)TotalCount / Limit);
    }
}
