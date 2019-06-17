using System;
using System.Collections.Generic;
using System.Linq;
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
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace BestCSStudy.API.Controllers
{
    [ServiceFilter(typeof(LogUserActivity))]
    [Route("api/[controller]")]
    [ApiController]
    public class PostsController : ControllerBase
    {
        private readonly IAppRepository _repo;
        private readonly IMapper _mapper;
        private readonly IOptions<CloudinarySettings> _cloudinaryConfig;
        private Cloudinary _cloudinary;
        public PostsController(IAppRepository repo, IMapper mapper, IOptions<CloudinarySettings> cloudinaryConfig)
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

        [HttpGet]
        public async Task<IActionResult> GetPosts([FromQuery]PostParams postParams)
        {
            var userClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            if(userClaim!=null)
            {
                var userId = int.Parse(userClaim.Value);
                 postParams.UserId = userId;
            }
            // var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            // var userFromRepo = await _repo.GetUser(currentUserId);

            // postParams.UserId = currentUserId;

            // if(string.IsNullOrEmpty(userParams.Gender)){
            //     userParams.Gender = userFromRepo.Gender == "male"? "female" : "male";
            // }

            var posts = await _repo.GetPosts(postParams);

            var postsToReturn = _mapper.Map<IEnumerable<PostForListDto>>(posts);

            Response.AddPagination(posts.CurrentPage, posts.PageSize, 
                posts.TotalCount, posts.TotalPages);

            return Ok(postsToReturn);
        }

        [HttpGet("liked/{userId}")]
        public async Task<IActionResult> GetUserLikedPosts(int userId, [FromQuery]PostParams postParams)
        {
            if(userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            postParams.UserId = userId;

            // if(string.IsNullOrEmpty(userParams.Gender)){
            //     userParams.Gender = userFromRepo.Gender == "male"? "female" : "male";
            // }

            var posts = await _repo.GetPosts(postParams);

            // var postsToReturn = _mapper.Map<PagedList<Post>, List<LikedPostDto>>(posts);
            var postsToReturn = _mapper.Map<PagedList<Post>, List<LikedPostDto>>(posts,  
                opt => opt.AfterMap((src, dest) =>
                {
                    for(int i=0; i<dest.Count(); i++){
                        var newPost = dest[i];
                        var oldPost = src[i];
                        newPost.LikedTime = oldPost.Likers.FirstOrDefault(l=>l.LikerId==userId).Created;
                    }
                })
            );

            Response.AddPagination(posts.CurrentPage, posts.PageSize, 
                posts.TotalCount, posts.TotalPages);

            return Ok(postsToReturn);
        }

        [HttpGet("userPosts/{userId}")]
        public async Task<IActionResult> GetUserPosts(int userId, [FromQuery]PostParams postParams)
        {
            var userRequesting = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            // if(userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            //     return Unauthorized();

            postParams.UserId = userId;

            var posts = await _repo.GetPosts(postParams);

            var postsToReturn = _mapper.Map<IEnumerable<PostForListDto>>(posts);

            Response.AddPagination(posts.CurrentPage, posts.PageSize, 
                posts.TotalCount, posts.TotalPages);

            return Ok(postsToReturn);
        }

       
        // [Authorize]
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
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            
            var userFromRepo = await _repo.GetUser(userId);
            var postToCreate = new Post();

            postToCreate.Title = postForCreationDto.Title;
            postToCreate.Description = postForCreationDto.Description;
            postToCreate.Category = postForCreationDto.Category;
            postToCreate.Links = postForCreationDto.Links;
            postToCreate.Created = postForCreationDto.Created;
            postToCreate.Updated = postForCreationDto.Updated;
            // var postToCreate = _mapper.Map<Post>(postForCreationDto);

            userFromRepo.Posts.Add(postToCreate);
            // _repo.Add<Post>(postToCreate);
            await _repo.SaveAll();
            
            var postFromRepo = await _repo.GetPost(postToCreate.Id);

            var tags = postForCreationDto.Tags.Split(",");
            for(int i=0; i<tags.Length; i++){

                var tag = await _repo.GetTag(tags[i]);

                if(tag==null){
                    tag =new Tag {
                        Value = tags[i]
                    };

                    _repo.Add(tag);
                    await _repo.SaveAll();
                    // tag = await _repo.GetTag(tags[i]);
                }
                
                var postTag = new PostTag {
                    PostId = postFromRepo.Id,
                    TagId = tag.Id
                };
                
                postFromRepo.Tags.Add(postTag);
            }

            var files = new IFormFile[]{
                postForCreationDto.Image1, 
                postForCreationDto.Image2, 
                postForCreationDto.Image3, 
                postForCreationDto.Image4, 
                postForCreationDto.Image5
                };
            
            for(int i=0; i<files.Length; i++){
                var file = files[i];
                if(file==null || file.Length <= 0) continue;
                var uploadResult = new ImageUploadResult();
     
                using (var stream = file.OpenReadStream())
                {
                    var uploadParams = new ImageUploadParams()
                    {
                        File = new FileDescription(file.Name, stream),
                        Transformation = new Transformation().Width(500).Height(500).Crop("fill").Gravity("face")
                    };

                    uploadResult = _cloudinary.Upload(uploadParams);
                }
        
                var postImage = new PostImage();
                postImage.DateAdded = DateTime.Now;
                postImage.Url = uploadResult.Uri.ToString();
                postImage.PublicId = uploadResult.PublicId;

                // _repo.Add<PostImage>(postImageToCreate);
                if (i==postForCreationDto.MainImage)
                    postImage.IsMain = true;
                postFromRepo.PostImages.Add(postImage);
            }

           
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

            if (await _repo.SaveAll()){

                var postToReturn = _mapper.Map<PostForDetailsDto>(postToCreate);
                return CreatedAtRoute("GetPost", new {controller="Posts", id=postToCreate.Id}, postToReturn);
            }
         
            return BadRequest("Failed to create post.");
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePost(int id, [FromForm]PostForUpdateDto postForUpdateDto)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            
            var user = await _repo.GetUser(userId);

            if (!user.Posts.Any(p => p.Id == id))
                return Unauthorized();

            var postFromRepo = await _repo.GetPost(id);
            // var postToCreate = new Post();

            postFromRepo.Title = postForUpdateDto.Title;
            postFromRepo.Description = postForUpdateDto.Description;
            postFromRepo.Category = postForUpdateDto.Category;
            // postFromRepo.Tags = postForUpdateDto.Tags;
            postFromRepo.Links = postForUpdateDto.Links;
            postFromRepo.Updated = postForUpdateDto.Updated;

            var newTags = postForUpdateDto.Tags.Split(",").ToList();
            foreach(var oldTag in postFromRepo.Tags){
                var index = newTags.IndexOf(oldTag.Tag.Value);
                if(index==-1){
                    _repo.Delete(oldTag);
                }
                else{
                    newTags.RemoveAt(index);
                }
            }

            foreach(var newTag in newTags){
                var tag = await _repo.GetTag(newTag);

                if(tag==null){
                    tag =new Tag {
                        Value = newTag
                    };

                    _repo.Add(tag);
                    await _repo.SaveAll();
                }
                
                var postTag = new PostTag {
                    PostId = postFromRepo.Id,
                    TagId = tag.Id
                };
                
                postFromRepo.Tags.Add(postTag);
            }

            var postOldMainImage = await _repo.GetPostMainImage(id);
            if(postOldMainImage!= null && postOldMainImage.Id != -postForUpdateDto.MainImage){
                postOldMainImage.IsMain = false;

                if(postForUpdateDto.MainImage<0){
                    var postImageFromRepo = await _repo.GetPostImage(-postForUpdateDto.MainImage);
                    postImageFromRepo.IsMain = true;
                }
            }

            if(postForUpdateDto.DeletedImages!=null){
                var deletedImageIds = postForUpdateDto.DeletedImages.Split(",");

                for(int i=0; i<deletedImageIds.Length; i++){
                    int postImageId = Int32.Parse(deletedImageIds[i]);

                    if (!postFromRepo.PostImages.Any(p => p.Id == postImageId))
                        return BadRequest("Failed to update post.");

                    var postImageFromRepo = await _repo.GetPostImage(postImageId);

                    if (postImageFromRepo.PublicId != null)
                    {
                        var deleteParams = new DeletionParams(postImageFromRepo.PublicId);

                        var result = _cloudinary.Destroy(deleteParams);

                        if (result.Result == "ok") {
                            _repo.Delete(postImageFromRepo);
                        }
                    }
                    else{
                        _repo.Delete(postImageFromRepo);
                    }
                }
            }

            var files = new IFormFile[]{
                postForUpdateDto.AddedImage1, 
                postForUpdateDto.AddedImage2, 
                postForUpdateDto.AddedImage3, 
                postForUpdateDto.AddedImage4
                };
            
            for(int i=0; i<files.Length; i++){
                var file = files[i];
                if(file==null || file.Length <= 0) continue;
                var uploadResult = new ImageUploadResult();
     
                using (var stream = file.OpenReadStream())
                {
                    var uploadParams = new ImageUploadParams()
                    {
                        File = new FileDescription(file.Name, stream),
                        Transformation = new Transformation().Width(500).Height(500).Crop("fill").Gravity("face")
                    };

                    uploadResult = _cloudinary.Upload(uploadParams);
                }
        
                var postImage = new PostImage();
                postImage.DateAdded = DateTime.Now;
                postImage.Url = uploadResult.Uri.ToString();
                postImage.PublicId = uploadResult.PublicId;

                // _repo.Add<PostImage>(postImageToCreate);
                if (i==postForUpdateDto.MainImage)
                    postImage.IsMain = true;
                postFromRepo.PostImages.Add(postImage);
            }

            // await _repo.SaveAll();
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

            if (await _repo.SaveAll()){

                var postToReturn = _mapper.Map<PostForDetailsDto>(postFromRepo);
                return CreatedAtRoute("GetPost", new {controller="Posts", id=postFromRepo.Id}, postToReturn);
            }
         
            return BadRequest("Failed to create post.");
        }
    }
}