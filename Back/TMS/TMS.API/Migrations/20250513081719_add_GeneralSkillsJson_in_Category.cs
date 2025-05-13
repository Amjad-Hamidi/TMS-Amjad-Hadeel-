using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TMS.API.Migrations
{
    /// <inheritdoc />
    public partial class add_GeneralSkillsJson_in_Category : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "GeneralSkillsJson",
                table: "Categories",
                type: "nvarchar(max)",
                nullable: false, // ما رح ياثر على الصفوف القديمة الي كانت موجودة قبل defaultValue لانو موجود تحتها
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "GeneralSkillsJson",
                table: "Categories");
        }
    }
}
