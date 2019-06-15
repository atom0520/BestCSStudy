using System.Linq;
using AutoMapper;
using BestCSStudy.API.Dtos;
using BestCSStudy.API.Models;

namespace BestCSStudy.API.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<User, UserForAuthDto>()
                .ForMember(dest=>dest.MainPhotoUrl, opt=>{
                    opt.MapFrom(src => src.Photos.FirstOrDefault(p => p.IsMain).Url);
                })
                .ForMember(dest=>dest.LikedPosts, opt=>{
                    opt.MapFrom(src=>src.LikedPosts.Select(p=>p.PostId));
                })
                .ForMember(dest=>dest.DislikedPosts, opt=>{
                    opt.MapFrom(src=>src.DislikedPosts.Select(p=>p.PostId));
                })
                .ForMember(dest=>dest.Posts, opt=>{
                    opt.MapFrom(src=>src.Posts.Select(p=>p.Id));
                });

            CreateMap<User, UserForDetailsDto>()
               .ForMember(dest=>dest.PhotoUrl, opt=>{
                    opt.MapFrom(src => src.Photos.FirstOrDefault(p => p.IsMain).Url);
                });

            CreateMap<User, UserForPostDetailsAuthorDto>()
               .ForMember(dest=>dest.PhotoUrl, opt=>{
                    opt.MapFrom(src => src.Photos.FirstOrDefault(p => p.IsMain).Url);
                });
                // .ForMember(dest=>dest.Age, opt=>{
                //     opt.MapFrom(d=>d.DateOfBirth.CalculateAge());
                // });
            CreateMap<Photo, PhotoForDetailsDto>();
            CreateMap<UserForUpdateDto, User>();
            CreateMap<Photo, PhotoForReturnDto>();
            CreateMap<PhotoForCreationDto, Photo>();

            CreateMap<PostImage, PostImageForReturnDto>();
            CreateMap<PostImageForCreationDto, PostImage>();

            CreateMap<UserForRegisterDto, User>();
            
            CreateMap<MessageForCreationDto, Message>().ReverseMap();
            CreateMap<Message, MessageToReturnDto>()
                .ForMember(dest => dest.SenderPhotoUrl, opt => opt.MapFrom(src => src.Sender.Photos.FirstOrDefault(p=>p.IsMain).Url))
                .ForMember(dest => dest.RecipientPhotoUrl, opt => opt.MapFrom(src => src.Recipient.Photos.FirstOrDefault(p=>p.IsMain).Url));
            
            CreateMap<Post, PostForDetailsDto>();
            CreateMap<PostForCreationDto, Post>();
            CreateMap<Post, PostForListDto>()
                .ForMember(dest=>dest.MainPostImageUrl, opt=>{
                    opt.MapFrom(src => src.PostImages.FirstOrDefault(p => p.IsMain).Url);
                })
                .ForMember(dest=>dest.Likers, opt=>{
                    opt.MapFrom(d=>d.Likers.Select(u=>u.LikerId));
                })
                .ForMember(dest=>dest.Dislikers, opt=>{
                    opt.MapFrom(d=>d.Dislikers.Select(u=>u.DislikerId));
                });
            
             CreateMap<Post, LikedPostDto>()
                .ForMember(dest=>dest.MainPostImageUrl, opt=>{
                    opt.MapFrom(src => src.PostImages.FirstOrDefault(p => p.IsMain).Url);
                })
                .ForMember(dest=>dest.Likers, opt=>{
                    opt.MapFrom(d=>d.Likers.Select(u=>u.LikerId));
                })
                .ForMember(dest=>dest.Dislikers, opt=>{
                    opt.MapFrom(d=>d.Dislikers.Select(u=>u.DislikerId));
                });
        }
    }
}