namespace App.Domain.Models
{
    public class Photo : BaseEntity<Guid>
    {
        public string FileName { get; set; } = default!;
        public string OriginalFileName { get; set; } = default!;
        public string ContentType { get; set; } = default!;
        public DateTime UploadedAt { get; set; } = default!;
        public string? Title { get; set; } = default!;
        public Guid IncidentReportId { get; set; } = default!;
        public virtual IncidentReport IncidentReport { get; set; } = default!;
    }
}
