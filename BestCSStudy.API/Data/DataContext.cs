using System;
using BestCSStudy.API.Models;
using Microsoft.EntityFrameworkCore;

namespace BestCSStudy.API.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options) {}
        
        public DbSet<Value> Values { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Photo> Photos { get; set; }
        public DbSet<Like> Likes { get; set; }
        public DbSet<Dislike> Dislikes { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<Post> Posts { get; set; }
        public DbSet<Tag> Tags { get; set; }
        public DbSet<PostTag> PostTags { get; set; }
        public DbSet<PostImage> PostImages { get; set; }
        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<Like>()
                .HasKey(k => new {k.LikerId, k.PostId});

            builder.Entity<Like>()
                .HasOne(u => u.Post)
                .WithMany(u => u.Likers)
                .HasForeignKey(u => u.PostId)
                .OnDelete(DeleteBehavior.Restrict);
            
            builder.Entity<Like>()
                .HasOne(u => u.Liker)
                .WithMany(u => u.LikedPosts)
                .HasForeignKey(u => u.LikerId)
                .OnDelete(DeleteBehavior.Restrict);
            
            builder.Entity<Dislike>()
                .HasKey(k => new {k.DislikerId, k.PostId});

            builder.Entity<Dislike>()
                .HasOne(u => u.Post)
                .WithMany(u => u.Dislikers)
                .HasForeignKey(u => u.PostId)
                .OnDelete(DeleteBehavior.Restrict);
            
            builder.Entity<Dislike>()
                .HasOne(u => u.Disliker)
                .WithMany(u => u.DislikedPosts)
                .HasForeignKey(u => u.DislikerId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<PostTag>()
                .HasKey(k => new {k.PostId, k.TagId});

            builder.Entity<PostTag>()
                .HasOne(u => u.Post)
                .WithMany(u => u.Tags)
                .HasForeignKey(u => u.PostId)
                .OnDelete(DeleteBehavior.Restrict);
            
            builder.Entity<PostTag>()
                .HasOne(u => u.Tag)
                .WithMany(u => u.Posts)
                .HasForeignKey(u => u.TagId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Message>()
                .HasOne(u => u.Sender)
                .WithMany(m => m.MessagesSent)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Message>()
                .HasOne(u => u.Recipient)
                .WithMany(m => m.MessagesReceived)
                .OnDelete(DeleteBehavior.Restrict);

        }
    }
}