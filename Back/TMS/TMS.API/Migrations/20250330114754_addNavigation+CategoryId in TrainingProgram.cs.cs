using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TMS.API.Migrations
{
    /// <inheritdoc />
    public partial class addNavigationCategoryIdinTrainingProgramcs : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TrainingPrograms_Categories_CategoryId",
                table: "TrainingPrograms");

            migrationBuilder.AlterColumn<int>(
                name: "CategoryId",
                table: "TrainingPrograms",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_TrainingPrograms_Categories_CategoryId",
                table: "TrainingPrograms",
                column: "CategoryId",
                principalTable: "Categories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TrainingPrograms_Categories_CategoryId",
                table: "TrainingPrograms");

            migrationBuilder.AlterColumn<int>(
                name: "CategoryId",
                table: "TrainingPrograms",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_TrainingPrograms_Categories_CategoryId",
                table: "TrainingPrograms",
                column: "CategoryId",
                principalTable: "Categories",
                principalColumn: "Id");
        }
    }
}
