using App.Application.Dto.StrategicObjects;

namespace App.Infrastructure.Services
{
    public interface IStrategicObjectService
    {
        Task<IEnumerable<StrategicObjectDto>> GetStrategicObjects();
    }
}