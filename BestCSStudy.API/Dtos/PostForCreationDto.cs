using System;
using Microsoft.AspNetCore.Http;

namespace BestCSStudy.API.Dtos
{
    public class PostForCreationDto
    {
        public string title { get; set; }
        public string Description { get; set; }
        public string Category { get; set; }
        public string Tags { get; set; }
        public string Links { get; set; }
        // public IFormFile[] Images { get; set; }
        public IFormFile Image1 { get; set; }
        public IFormFile Image2 { get; set; }
        public IFormFile Image3 { get; set; }
        public IFormFile Image4 { get; set; }
        public IFormFile Image5 { get; set; }
        public DateTime DateAdded { get; set; }

        public PostForCreationDto()
        {
            DateAdded = DateTime.Now;
        }
    }
}