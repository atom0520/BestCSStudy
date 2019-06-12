using Microsoft.EntityFrameworkCore.Migrations;

namespace BestCSStudy.API.Migrations
{
    public partial class AddedDislikeTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Dislike_Users_DislikerId",
                table: "Dislike");

            migrationBuilder.DropForeignKey(
                name: "FK_Dislike_Posts_PostId",
                table: "Dislike");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Dislike",
                table: "Dislike");

            migrationBuilder.RenameTable(
                name: "Dislike",
                newName: "Dislikes");

            migrationBuilder.RenameIndex(
                name: "IX_Dislike_PostId",
                table: "Dislikes",
                newName: "IX_Dislikes_PostId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Dislikes",
                table: "Dislikes",
                columns: new[] { "DislikerId", "PostId" });

            migrationBuilder.AddForeignKey(
                name: "FK_Dislikes_Users_DislikerId",
                table: "Dislikes",
                column: "DislikerId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Dislikes_Posts_PostId",
                table: "Dislikes",
                column: "PostId",
                principalTable: "Posts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Dislikes_Users_DislikerId",
                table: "Dislikes");

            migrationBuilder.DropForeignKey(
                name: "FK_Dislikes_Posts_PostId",
                table: "Dislikes");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Dislikes",
                table: "Dislikes");

            migrationBuilder.RenameTable(
                name: "Dislikes",
                newName: "Dislike");

            migrationBuilder.RenameIndex(
                name: "IX_Dislikes_PostId",
                table: "Dislike",
                newName: "IX_Dislike_PostId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Dislike",
                table: "Dislike",
                columns: new[] { "DislikerId", "PostId" });

            migrationBuilder.AddForeignKey(
                name: "FK_Dislike_Users_DislikerId",
                table: "Dislike",
                column: "DislikerId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Dislike_Posts_PostId",
                table: "Dislike",
                column: "PostId",
                principalTable: "Posts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
