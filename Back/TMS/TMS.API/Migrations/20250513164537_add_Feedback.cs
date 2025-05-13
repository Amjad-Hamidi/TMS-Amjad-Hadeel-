using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TMS.API.Migrations
{
    /// <inheritdoc />
    public partial class add_Feedback : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Feedbacks",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FromUserAccountId = table.Column<int>(type: "int", nullable: false),
                    ToUserAccountId = table.Column<int>(type: "int", nullable: false),
                    TrainingProgramId = table.Column<int>(type: "int", nullable: false),
                    Message = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Rating = table.Column<int>(type: "int", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    Type = table.Column<int>(type: "int", nullable: false),
                    AttachmentUrl = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Feedbacks", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Feedbacks_TrainingPrograms_TrainingProgramId",
                        column: x => x.TrainingProgramId,
                        principalTable: "TrainingPrograms",
                        principalColumn: "TrainingProgramId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Feedbacks_UserAccounts_FromUserAccountId",
                        column: x => x.FromUserAccountId,
                        principalTable: "UserAccounts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Feedbacks_UserAccounts_ToUserAccountId",
                        column: x => x.ToUserAccountId,
                        principalTable: "UserAccounts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Feedbacks_FromUserAccountId",
                table: "Feedbacks",
                column: "FromUserAccountId");

            migrationBuilder.CreateIndex(
                name: "IX_Feedbacks_ToUserAccountId",
                table: "Feedbacks",
                column: "ToUserAccountId");

            migrationBuilder.CreateIndex(
                name: "IX_Feedbacks_TrainingProgramId",
                table: "Feedbacks",
                column: "TrainingProgramId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Feedbacks");
        }
    }
}
