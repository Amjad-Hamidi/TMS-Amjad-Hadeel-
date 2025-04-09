using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TMS.API.Migrations
{
    /// <inheritdoc />
    public partial class changeNameOfTrainingProgramIdinTrainingProgramcs : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ProgramId",
                table: "TrainingPrograms",
                newName: "TrainingProgramId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "TrainingProgramId",
                table: "TrainingPrograms",
                newName: "ProgramId");
        }
    }
}
