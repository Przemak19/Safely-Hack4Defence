using Microsoft.AspNetCore.Http;

namespace App.Application.Dto
{
    public record UploadPhotoRequest(IFormFile File, string? Title, Guid IncidentId);
}
