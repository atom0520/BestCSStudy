using System;

namespace BestCSStudy.API.Models
{
    public class PostTag
    {
        public int TagId { get; set; }
        public Tag Tag { get; set; }
        public int PostId { get; set; }        
        public Post Post { get; set; }
        public DateTime Created { get; set; }
        public PostTag()
        {
            Created = DateTime.Now;
        }
    }
}