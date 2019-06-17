using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BestCSStudy.API.Helpers;
using BestCSStudy.API.Models;
using Microsoft.EntityFrameworkCore;

namespace BestCSStudy.API.Data
{
    public class AppRepository : IAppRepository
    {
        private readonly DataContext _context;
        public AppRepository(DataContext context)
        {
            _context = context;
        }

        public void Add<T>(T entity) where T : class
        {
            _context.Add(entity);
        }

        public void Delete<T>(T entity) where T : class
        {
            _context.Remove(entity);
        }

        public async Task<Like> GetLike(int userId, int postId)
        {
            return await _context.Likes.FirstOrDefaultAsync(e=>e.LikerId==userId&&e.PostId==postId);
        }
        public async Task<Dislike> GetDislike(int userId, int postId)
        {
            return await _context.Dislikes.FirstOrDefaultAsync(e=>e.DislikerId==userId&&e.PostId==postId);
        }

        public async Task<Photo> GetMainPhotoForUser(int userId)
        {
            return await _context.Photos.Where(u => u.UserId==userId)
            .FirstOrDefaultAsync(p=>p.IsMain);
        }

        public async Task<Photo> GetPhoto(int id)
        {
            var photo = await _context.Photos.FirstOrDefaultAsync(p => p.Id == id);

            return photo;
        }
        public async Task<PostImage> GetPostImage(int id)
        {
            var postImage = await _context.PostImages.FirstOrDefaultAsync(p => p.Id == id);

            return postImage;
        }
        public async Task<PostImage> GetPostMainImage(int postId)
        {
            return await _context.PostImages.Where(p => p.PostId==postId)
            .FirstOrDefaultAsync(p=>p.IsMain);
        }
        public async Task<User> GetUser(int id)
        {
            var user = await _context.Users.Include(p => p.Photos).Include(p => p.Posts).FirstOrDefaultAsync(u => u.Id == id);

            return user;
        }
        public async Task<Post> GetPost(int id)
        {
            var post = await _context.Posts.Include(p => p.PostImages).Include(p => p.Author).ThenInclude(a=>a.Photos).Include(p => p.Likers).Include(p => p.Dislikers).Include(p => p.Tags).ThenInclude(t=>t.Tag).FirstOrDefaultAsync(p => p.Id == id);

            return post;
        }

        // public async Task<IEnumerable<User>> GetUsers()
        // {
        //     var users = await _context.Users.Include(p => p.Photos).ToListAsync();

        //     return users;
        // }

        public async Task<PagedList<User>> GetUsers(UserParams userParams)
        {
            var users =  _context.Users.Include(p => p.Photos)
                .OrderByDescending(u=>u.LastActive).AsQueryable();

            users = users.Where(u=>u.Id != userParams.UserId);

            if (userParams.Gender != null){
                users = users.Where(u=>u.Gender == userParams.Gender);
            }

            if (userParams.Likers)
            {
                var userLikers = await GetUserLikes(userParams.UserId, true);
                users = users.Where(u => userLikers.Contains(u.Id));
            }

            if (userParams.Likees)
            {
                var userLikees = await GetUserLikes(userParams.UserId, false);
                users = users.Where(u => userLikees.Contains(u.Id));
            }

            // if (userParams.MinAge != 18 || userParams.MaxAge != 99){
                var minDob = DateTime.Today.AddYears(-userParams.MaxAge-1);
                var maxDob = DateTime.Today.AddYears(-userParams.MinAge);

                users = users.Where(u => u.DateOfBirth>minDob && u.DateOfBirth<=maxDob);
            // }
            if(!string.IsNullOrEmpty(userParams.OrderBy)){
                switch (userParams.OrderBy) {
                    case "created":
                        users = users.OrderByDescending(u => u.Created);
                        break;
                    default:
                        users = users.OrderByDescending(u=>u.LastActive);
                        break;
                }
            }

            return await PagedList<User>.CreateAsync(users, userParams.PageNumber, userParams.PageSize);
        }
        public async Task<PagedList<Post>> GetPosts(PostParams postParams)
        {
            var posts =  _context.Posts.Include(p => p.PostImages).Include(p => p.Likers).Include(p => p.Dislikers)
                .Include(p => p.Author).ThenInclude(a=>a.Photos).Include(p => p.Tags).ThenInclude(t=>t.Tag)
                .OrderByDescending(u=>u.Updated).AsQueryable();

            // posts = posts.Where(u=>u.Id != userParams.UserId);

            if (postParams.Category != null && postParams.Category != ""){
                posts = posts.Where(p=>p.Category == postParams.Category);
            }

            var postsRelevance = new Dictionary<int, int>();
            if(postParams.Search != null && postParams.Search != ""){
                foreach (var post in posts)
                {
                    if(!postsRelevance.ContainsKey(post.Id)){
                        postsRelevance.Add(post.Id, 0);
                    }

                    postsRelevance[post.Id]+=Global.CountStringOccurrences(post.Title, postParams.Search);
                    postsRelevance[post.Id]+=Global.CountStringOccurrences(post.Description, postParams.Search);
                    
                    postsRelevance[post.Id]+=Global.CountStringOccurrences(string.Join(",", post.Tags.Select(t=>t.Tag.Value)), postParams.Search);
                    
                }

                posts = posts.Where(p=>postsRelevance[p.Id]>0);
            }

            if(postParams.Liked == true){
                posts = posts.Where(p=>p.Likers.Any(liker=>liker.LikerId == postParams.UserId));
            }
            else if(postParams.Disliked == true){
                posts = posts.Where(p=>p.Dislikers.Any(disliker=>disliker.DislikerId == postParams.UserId));
            }

            if(postParams.UserPosts == true){
                posts = posts.Where(p=>p.Author.Id == postParams.UserId);
            }
            // if (userParams.Likers)
            // {
            //     var userLikers = await GetUserLikes(userParams.UserId, true);
            //     users = users.Where(u => userLikers.Contains(u.Id));
            // }

            // if (userParams.Likees)
            // {
            //     var userLikees = await GetUserLikes(userParams.UserId, false);
            //     users = users.Where(u => userLikees.Contains(u.Id));
            // }

            if(!string.IsNullOrEmpty(postParams.OrderBy)){
                switch (postParams.OrderBy) {
                    case "relevance":
                        if(postParams.Search != null && postParams.Search != "")
                            posts = posts.OrderByDescending(u => postsRelevance[u.Id]);
                        break;
                    case "created":
                        posts = posts.OrderByDescending(u => u.Created);
                        break;
                    case "updated":
                        posts = posts.OrderByDescending(u => u.Updated);
                        break;
                    case "likes":
                        posts = posts.OrderByDescending(u => u.Likers.Count);
                        break;
                    case "likedTime":
                        posts = posts.OrderByDescending(u => u.Likers.FirstOrDefault(l=>l.LikerId==postParams.UserId).Created);
                        break;
                    case "dislikes":
                        posts = posts.OrderByDescending(u => u.Dislikers.Count);
                        break;
                    default:
                        posts = posts.OrderByDescending(u=>u.Updated);
                        break;
                }
            }

            return await PagedList<Post>.CreateAsync(posts, postParams.PageNumber, postParams.PageSize);
        }
        private async Task<IEnumerable<int>> GetUserLikes(int id, bool likers)
        {
            var user = await _context.Users
            .Include(x => x.LikedPosts)
            // .Include(x => x.Likees)
            .FirstOrDefaultAsync(u => u.Id == id);

            return user.LikedPosts.Select(i => i.PostId);
            // if(likers){
            //     // return user.Likers.Where(u => u.LikeeId == id).Select(i => i.LikerId);
                
            // }
            // else{
            //     return user.Likees.Select(i => i.LikeeId);
            // }
        }
        public async Task<bool> SaveAll()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<Message> GetMessage(int id)
        {
            return await _context.Messages.FirstOrDefaultAsync(m => m.Id == id);
        }

