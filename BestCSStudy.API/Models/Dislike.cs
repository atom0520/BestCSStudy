using System;

namespace BestCSStudy.API.Models
{
    public class Dislike
    {
        public int DislikerId { get; set; }
        public User Disliker { get; set; }
        public int PostId { get; set; }        
        public Post Post { get; set; }
        public DateTime Created { get; set; }
    }
}