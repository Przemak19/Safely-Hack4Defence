using App.Application.Dto.Incidents;
using App.Domain.Enums;
using App.Domain.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace App.Infrastructure.Services
{
    public class IncidentService : IIncidentService
    {
        private readonly AppDbContext _dbContext;
        private readonly IHttpContextAccessor httpContextAccessor;

        private Dictionary<string, EventCategory[]> eventMatrice = new Dictionary<string, EventCategory[]>
        {
            { "Admin", [EventCategory.Fire, EventCategory.Flood, EventCategory.HarmfulIncident, EventCategory.AirThreat, EventCategory.CyberThreat] },
            { "FireFighter", [EventCategory.Fire, EventCategory.Flood] },
            { "Police", [EventCategory.HarmfulIncident] },
            { "Soldier", [EventCategory.AirThreat] },
            { "CBZC", [EventCategory.CyberThreat] },
        }; 

        public IncidentService(AppDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        {
            this._dbContext = dbContext;
            this.httpContextAccessor = httpContextAccessor;
        }

        public async Task<Guid> Add(CreateIncidentRequest request)
        {
            var incident = request.ToDomainModel();

            _dbContext.Set<IncidentReport>().Add(incident);
            await _dbContext.SaveChangesAsync();
            //logic per incident Type
            return incident.Id;
        }

        public async Task<IEnumerable<IncidentResponse>> GetAllForRole()
        {
            var role = httpContextAccessor?.HttpContext?.User.Claims.First(x => x.Type == ClaimTypes.Role).Value;
            var allowedTypes = eventMatrice[role];
            var incidents = await _dbContext.IncidentReports
                .Include(x => x.Coordinates)
                .Include(x => x.Photos)
                .Where(x => allowedTypes.Contains(x.EventCategory))
                .OrderByDescending(x => x.CreateDate)
                .ToListAsync();
            return incidents.Select(x => IncidentResponse.ToDto(x));
        }

        public async Task<IncidentResponse> GetForRoleById(Guid incidentId)
        {
            var role = httpContextAccessor?.HttpContext?.User.Claims.First(x => x.Type == ClaimTypes.Role).Value;
            var allowedTypes = eventMatrice[role];
            var incident = await _dbContext.IncidentReports
                .Include(x => x.Coordinates)
                .Include(x => x.Photos)
                .Where(x => allowedTypes.Contains(x.EventCategory))
                .FirstAsync(x => x.Id == incidentId);
            return IncidentResponse.ToDto(incident);
        }

        public async Task CloseIncident(Guid incidentId)
        {
            var role = httpContextAccessor?.HttpContext?.User.Claims.First(x => x.Type == ClaimTypes.Role).Value;
            var allowedTypes = eventMatrice[role];
            var incident = await _dbContext.IncidentReports
                .Include(x => x.Coordinates)
                .Include(x => x.Photos)
                .Where(x => allowedTypes.Contains(x.EventCategory))
                .Where(x => x.IncidentStatus != IncidentStatus.Closed)
                .FirstAsync(x => x.Id == incidentId);

            if (incident is not null)
                incident.IncidentStatus = IncidentStatus.Closed;
            await _dbContext.SaveChangesAsync();
        }
    }
}
