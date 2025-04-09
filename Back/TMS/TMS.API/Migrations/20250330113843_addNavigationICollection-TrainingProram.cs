using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TMS.API.Migrations
{
    /// <inheritdoc />
    public partial class addNavigationICollectionTrainingProram : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>( // Category.cs في TrainingPrograms الي بتاشر على Navigation تلقائيا فقط من خلال ال TrainingPrograms في CategoryId اضاف عمود
                name: "CategoryId",          // Navigation تلقائيا كل هاد من ال F.K ك CategoryId وجعل ال 
                table: "TrainingPrograms",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_TrainingPrograms_CategoryId",
                table: "TrainingPrograms",
                column: "CategoryId");

            migrationBuilder.AddForeignKey(
                name: "FK_TrainingPrograms_Categories_CategoryId",
                table: "TrainingPrograms",
                column: "CategoryId",
                principalTable: "Categories",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TrainingPrograms_Categories_CategoryId",
                table: "TrainingPrograms");

            migrationBuilder.DropIndex(
                name: "IX_TrainingPrograms_CategoryId",
                table: "TrainingPrograms");

            migrationBuilder.DropColumn(
                name: "CategoryId",
                table: "TrainingPrograms");
        }
    }
}
