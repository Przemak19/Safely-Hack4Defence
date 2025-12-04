using App.Application.Dto.StrategicObjects;
using App.Infrastructure.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace App.Api.Controllers
{
    [ApiController]
    [AllowAnonymous]
    [Route("api/[controller]")]
    public class StrategicObjectController : ControllerBase
    {
        private readonly IStrategicObjectService strategicObjectService;

        public StrategicObjectController(IStrategicObjectService strategicObjectService)
        {
            this.strategicObjectService = strategicObjectService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<StrategicObjectDto>>> GetStrategicObjects() =>
            Ok(await this.strategicObjectService.GetStrategicObjects());
    }
}
