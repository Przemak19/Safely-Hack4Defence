using App.Application.Dto;
using App.Infrastructure.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace App.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PhotosController : ControllerBase
    {
        private readonly IPhotoService _photoService;
        private readonly IFileStorage fileStorage;

        public PhotosController(
            IPhotoService photoService,
            IFileStorage fileStorage)
        {
            _photoService = photoService;
            this.fileStorage = fileStorage;
        }

        [HttpPost("upload")]
        [RequestSizeLimit(10_000_000)]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> Upload([FromForm] UploadPhotoRequest uploadPhotoRequest)
        {
            if (uploadPhotoRequest.File == null)
                return BadRequest("File is required");

            var photo = await _photoService.UploadAsync(uploadPhotoRequest.File, uploadPhotoRequest.Title, uploadPhotoRequest.IncidentId);
            return Ok(new { photo.Id });
        }

        [Authorize]
        [HttpGet("{id:guid}/download")]
        public async Task<IActionResult> Download(Guid id)
        {
            var photo = await _photoService.GetPhoto(id);
            if (photo == null)
                return NotFound();

            var stream = await fileStorage.OpenReadAsync(photo.FileName);
            return File(stream, photo.ContentType, photo.OriginalFileName);
        }
    }
}
