using System;
using App.Domain.Enums;

namespace App.Domain.Models
{
    public class IncidentReport : BaseEntity<Guid>
    {
        public string FirstName { get; set; } = default!;
        public string LastName { get; set; } = default!;
        public string PhoneNumber { get; set; } = default!;
        public string StreetName { get; set; } = default!;
        public string City { get; set; } = default!;
        public string State { get; set; } = default!;
        public string EventDescription { get; set; } = default!;
        public EventCategory EventCategory { get; set; } = default!;
        public IncidentStatus IncidentStatus { get; set; } = IncidentStatus.New;
        public virtual GeoLocation Coordinates { get; set;  } = default!;
        public virtual IEnumerable<Photo> Photos { get; set; } = default!;
    }
}
