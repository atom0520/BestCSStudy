using System;

namespace BestCSStudy.API.Models
{
    public class Like
    {
        public int LikerId { get; set; }
        public User Liker { get; set; }
        public int PostId { get; set; }        
        public Post Post { get; set; }
        public DateTime Created { get; set; }
        public Like()
        {
            Created = DateTime.Now;
        }
    }
}