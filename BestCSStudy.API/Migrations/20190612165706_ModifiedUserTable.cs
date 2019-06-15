using Microsoft.EntityFrameworkCore.Migrations;

namespace BestCSStudy.API.Migrations
{
    public partial class ModifiedUserTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Likes",
                table: "Users");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Likes",
                table: "Users",
                nullable: false,
                defaultValue: 0);
        }
    }
}
