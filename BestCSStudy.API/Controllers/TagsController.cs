using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using BestCSStudy.API.Data;
using BestCSStudy.API.Dtos;
using BestCSStudy.API.Helpers;
using Microsoft.AspNetCore.Mvc;

namespace BestCSStudy.API.Controllers
{
    [ServiceFilter(typeof(LogUserActivity))]
    [Route("api/[controller]")]
    [ApiController]
    public class TagsController : ControllerBase
    {
        private readonly IAppRepository _repo;
        private readonly IMapper _mapper;
        public TagsController(IAppRepository repo, IMapper mapper)
        {
            _mapper = mapper;
            _repo = repo;
        }

        [HttpGet]
        public async Task<IActionResult> GetTags([FromQuery]TagParams tagParams)
        {
            // var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            // var userFromRepo = await _repo.GetUser(currentUserId);

            // postParams.UserId = currentUserId;

            // if(string.IsNullOrEmpty(userParams.Gender)){
            //     userParams.Gender = userFromRepo.Gender == "male"? "female" : "male";
            // }

            var tags = await _repo.GetTags(tagParams);

            var tagsToReturn = _mapper.Map<IEnumerable<TagToReturnDto>>(tags);

            // Response.AddPagination(posts.CurrentPage, posts.PageSize, 
            //     posts.TotalCount, posts.TotalPages);

            return Ok(tagsToReturn);
        }
    }
}