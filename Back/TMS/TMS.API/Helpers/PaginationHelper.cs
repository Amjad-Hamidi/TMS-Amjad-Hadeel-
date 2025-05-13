namespace TMS.API.Helpers
{
    public class PaginationHelper
    {
        public static (int Page, int Limit) Normalize(int page, int limit)
        {
            var normalizedPage = page < 1 ? 1 : page;
            var normalizedLimit = limit < 1 ? 10 : limit;
            return (normalizedPage, normalizedLimit);
        }
    }
}
