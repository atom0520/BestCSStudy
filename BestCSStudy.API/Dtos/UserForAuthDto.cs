using System;
using System.Collections.Generic;

namespace BestCSStudy.API.Dtos
{
    public class UserForAuthDto
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Gender { get; set;}
        public DateTime DateOfBirth { get; set; }
        public DateTime Created { get; set; }
        public DateTime LastActive { get; set; }
        public string Introduction { get; set; }
        public string City { get; set; }
        public string Country { get; set; }
        public string MainPhotoUrl { get; set; }
        public ICollection<int> Posts { get; set; }
        public ICollection<int> LikedPosts { get; set; }
        public ICollection<int> DislikedPosts { get; set; }
    }
}