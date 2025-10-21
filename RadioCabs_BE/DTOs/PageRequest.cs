namespace Radiocabs_BE.DTOs
{
    public class PageRequest
    {
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 20;
    }

    public record PagedResult<T>(IEnumerable<T> Items, int Page, int PageSize, long Total);
}
