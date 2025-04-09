using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TMS.API.Migrations
{
    /// <inheritdoc />
    public partial class Add_TrainingProgram_Relations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CompanyId",
                table: "TrainingPrograms",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "SupervisorId",
                table: "TrainingPrograms",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "ProgramTrainees",
                columns: table => new
                {
                    TraineeId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    TrainingProgramId = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<bool>(type: "bit", nullable: false),
                    EnrolledAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProgramTrainees", x => new { x.TraineeId, x.TrainingProgramId });
                    table.ForeignKey(
                        name: "FK_ProgramTrainees_TrainingPrograms_TrainingProgramId",
                        column: x => x.TrainingProgramId,
                        principalTable: "TrainingPrograms",
                        principalColumn: "TrainingProgramId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProgramTrainees_Users_TraineeId",
                        column: x => x.TraineeId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TrainingPrograms_CompanyId",
                table: "TrainingPrograms",
                column: "CompanyId");

            migrationBuilder.CreateIndex(
                name: "IX_TrainingPrograms_SupervisorId",
                table: "TrainingPrograms",
                column: "SupervisorId");

            migrationBuilder.CreateIndex(
                name: "IX_ProgramTrainees_TrainingProgramId",
                table: "ProgramTrainees",
                column: "TrainingProgramId");

            migrationBuilder.AddForeignKey(
                name: "FK_TrainingPrograms_Users_CompanyId",
                table: "TrainingPrograms",
                column: "CompanyId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_TrainingPrograms_Users_SupervisorId",
                table: "TrainingPrograms",
                column: "SupervisorId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TrainingPrograms_Users_CompanyId",
                table: "TrainingPrograms");

            migrationBuilder.DropForeignKey(
                name: "FK_TrainingPrograms_Users_SupervisorId",
                table: "TrainingPrograms");

            migrationBuilder.DropTable(
                name: "ProgramTrainees");

            migrationBuilder.DropIndex(
                name: "IX_TrainingPrograms_CompanyId",
                table: "TrainingPrograms");

            migrationBuilder.DropIndex(
                name: "IX_TrainingPrograms_SupervisorId",
                table: "TrainingPrograms");

            migrationBuilder.DropColumn(
                name: "CompanyId",
                table: "TrainingPrograms");

            migrationBuilder.DropColumn(
                name: "SupervisorId",
                table: "TrainingPrograms");
        }
    }
}
