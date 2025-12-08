namespace driving_service.DTOs
{
    public class PageRequest
    {
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? Search { get; set; }
        public string? SortBy { get; set; }
        public bool SortDescending { get; set; } = false;
        public long? CompanyId { get; set; } // Added
        public string? Role { get; set; } // Added
        
        // Vehicle instance filters
        public long? ProvinceId { get; set; }
        public long? ZoneId { get; set; }
        public long? WardId { get; set; }
        public long? DriverId { get; set; }
        public int? Weekday { get; set; } // 0-6 (Sunday to Saturday)
        public DateTime? WorkDate { get; set; } // For driver schedule date filter
    }

    public class PagedResult<T>
    {
        public List<T> Items { get; set; } = new();
        public int TotalCount { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
        public bool HasPreviousPage => Page > 1;
        public bool HasNextPage => Page < TotalPages;
    }
}





