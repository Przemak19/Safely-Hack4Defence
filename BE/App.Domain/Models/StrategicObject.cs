using App.Domain.Enums;

namespace App.Domain.Models
{
    public class StrategicObject : BaseEntity<Guid>
    {
        public string Name { get; set; } = default!;
        public StrategicObjectCategory Type{ get; set; }
        public Guid CoordinatesId { get; set; } = default!;
        public GeoLocation Coordinates { get; set; } = default!;
    }
}
