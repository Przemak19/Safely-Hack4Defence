namespace App.Infrastructure.Services
{
    public interface IFileStorage
    {
        Task<string> SaveAsync(Stream fileStream, string extension, CancellationToken ct = default);
        Task<Stream> OpenReadAsync(string storedFileName, CancellationToken ct = default);
        Task DeleteAsync(string storedFileName, CancellationToken ct = default);
    }
}
