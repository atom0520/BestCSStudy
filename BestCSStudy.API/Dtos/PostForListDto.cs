using System;
using System.Collections.Generic;

namespace BestCSStudy.API.Dtos
{
    public class PostForListDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Category { get; set; }
        public string Tags { get; set; }
        public string MainPostImageUrl { get; set; }
        public DateTime Created { get; set; }
        public DateTime Updated { get; set; }
        public ICollection<int> Likers { get; set; }
        public ICollection<int> Dislikers { get; set; }
        public UserForPostDetailsAuthorDto Author { get; set; }
    }
}