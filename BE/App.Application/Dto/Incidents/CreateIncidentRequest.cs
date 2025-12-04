using App.Domain.Enums;
using App.Domain.Models;

namespace App.Application.Dto.Incidents
{
    public class CreateIncidentRequest
    {
        public string FirstName { get; set; } = default!;
        public string LastName { get; set; } = default!;
        public string PhoneNumber { get; set; } = default!;
        public string StreetName { get; set; } = default!;
        public string City { get; set; } = default!;
        public string State { get; set; } = default!;
        public string EventDescription { get; set; } = default!;
        public EventCategory EventCategory { get; set; } = default!;
        public GeoLocationDto Coordinates { get; set; } = default!;

        public IncidentReport ToDomainModel() =>
            new IncidentReport
            {
                EventCategory = EventCategory,
                FirstName = FirstName,
                LastName = LastName,
                PhoneNumber = PhoneNumber,
                StreetName = StreetName,
                City = City,
                State = State,
                EventDescription = EventDescription,
                Coordinates = new GeoLocation
                {
                    Latitude = Coordinates.Latitude,
                    Longitude = Coordinates.Longitude,
                },
                CreateDate = DateTime.UtcNow,
                CreateEmail = null,
                IsActive = true,
                LMDate = DateTime.UtcNow
            }; 
        
    }
}
