using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace App.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class updatedObjects : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Type",
                table: "StrategicObjects",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.Sql(@"
                DECLARE @now datetime2(7) = SYSUTCDATETIME();

                CREATE TABLE #GeoTemp (
                    Num   int IDENTITY(1,1) NOT NULL PRIMARY KEY,
                    GeoId uniqueidentifier  NOT NULL
                );

                INSERT INTO #GeoTemp (GeoId)
                SELECT TOP (200) NEWID()
                FROM sys.all_objects;

                INSERT INTO dbo.GeoLocations (
                    Id,
                    Latitude,
                    Longitude,
                    CreateDate,
                    LMDate,
                    CreateEmail,
                    LMEmail,
                    IsActive
                )
                SELECT
                    t.GeoId AS Id,
                    CAST(49.0 + (ABS(CHECKSUM(NEWID())) % 58000) / 10000.0 AS float) AS Latitude,
                    CAST(14.1 + (ABS(CHECKSUM(NEWID())) % 100000) / 10000.0 AS float) AS Longitude,
                    @now AS CreateDate,
                    @now AS LMDate,
                    'seed@app.local' AS CreateEmail,
                    'seed@app.local' AS LMEmail,
                    1 AS IsActive
                FROM #GeoTemp t
                ORDER BY t.Num;

                INSERT INTO dbo.StrategicObjects (
                    Id,
                    Name,
                    Type,
                    CoordinatesId,
                    CreateDate,
                    LMDate,
                    CreateEmail,
                    LMEmail,
                    IsActive
                )
                SELECT
                    NEWID() AS Id,
                    CASE
                        WHEN t.Num BETWEEN 1   AND 34  THEN CONCAT('School #',        t.Num)
                        WHEN t.Num BETWEEN 35  AND 67  THEN CONCAT('Train Station #', t.Num - 34)
                        WHEN t.Num BETWEEN 68  AND 100 THEN CONCAT('Tunnel #',        t.Num - 67)
                        WHEN t.Num BETWEEN 101 AND 133 THEN CONCAT('Airport #',      t.Num - 100)
                        WHEN t.Num BETWEEN 134 AND 166 THEN CONCAT('Bunker #',       t.Num - 133)
                        WHEN t.Num BETWEEN 167 AND 200 THEN CONCAT('University #',   t.Num - 166)
                    END AS Name,
                    CASE
                        WHEN t.Num BETWEEN 1   AND 34  THEN 1
                        WHEN t.Num BETWEEN 35  AND 67  THEN 2
                        WHEN t.Num BETWEEN 68  AND 100 THEN 3
                        WHEN t.Num BETWEEN 101 AND 133 THEN 4
                        WHEN t.Num BETWEEN 134 AND 166 THEN 5
                        WHEN t.Num BETWEEN 167 AND 200 THEN 6
                        ELSE 0
                    END AS Type,
                    t.GeoId AS CoordinatesId,
                    @now AS CreateDate,
                    @now AS LMDate,
                    'seed@app.local' AS CreateEmail,
                    'seed@app.local' AS LMEmail,
                    1 AS IsActive
                FROM #GeoTemp t
                ORDER BY t.Num;

                DROP TABLE #GeoTemp;
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Type",
                table: "StrategicObjects");
        }
    }
}