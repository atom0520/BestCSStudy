using System;
using System.Collections.Generic;
using BestCSStudy.API.Models;

namespace BestCSStudy.API.Dtos
{
    public class PostForDetailsDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Category { get; set; }
        public ICollection<string> Tags { get; set; }
        public string Links { get; set; }
        public ICollection<PostImageForDetailsDto> PostImages { get; set; }
        public ICollection<LikeForPostDetailsDto> Likers { get; set; }
        public ICollection<Dislike> Dislikers { get; set; }
        public UserForPostDetailsAuthorDto Author { get; set; }
        public DateTime Created { get; set; }
        public DateTime Updated { get; set; }
    }
}