using Microsoft.AspNetCore.Http;
using App.Domain.Models;

namespace App.Infrastructure.Services
{
    public interface IPhotoService
    {
        Task<Photo> UploadAsync(IFormFile file, string? title, Guid IncidentId);
        Task<Photo?> GetPhoto(Guid photoId);
    }
}
