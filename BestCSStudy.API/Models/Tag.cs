using System.Collections.Generic;

namespace BestCSStudy.API.Models
{
    public class Tag
    {
        public int Id { get; set; }
        public string Value { get; set; }
        public ICollection<PostTag> Posts { get; set; }
    }
}