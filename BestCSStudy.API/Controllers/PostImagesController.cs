using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using BestCSStudy.API.Data;
using BestCSStudy.API.Dtos;
using BestCSStudy.API.Helpers;
using BestCSStudy.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace BestCSStudy.API.Controllers
{
    // [Authorize]
    [Route("api/postImages")]
    public class PostImagesController : ControllerBase
    {
        private readonly IAppRepository _repo;
        private readonly IMapper _mapper;
        private readonly IOptions<CloudinarySettings> _cloudinaryConfig;
        private Cloudinary _cloudinary;

        public PostImagesController(IAppRepository repo, IMapper mapper, IOptions<CloudinarySettings> cloudinaryConfig)
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

        [HttpGet("{id}", Name="GetPostImage")]
        public async Task<IActionResult> GetPostImage(int id)
        {
            var postImageFromRepo = await _repo.GetPostImage(id);

            var postImage = _mapper.Map<PostImageForReturnDto>(postImageFromRepo);

            return Ok(postImage);
        }
        
        [HttpPost]
        public async Task<IActionResult> UploadPostImage([FromForm]PostImageForCreationDto postImageForCreationDto)
        {
            // if(userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            //     return Unauthorized();
            
            // var userFromRepo = await _repo.GetUser(userId);

            var file = postImageForCreationDto.File;

            var uploadResult = new ImageUploadResult();

            if(file.Length > 0){
                using (var stream = file.OpenReadStream())
                {
                    var uploadParams = new ImageUploadParams()
                    {
                        File = new FileDescription(file.Name, stream),
                        Transformation = new Transformation().Width(500).Height(500).Crop("fill").Gravity("face")
                    };

                    uploadResult = _cloudinary.Upload(uploadParams);
                }
            }

            postImageForCreationDto.Url = uploadResult.Uri.ToString();
            postImageForCreationDto.PublicId = uploadResult.PublicId;

            var postImage = _mapper.Map<PostImage>(postImageForCreationDto);

            // if (!userFromRepo.Photos.Any(u=>u.IsMain))
            //     photo.IsMain = true;
            // postImage.PostId = 0;
            
            // userFromRepo.Photos.Add(photo);
            _repo.Add<PostImage>(postImage);

            if (await _repo.SaveAll()){

                var postImageToReturn = _mapper.Map<PostImageForReturnDto>(postImage);
                
                return CreatedAtRoute("GetPostImage", new {id = postImage.Id}, postImageToReturn);
            }

            return BadRequest("Failed to upload the post image.");
        }
        
        [HttpPost("{id}")]
        public async Task<IActionResult> AddImageForPost(int id, 
            [FromForm]PostImageForCreationDto postImageForCreationDto)
        {
            var postFromRepo = await _repo.GetPost(id);

            var file = postImageForCreationDto.File;

            var uploadResult = new ImageUploadResult();

            if(file.Length > 0){
                using (var stream = file.OpenReadStream())
                {
                    var uploadParams = new ImageUploadParams()
                    {
                        File = new FileDescription(file.Name, stream),
                        Transformation = new Transformation().Width(500).Height(500).Crop("fill").Gravity("face")
                    };

                    uploadResult = _cloudinary.Upload(uploadParams);
                }
            }

            postImageForCreationDto.Url = uploadResult.Uri.ToString();
            postImageForCreationDto.PublicId = uploadResult.PublicId;

            var postImage = _mapper.Map<PostImage>(postImageForCreationDto);

            if (!postFromRepo.PostImages.Any(u=>u.IsMain)){}
                // postImage.IsMain = true;
            
            postFromRepo.PostImages.Add(postImage);

            if (await _repo.SaveAll()){

                var postImageToReturn = _mapper.Map<PostImageForReturnDto>(postImage);
                
                return CreatedAtRoute("GetPostImage", new {id = postImage.Id}, postImageToReturn);
            }

            return BadRequest("Could not add the post image.");
        }


        [HttpPost("{id}/setMain")]
        public async Task<IActionResult> SetMainPhoto(int userId, int id)
        {
            if(userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
            
            var user = await _repo.GetUser(userId);

            if (!user.Photos.Any(p => p.Id == id))
                return Unauthorized();

            var photoFromRepo = await _repo.GetPhoto(id);

            if (photoFromRepo.IsMain)
                return BadRequest("This is already the main photo");

            var currentMainPhoto = await _repo.GetMainPhotoForUser(userId);

            currentMainPhoto.IsMain = false;

            photoFromRepo.IsMain = true;

            var photo = _mapper.Map<PhotoForReturnDto>(photoFromRepo);

            if(await _repo.SaveAll())
                return Ok(photo);

            return BadRequest("Could not set photo to main");
        }
    
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePhoto(int userId, int id)
        {
            if(userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var user = await _repo.GetUser(userId);

            if (!user.Photos.Any(p => p.Id == id))
                return Unauthorized();

            var photoFromRepo = await _repo.GetPhoto(id);

            if (photoFromRepo.IsMain)
                return BadRequest("You cannot delete your main photo");
            
            if (photoFromRepo.PublicId != null)
            {
                var deleteParams = new DeletionParams(photoFromRepo.PublicId);

                var result = _cloudinary.Destroy(deleteParams);

                if (result.Result == "ok") {
                    _repo.Delete(photoFromRepo);
                }
            }
            else{
                _repo.Delete(photoFromRepo);
            }

            if (await _repo.SaveAll())
                return Ok();
            
            return BadRequest("Failed to delete the photo");
        }
    }
}