using App.Domain.Enums;
using App.Domain.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace App.Infrastructure.Services
{
    public class PhotoService : IPhotoService
    {
        private readonly AppDbContext _db;
        private readonly IFileStorage _fileStorage;
        private readonly IHttpContextAccessor httpContextAccessor;

        private Dictionary<string, EventCategory[]> eventMatrice = new Dictionary<string, EventCategory[]>
        {
            { "Admin", [EventCategory.Fire, EventCategory.Flood, EventCategory.HarmfulIncident, EventCategory.AirThreat, EventCategory.CyberThreat] },
            { "FireFighter", [EventCategory.Fire, EventCategory.Flood] },
            { "Police", [EventCategory.HarmfulIncident] },
            { "Soldier", [EventCategory.AirThreat] },
            { "CBZC", [EventCategory.CyberThreat] },
        };

        public PhotoService(AppDbContext db, IFileStorage fileStorage, IHttpContextAccessor httpContextAccessor)
        {
            _db = db;
            _fileStorage = fileStorage;
            this.httpContextAccessor = httpContextAccessor;
        }

        public async Task<Photo> UploadAsync(IFormFile file, string? title, Guid incidentId)
        {
            if (file == null || file.Length == 0)
                throw new ArgumentException("Empty file");

            var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (ext != ".jpg" && ext != ".jpeg" && ext != ".png")
                throw new ArgumentException("Invalid image type");

            await using var stream = file.OpenReadStream();
            var storedFileName = await _fileStorage.SaveAsync(stream, ext);

            var photo = new Photo
            {
                Id = Guid.NewGuid(),
                IncidentReportId = incidentId,
                FileName = storedFileName,
                OriginalFileName = file.FileName,
                ContentType = file.ContentType,
                UploadedAt = DateTime.UtcNow,
                Title = title
            };

            _db.Photos.Add(photo);
            await _db.SaveChangesAsync();

            return photo;
        }

        public async Task<Photo?> GetPhoto(Guid photoId)
        {
            var role = httpContextAccessor?.HttpContext?.User.Claims.First(x => x.Type == ClaimTypes.Role).Value;
            var allowedTypes = eventMatrice[role];

            var photo = await _db.Photos
                .Include(x => x.IncidentReport)
                .Where(x => allowedTypes.Contains(x.IncidentReport.EventCategory))
                .FirstOrDefaultAsync(p => p.Id == photoId);

            if (photo == null)
                return null;

            return photo;
        }
    }
}
