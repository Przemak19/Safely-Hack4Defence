using App.Application.Dto.Incidents;
using App.Infrastructure;
using App.Infrastructure.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace App.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class IncidentReportsController : ControllerBase
    {
        private readonly IIncidentService _incidentService;

        public IncidentReportsController(AppDbContext dbContext, IIncidentService incidentService)
        {
            _incidentService = incidentService;
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> Create([FromBody] CreateIncidentRequest request) => 
            Ok(await _incidentService.Add(request));
        
        [HttpGet("{id:guid}")]
        [Authorize]
        public async Task<ActionResult<IncidentResponse>> GetById(Guid id)
        {
            var incident = await _incidentService.GetForRoleById(id);

            if (incident is null)
                return NotFound();
           
            return Ok(incident);
        }

        [HttpGet]
        [Authorize]
        public async Task<ActionResult<IncidentResponse[]>> GetAllForRole() => 
            Ok(await _incidentService.GetAllForRole());

        [HttpPatch("{id:guid}")]
        [Authorize]
        public async Task<ActionResult> Close(Guid id)
        {
            await _incidentService.CloseIncident(id);
            return Ok();
        }
    }
}
