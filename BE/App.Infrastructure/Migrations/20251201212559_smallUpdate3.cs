using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace App.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class smallUpdate3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Photos_AspNetUsers_OwnerId",
                table: "Photos");

            migrationBuilder.RenameColumn(
                name: "OwnerId",
                table: "Photos",
                newName: "IncidentReportId");

            migrationBuilder.RenameIndex(
                name: "IX_Photos_OwnerId",
                table: "Photos",
                newName: "IX_Photos_IncidentReportId");

            migrationBuilder.AddForeignKey(
                name: "FK_Photos_IncidentReports_IncidentReportId",
                table: "Photos",
                column: "IncidentReportId",
                principalTable: "IncidentReports",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Photos_IncidentReports_IncidentReportId",
                table: "Photos");

            migrationBuilder.RenameColumn(
                name: "IncidentReportId",
                table: "Photos",
                newName: "OwnerId");

            migrationBuilder.RenameIndex(
                name: "IX_Photos_IncidentReportId",
                table: "Photos",
                newName: "IX_Photos_OwnerId");

            migrationBuilder.AddForeignKey(
                name: "FK_Photos_AspNetUsers_OwnerId",
                table: "Photos",
                column: "OwnerId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }
    }
}
