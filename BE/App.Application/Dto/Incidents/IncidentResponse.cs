using App.Domain.Enums;
using App.Domain.Models;

namespace App.Application.Dto.Incidents
{
    public class IncidentResponse
    {
        public Guid Id { get; set; } = default!;
        public string FirstName { get; set; } = default!;
        public string LastName { get; set; } = default!;
        public string PhoneNumber { get; set; } = default!;
        public string StreetName { get; set; } = default!;
        public string City { get; set; } = default!;
        public string State { get; set; } = default!;
        public string EventDescription { get; set; } = default!;
        public EventCategory EventCategory { get; set; } = default!;
        public IncidentStatus IncidentStatus { get; set; } = default!;
        public GeoLocationDto Coordinates { get; set; } = default!;
        public IEnumerable<PhotoDto> Photos {get; set;} = default!;
        public DateTime CreateDate { get; set; } = default!;

        public static IncidentResponse ToDto(IncidentReport incident) => 
            new IncidentResponse
            {
                Id = incident.Id,
                City = incident.City,
                State = incident.State,
                Coordinates = new GeoLocationDto
                {
                    Latitude = incident.Coordinates.Latitude,
                    Longitude = incident.Coordinates.Longitude,
                },
                EventCategory = incident.EventCategory,
                EventDescription = incident.EventDescription,
                FirstName = incident.FirstName,
                LastName = incident.LastName,
                PhoneNumber = incident.PhoneNumber,
                StreetName = incident.StreetName,
                Photos = incident.Photos.Select(x => new PhotoDto(x.Id)),
                CreateDate = incident.CreateDate,
                IncidentStatus = incident.IncidentStatus
            };
    }
}
