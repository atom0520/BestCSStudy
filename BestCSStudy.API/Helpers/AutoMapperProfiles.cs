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
            CreateMap<User, UserForListDto>()
                .ForMember(dest=>dest.PhotoUrl, opt=>{
                    opt.MapFrom(src => src.Photos.FirstOrDefault(p => p.IsMain).Url);
                })
                .ForMember(dest=>dest.Age, opt=>{
                    opt.MapFrom(d=>d.DateOfBirth.CalculateAge());
                });
            CreateMap<User, UserForDetailsDto>()
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
        }
    }
}