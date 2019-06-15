using System;
using Microsoft.AspNetCore.Http;

namespace BestCSStudy.API.Dtos
{
    public class PostForUpdateDto
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public string Category { get; set; }
        public string Tags { get; set; }
        public string Links { get; set; }
        public string DeletedImagess { get; set; }
        public IFormFile AddedImage1 { get; set; }
        public IFormFile AddedImage2 { get; set; }
        public IFormFile AddedImage3 { get; set; }
        public IFormFile AddedImage4 { get; set; }
        public int MainImage { get; set; }
        public DateTime Updated { get; set; }
        public PostForUpdateDto()
        {
            Updated = DateTime.Now;
        }
    }
}