using System;
using Microsoft.AspNetCore.Http;

namespace BestCSStudy.API.Dtos
{
    public class PostImageForCreationDto
    {
        public string Url { get; set; }
        public IFormFile File { get; set; }
        public DateTime DateAdded { get; set; }
        public string PublicId { get; set; }

        public PostImageForCreationDto()
        {
            DateAdded = DateTime.Now;
        }
    }
}