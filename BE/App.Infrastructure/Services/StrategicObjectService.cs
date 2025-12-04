using App.Application.Dto.StrategicObjects;
using Microsoft.EntityFrameworkCore;

namespace App.Infrastructure.Services
{
    public class StrategicObjectService : IStrategicObjectService
    {
        private readonly AppDbContext appDbContext;

        public StrategicObjectService(AppDbContext appDbContext)
        {
            this.appDbContext = appDbContext;
        }

        public async Task<IEnumerable<StrategicObjectDto>> GetStrategicObjects() =>
            (await this.appDbContext.StrategicObjects.Include(x => x.Coordinates).ToListAsync()).Select(x => StrategicObjectDto.ToDto(x));
    }
}
