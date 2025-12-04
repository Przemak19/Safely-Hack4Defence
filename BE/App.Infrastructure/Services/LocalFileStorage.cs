using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Options;
using App.Application.Options;

namespace App.Infrastructure.Services
{
    public class LocalFileStorage : IFileStorage
    {
        private readonly string _rootPath;

        public LocalFileStorage(
            IWebHostEnvironment env,
            IOptions<PhotoStorageOptions> options)
        {
            var configuredRoot = options.Value.RootPath;

            if (Path.IsPathRooted(configuredRoot))
            {
                _rootPath = configuredRoot;
            }
            else
            {
                _rootPath = Path.Combine(env.ContentRootPath, configuredRoot);
            }

            Directory.CreateDirectory(_rootPath);
        }

        public async Task<string> SaveAsync(Stream fileStream, string extension, CancellationToken ct = default)
        {
            var fileName = $"{Guid.NewGuid():N}{extension}";
            var fullPath = Path.Combine(_rootPath, fileName);

            await using var fs = new FileStream(fullPath, FileMode.CreateNew, FileAccess.Write);
            await fileStream.CopyToAsync(fs, ct);

            return fileName;
        }

        public Task<Stream> OpenReadAsync(string storedFileName, CancellationToken ct = default)
        {
            var fullPath = Path.Combine(_rootPath, storedFileName);
            if (!File.Exists(fullPath))
                throw new FileNotFoundException();

            Stream stream = new FileStream(fullPath, FileMode.Open, FileAccess.Read, FileShare.Read);
            return Task.FromResult(stream);
        }

        public Task DeleteAsync(string storedFileName, CancellationToken ct = default)
        {
            var fullPath = Path.Combine(_rootPath, storedFileName);
            if (File.Exists(fullPath))
                File.Delete(fullPath);

            return Task.CompletedTask;
        }
    }
}
