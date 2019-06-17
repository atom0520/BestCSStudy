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
        // public string Tags { get; set; }
        public ICollection<PostTag> Tags { get; set; }
        public string Links { get; set; }
        public ICollection<PostImage> PostImages { get; set; }
        public DateTime Created { get; set; }
        public DateTime Updated { get; set; }
        public ICollection<Like> Likers { get; set; }
        public ICollection<Dislike> Dislikers { get; set; }
        public User Author { get; set; }
        public int AuthorId { get; set; }
    }
}