        public Task<PagedList<Message>> GetMessagesForUser(MessageParams messageParams)
        {
            var messages = _context.Messages
                .Include(u => u.Sender).ThenInclude(p => p.Photos)
                .Include(u => u.Recipient).ThenInclude(p => p.Photos)
                .AsQueryable();
            
            switch (messageParams.MessageContainer){
                case "Inbox":
                    messages = messages.Where(u => u.RecipientId == messageParams.UserId 
                        && u.RecipientDeleted==false);
                    break;
                case "Outbox":
                    messages = messages.Where(u => u.SenderId == messageParams.UserId 
                        && u.SenderDeleted==false);
                    break;
                default:
                    messages = messages.Where(u => u.RecipientId == messageParams.UserId && u.IsRead == false 
                        && u.RecipientDeleted==false);
                    break;
            }

            messages = messages.OrderByDescending(d => d.MessageSent);
            return PagedList<Message>.CreateAsync(messages,
                messageParams.PageNumber, messageParams.PageSize);
        }

        public async Task<IEnumerable<Message>> GetMessageThread(int userId, int recipientId)
        {
            var messages = await _context.Messages
                .Include(u => u.Sender).ThenInclude(p => p.Photos)
                .Include(u => u.Recipient).ThenInclude(p => p.Photos)
                .Where(m => m.RecipientId == userId && m.RecipientDeleted==false && m.SenderId == recipientId 
                || m.RecipientId == recipientId && m.SenderDeleted==false && m.SenderId == userId)
                .OrderBy(m => m.MessageSent)
                .ToListAsync();
            
            return messages;
        }

        public async Task<Tag> GetTag(string value)
        {
            var tag = await _context.Tags.Include(t => t.Posts).FirstOrDefaultAsync(t => t.Value == value);

            return tag;
        }

        public async Task<IEnumerable<Tag>> GetTags(TagParams tagParams)
        {
            var tags =  _context.Tags.Include(t => t.Posts).AsQueryable();
            
            if(!string.IsNullOrEmpty(tagParams.OrderBy)){
                switch (tagParams.OrderBy) {
                    case "count":
                        tags = tags.OrderByDescending(t => t.Posts.Count);
                        break;
                    
                    default:
                        tags = tags.OrderByDescending(t => t.Posts.Count);
                        break;
                }
            }

            if(tagParams.MinCount>0){
                tags = tags.Where(t=>t.Posts.Count >= tagParams.MinCount);
            }

            if(tagParams.MaxReturnNumber>0){
                tags = tags.Take(tagParams.MaxReturnNumber);
            }

            var tagsList = await tags.ToListAsync();
            
            return tagsList;
        }
    }
}