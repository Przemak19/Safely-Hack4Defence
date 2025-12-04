using App.Application.Dto.Incidents;

namespace App.Infrastructure.Services
{
    public interface IIncidentService
    {
        Task<Guid> Add(CreateIncidentRequest request);
        Task<IEnumerable<IncidentResponse>> GetAllForRole();
        Task<IncidentResponse> GetForRoleById(Guid incidentId);
        Task CloseIncident(Guid incidentId);
    }
}