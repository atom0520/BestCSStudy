using System.Collections.Generic;
using System.Threading.Tasks;
using BestCSStudy.API.Helpers;
using BestCSStudy.API.Models;

namespace BestCSStudy.API.Data
{
    public interface IAppRepository
    {
         void Add<T>(T entity) where T: class;
         void Delete<T>(T entity) where T: class;
         Task<bool> SaveAll();
         Task<PagedList<User>> GetUsers(UserParams userParams);
         Task<PagedList<Post>> GetPosts(PostParams postParams);
         Task<Post> GetPost(int id);
         Task<Tag> GetTag(string value);
         Task<User> GetUser(int id);
         Task<Photo> GetPhoto(int id);
         Task<PostImage> GetPostImage(int id);
         Task<PostImage> GetPostMainImage(int id);
         Task<Photo> GetMainPhotoForUser(int userId);
         Task<Like> GetLike(int userId, int postId);
         Task<Dislike> GetDislike(int userId, int postId);
         Task<Message> GetMessage(int id);
         Task<PagedList<Message>> GetMessagesForUser(MessageParams messageParams);
         Task<IEnumerable<Message>> GetMessageThread(int userId, int recipientId);
    }
}