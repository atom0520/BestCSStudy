﻿// <auto-generated />
using System;
using BestCSStudy.API.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace BestCSStudy.API.Migrations
{
    [DbContext(typeof(DataContext))]
    [Migration("20190615214924_AddedCreatedTimeForLikeDislike")]
    partial class AddedCreatedTimeForLikeDislike
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "2.2.4-servicing-10062")
                .HasAnnotation("Relational:MaxIdentifierLength", 64);

            modelBuilder.Entity("BestCSStudy.API.Models.Dislike", b =>
                {
                    b.Property<int>("DislikerId");

                    b.Property<int>("PostId");

                    b.Property<DateTime>("Created");

                    b.HasKey("DislikerId", "PostId");

                    b.HasIndex("PostId");

                    b.ToTable("Dislikes");
                });

            modelBuilder.Entity("BestCSStudy.API.Models.Like", b =>
                {
                    b.Property<int>("LikerId");

                    b.Property<int>("PostId");

                    b.Property<DateTime>("Created");

                    b.HasKey("LikerId", "PostId");

                    b.HasIndex("PostId");

                    b.ToTable("Likes");
                });

            modelBuilder.Entity("BestCSStudy.API.Models.Message", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Content");

                    b.Property<DateTime?>("DateRead");

                    b.Property<bool>("IsRead");

                    b.Property<DateTime>("MessageSent");

                    b.Property<bool>("RecipientDeleted");

                    b.Property<int>("RecipientId");

                    b.Property<bool>("SenderDeleted");

                    b.Property<int>("SenderId");

                    b.HasKey("Id");

                    b.HasIndex("RecipientId");

                    b.HasIndex("SenderId");

                    b.ToTable("Messages");
                });

            modelBuilder.Entity("BestCSStudy.API.Models.Photo", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime>("DateAdded");

                    b.Property<string>("Description");

                    b.Property<bool>("IsMain");

                    b.Property<string>("PublicId");

                    b.Property<string>("Url");

                    b.Property<int>("UserId");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("Photos");
                });

            modelBuilder.Entity("BestCSStudy.API.Models.Post", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int>("AuthorId");

                    b.Property<string>("Category");

                    b.Property<DateTime>("Created");

                    b.Property<string>("Description");

                    b.Property<string>("Links");

                    b.Property<string>("Tags");

                    b.Property<string>("Title");

                    b.Property<DateTime>("Updated");

                    b.HasKey("Id");

                    b.HasIndex("AuthorId");

                    b.ToTable("Posts");
                });

            modelBuilder.Entity("BestCSStudy.API.Models.PostImage", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime>("DateAdded");

                    b.Property<bool>("IsMain");

                    b.Property<int>("PostId");

                    b.Property<string>("PublicId");

                    b.Property<string>("Url");

                    b.HasKey("Id");

                    b.HasIndex("PostId");

                    b.ToTable("PostImages");
                });

            modelBuilder.Entity("BestCSStudy.API.Models.User", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("City");

                    b.Property<string>("Country");

                    b.Property<DateTime>("Created");

                    b.Property<DateTime>("DateOfBirth");

                    b.Property<string>("Gender");

                    b.Property<string>("Introduction");

                    b.Property<DateTime>("LastActive");

                    b.Property<byte[]>("PasswordHash");

                    b.Property<byte[]>("PasswordSalt");

                    b.Property<string>("Username");

                    b.HasKey("Id");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("BestCSStudy.API.Models.Value", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Name");

                    b.HasKey("Id");

                    b.ToTable("Values");
                });

            modelBuilder.Entity("BestCSStudy.API.Models.Dislike", b =>
                {
                    b.HasOne("BestCSStudy.API.Models.User", "Disliker")
                        .WithMany("DislikedPosts")
                        .HasForeignKey("DislikerId")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.HasOne("BestCSStudy.API.Models.Post", "Post")
                        .WithMany("Dislikers")
                        .HasForeignKey("PostId")
                        .OnDelete(DeleteBehavior.Restrict);
                });

            modelBuilder.Entity("BestCSStudy.API.Models.Like", b =>
                {
                    b.HasOne("BestCSStudy.API.Models.User", "Liker")
                        .WithMany("LikedPosts")
                        .HasForeignKey("LikerId")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.HasOne("BestCSStudy.API.Models.Post", "Post")
                        .WithMany("Likers")
                        .HasForeignKey("PostId")
                        .OnDelete(DeleteBehavior.Restrict);
                });

            modelBuilder.Entity("BestCSStudy.API.Models.Message", b =>
                {
                    b.HasOne("BestCSStudy.API.Models.User", "Recipient")
                        .WithMany("MessagesReceived")
                        .HasForeignKey("RecipientId")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.HasOne("BestCSStudy.API.Models.User", "Sender")
                        .WithMany("MessagesSent")
                        .HasForeignKey("SenderId")
                        .OnDelete(DeleteBehavior.Restrict);
                });

            modelBuilder.Entity("BestCSStudy.API.Models.Photo", b =>
                {
                    b.HasOne("BestCSStudy.API.Models.User", "User")
                        .WithMany("Photos")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("BestCSStudy.API.Models.Post", b =>
                {
                    b.HasOne("BestCSStudy.API.Models.User", "Author")
                        .WithMany("Posts")
                        .HasForeignKey("AuthorId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("BestCSStudy.API.Models.PostImage", b =>
                {
                    b.HasOne("BestCSStudy.API.Models.Post", "Post")
                        .WithMany("PostImages")
                        .HasForeignKey("PostId")
                        .OnDelete(DeleteBehavior.Cascade);
                });
#pragma warning restore 612, 618
        }
    }
}
