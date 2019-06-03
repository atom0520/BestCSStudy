using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using BestCSStudy.API.Data;
using BestCSStudy.API.Dtos;
using BestCSStudy.API.Helpers;
using BestCSStudy.API.Models;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace BestCSStudy.API.Controllers
{
    [ServiceFilter(typeof(LogUserActivity))]
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class PostsController : ControllerBase
    {
        private readonly IDatingRepository _repo;
        private readonly IMapper _mapper;
        private readonly IOptions<CloudinarySettings> _cloudinaryConfig;
        private Cloudinary _cloudinary;
        public PostsController(IDatingRepository repo, IMapper mapper, IOptions<CloudinarySettings> cloudinaryConfig)
        {
            _cloudinaryConfig = cloudinaryConfig;
            _mapper = mapper;
            _repo = repo;

            Account acc = new Account(
                _cloudinaryConfig.Value.CloudName,
                _cloudinaryConfig.Value.ApiKey,
                _cloudinaryConfig.Value.ApiSecret
            );

            _cloudinary = new Cloudinary(acc);

        }

        // [HttpGet]
        // public async Task<IActionResult> GetUsers([FromQuery]UserParams userParams)
        // {
        //     var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

        //     var userFromRepo = await _repo.GetUser(currentUserId);

        //     userParams.UserId = currentUserId;
        //     var users = await _repo.GetUsers(userParams);

        //     var usersToReturn = _mapper.Map<IEnumerable<UserForListDto>>(users);

        //     Response.AddPagination(users.CurrentPage, users.PageSize, 
        //         users.TotalCount, users.TotalPages);

        //     return Ok(usersToReturn);
        // }

        [HttpGet("{id}", Name="GetPost")]
        public async Task<IActionResult> GetPost(int id)
        {
            var post = await _repo.GetPost(id);

            var postToReturn = _mapper.Map<PostForDetailsDto>(post);

            return Ok(postToReturn);
        }

         [HttpPost]
        public async Task<IActionResult> CreatePost([FromForm]PostForCreationDto postForCreationDto)
        {

            var postToCreate = new Post();

            _repo.Add<Post>(postToCreate);
            
            // if(userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            //     return Unauthorized();
            
            // var userFromRepo = await _repo.GetUser(userId);

            // var file = postForCreationDto.Image1;

            // var uploadResult = new ImageUploadResult();

            // if(file.Length > 0){
            //     using (var stream = file.OpenReadStream())
            //     {
            //         var uploadParams = new ImageUploadParams()
            //         {
            //             File = new FileDescription(file.Name, stream),
            //             Transformation = new Transformation().Width(500).Height(500).Crop("fill").Gravity("face")
            //         };

            //         uploadResult = _cloudinary.Upload(uploadParams);
            //     }
            // }

            // postForCreationDto.Url = uploadResult.Uri.ToString();
            // postForCreationDto.PublicId = uploadResult.PublicId;

            // var postImage = _mapper.Map<PostImage>(postImageForCreationDto);

            // if (!userFromRepo.Photos.Any(u=>u.IsMain))
            //     photo.IsMain = true;
            // postImage.PostId = 0;
            
            // userFromRepo.Photos.Add(photo);
            // _repo.Add<PostImage>(postImage);

            // if (await _repo.SaveAll()){

            //     var postImageToReturn = _mapper.Map<PostImageForReturnDto>(postImage);
                
            //     return CreatedAtRoute("GetPostImage", new {id = postImage.Id}, postImageToReturn);
            // }
            return Ok();
            // return BadRequest("Failed to upload the post image.");
        }

        // [HttpPut("{id}")]
        // public async Task<IActionResult> UpdateUser(int id, UserForUpdateDto userForUpdateDto)
        // {
        //     if (id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
        //         return Unauthorized();
            
        //     var userFromRepo = await _repo.GetUser(id);

        //     _mapper.Map(userForUpdateDto, userFromRepo);

        //     if (await _repo.SaveAll())
        //         return NoContent();
            
        //     throw new Exception($"Updating user {id} failed on save");
        // }

        // [HttpPost("{id}/like/{recipientId}")]
        // public async Task<IActionResult> LikePost(int userId, int postId)
        // {
        //     if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
        //         return Unauthorized();
            
        //     var like = await _repo.GetLike(userId, postId);

        //     if (like != null)
        //         return BadRequest("You already like this user");
            
        //     if (await _repo.GetPost(postId)==null)
        //         return NotFound();
            
        //     like = new Like
        //     {
        //         LikerId = userId,
        //         PostId = postId
        //     };

        //     _repo.Add<Like>(like);

        //     if (await _repo.SaveAll())
        //         return Ok();
            
        //     return BadRequest("Failed to like user");
        // }
    }
}