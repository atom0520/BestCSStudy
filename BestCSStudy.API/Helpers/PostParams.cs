namespace BestCSStudy.API.Helpers
{
    public class PostParams
    {
        private const int MaxPageSize = 10;
        public int PageNumber { get; set; } = 1;
        private int pageSize = 10;
        public int PageSize
        {
            get { return pageSize;}
            set { pageSize = (value > MaxPageSize)? MaxPageSize : value; }
        }
    
        public int UserId { get; set; }
        public string Category { get; set; }
        public string Search { get; set; }
        public string OrderBy { get; set; }
        public bool Liked { get; set; }
        public bool Disliked { get; set; }
        public bool UserPosts { get; set; }
    }
}