using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using BestCSStudy.API.Data;
using BestCSStudy.API.Dtos;
using BestCSStudy.API.Helpers;
using BestCSStudy.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BestCSStudy.API.Controllers
{
    [ServiceFilter(typeof(LogUserActivity))]
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IAppRepository _repo;
        private readonly IMapper _mapper;
        public UsersController(IAppRepository repo, IMapper mapper)
        {
            _mapper = mapper;
            _repo = repo;

        }

        // [HttpGet]
        // public async Task<IActionResult> GetUsers([FromQuery]UserParams userParams)
        // {
        //     var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

        //     var userFromRepo = await _repo.GetUser(currentUserId);

        //     userParams.UserId = currentUserId;

        //     // if(string.IsNullOrEmpty(userParams.Gender)){
        //     //     userParams.Gender = userFromRepo.Gender == "male"? "female" : "male";
        //     // }

        //     var users = await _repo.GetUsers(userParams);

        //     var usersToReturn = _mapper.Map<IEnumerable<UserForListDto>>(users);

        //     Response.AddPagination(users.CurrentPage, users.PageSize, 
        //         users.TotalCount, users.TotalPages);

        //     return Ok(usersToReturn);
        // }

        [HttpGet("{id}", Name="GetUser")]
        public async Task<IActionResult> GetUser(int id)
        {
            var user = await _repo.GetUser(id);

            var userToReturn = _mapper.Map<UserForDetailsDto>(user);

            return Ok(userToReturn);
        }

        [HttpGet("auth/{id}")]
        public async Task<IActionResult> GetAuthUser(int id)
        {
            var user = await _repo.GetUser(id);

            var userToReturn = _mapper.Map<UserForAuthDto>(user);

            return Ok(userToReturn);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, UserForUpdateDto userForUpdateDto)
        {
            if (id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
            
            var userFromRepo = await _repo.GetUser(id);

            _mapper.Map(userForUpdateDto, userFromRepo);

            if (await _repo.SaveAll())
                return NoContent();
            
            throw new Exception($"Updating user {id} failed on save");
        }

        [HttpPost("{userId}/likePost/{postId}")]
        public async Task<IActionResult> LikePost(int userId, int postId)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
            
            if (await _repo.GetPost(postId)==null)
                return NotFound();

            var like = await _repo.GetLike(userId, postId);

            if (like != null)
                return BadRequest("You already liked this post!");
            
            var dislike = await _repo.GetDislike(userId, postId);

            if (dislike != null)
                _repo.Delete<Dislike>(dislike);
            
            like = new Like
            {
                LikerId = userId,
                PostId = postId
            };

            _repo.Add<Like>(like);

            if (await _repo.SaveAll())
                return Ok();
            
            return BadRequest("Failed to like post!");
        }

        [HttpPost("{userId}/cancelLikedPost/{postId}")]
        public async Task<IActionResult> CanceLikedPost(int userId, int postId)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
            
            if (await _repo.GetPost(postId)==null)
                return NotFound();
                
            var like = await _repo.GetLike(userId, postId);

            if (like == null)
                return BadRequest("You haven't liked this post!");
   
            _repo.Delete<Like>(like);

            if (await _repo.SaveAll())
                return Ok();
            
            return BadRequest("Failed to cancel liked post!");
        }

        [HttpPost("{userId}/dislikePost/{postId}")]
        public async Task<IActionResult> DislikePost(int userId, int postId)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
            
            if (await _repo.GetPost(postId)==null)
                return NotFound();
            
            var dislike = await _repo.GetDislike(userId, postId);

            if (dislike != null)
                return BadRequest("You already disliked this post!");
            
            var like = await _repo.GetLike(userId, postId);

            if (like != null)
                _repo.Delete<Like>(like);

            dislike = new Dislike
            {
                DislikerId = userId,
                PostId = postId
            };

            _repo.Add<Dislike>(dislike);

            if (await _repo.SaveAll())
                return Ok();
            
            return BadRequest("Failed to dislike post!");
        }

        [HttpPost("{userId}/cancelDislikedPost/{postId}")]
        public async Task<IActionResult> CancelDislikedPost(int userId, int postId)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
            
            var dislike = await _repo.GetDislike(userId, postId);

            if (dislike == null)
                return BadRequest("You haven't disliked this post!");
            
            if (await _repo.GetPost(postId)==null)
                return NotFound();

            _repo.Delete<Dislike>(dislike);

            if (await _repo.SaveAll())
                return Ok();
            
            return BadRequest("Failed to cancel disliked post!");
        }
    }
}