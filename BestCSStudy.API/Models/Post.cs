using System;
using System.Collections.Generic;

namespace BestCSStudy.API.Models
{
    public class Post
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Category { get; set; }
        public string Tags { get; set; }
        public string Links { get; set; }
        public ICollection<PostImage> PostImages { get; set; }
        public DateTime DateAdded { get; set; }
        public ICollection<Like> Likers { get; set; }
    }
}