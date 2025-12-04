namespace App.Domain.Models
{
    public class GeoLocation : BaseEntity<Guid>
    {
        public double Latitude { get; set; }
        public double Longitude { get; set; }

        public virtual StrategicObject StrategicObject { get; set; } = default!;
    }
}
