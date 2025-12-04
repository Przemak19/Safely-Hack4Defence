using App.Application.Dto.Incidents;
using App.Domain.Enums;
using App.Domain.Models;

namespace App.Application.Dto.StrategicObjects
{
    public class StrategicObjectDto
    {
        public Guid Id { get; set; } = default!;
        public string Name { get; set; } = default!;
        public StrategicObjectCategory Type { get; set; }
        public GeoLocationDto Coordinates { get; set; } = default!;

        public static StrategicObjectDto ToDto(StrategicObject strategicObject)
        {
            return new StrategicObjectDto
            {
                Id = strategicObject.Id,
                Name = strategicObject.Name,
                Type = strategicObject.Type,
                Coordinates = new GeoLocationDto
                {
                    Latitude = strategicObject.Coordinates.Latitude,
                    Longitude = strategicObject.Coordinates.Longitude
                }
            };
        }
    }
}
