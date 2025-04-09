using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TMS.API.Migrations
{
    /// <inheritdoc />
    public partial class Alter_TrainingProgram_Supervisor_Relationship : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TrainingPrograms_Users_SupervisorId",
                table: "TrainingPrograms");

            migrationBuilder.AddForeignKey(
                name: "FK_TrainingPrograms_Users_SupervisorId",
                table: "TrainingPrograms",
                column: "SupervisorId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TrainingPrograms_Users_SupervisorId",
                table: "TrainingPrograms");

            migrationBuilder.AddForeignKey(
                name: "FK_TrainingPrograms_Users_SupervisorId",
                table: "TrainingPrograms",
                column: "SupervisorId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
