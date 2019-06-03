using System;
using Microsoft.AspNetCore.Http;

namespace BestCSStudy.API.Dtos
{
    public class PostImageForReturnDto
    {
        public int Id { get; set; }
        public string Url { get; set; }
        public DateTime DateAdded { get; set; }
        public bool IsMain { get; set; }
        public string PublicId { get; set; }

        public PostImageForReturnDto()
        {
            DateAdded = DateTime.Now;
        }
    }
}