using BestCSStudy.API.Models;

namespace BestCSStudy.API.Dtos
{
    public class LikeForPostDetailsDto
    {
        public int LikerId { get; set; }
        public UserForDetailsDto Liker { get; set; }
    }
}