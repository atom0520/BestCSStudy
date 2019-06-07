using System;

namespace BestCSStudy.API.Models
{
    public class PostImage
    {
        public int Id { get; set; }
        public string Url { get; set; }
        public DateTime DateAdded { get; set; }
        public bool IsMain { get; set; }
        public string PublicId { get; set; }
        public Post Post { get; set; }
        public int PostId { get; set; }
    }
}