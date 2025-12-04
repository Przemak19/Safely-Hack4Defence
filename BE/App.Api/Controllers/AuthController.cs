using App.Application.Dto;
using App.Application.Options;
using App.Domain.Models;
using App.Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using LoginRequest = App.Application.Dto.LoginRequest;
using RegisterRequest = App.Application.Dto.RegisterRequest;

namespace App.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private const string AccessTokenCookieName = "access_token";
        private const string RefreshTokenCookieName = "refresh_token";

        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly JwtSettings _jwtSettings;
        private readonly AppDbContext _dbContext;
        private readonly IHttpContextAccessor httpContextAccessor;

        public AuthController(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            IOptions<JwtSettings> jwtOptions,
            AppDbContext dbContext, 
            IHttpContextAccessor httpContextAccessor)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _jwtSettings = jwtOptions.Value;
            _dbContext = dbContext;
            this.httpContextAccessor = httpContextAccessor;
        }

        [HttpPost("register")]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            var existing = await _userManager.FindByEmailAsync(request.Email);
            if (existing != null)
                return BadRequest("Email already in use");

            var user = new ApplicationUser
            {
                Id = Guid.NewGuid(),
                UserName = request.Email,
                Email = request.Email
            };

            var result = await _userManager.CreateAsync(user, request.Password);
            if (!result.Succeeded)
                return BadRequest(result.Errors);

            await _userManager.AddToRolesAsync(user, new[]
            {
                 request.Role
            });

            return Ok();
        }

        /// <summary>
        /// Logowanie – ustawia access_token i refresh_token w HttpOnly cookies.
        /// </summary>
        [HttpPost("login")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(LoginResponse))]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var user = await _userManager.FindByEmailAsync(request.Email);
            if (user == null)
                return Unauthorized();

            var signInResult = await _signInManager.CheckPasswordSignInAsync(
                user,
                request.Password,
                lockoutOnFailure: false);

            if (!signInResult.Succeeded)
                return Unauthorized();

            var roles = await _userManager.GetRolesAsync(user);
            var (accessToken, accessExpiresAt) = GenerateJwt(user, roles);
            var (refreshToken, refreshExpiresAt) = await CreateRefreshTokenAsync(user);

            SetAuthCookies(accessToken, accessExpiresAt, refreshToken, refreshExpiresAt);

            return Ok(new LoginResponse(user.Email ?? string.Empty, accessExpiresAt));
        }

        /// <summary>
        /// Odświeżenie access tokenu – korzysta z refresh_token w cookie.
        /// </summary>
        [HttpPost("refresh")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(LoginResponse))]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> Refresh()
        {
            if (!Request.Cookies.TryGetValue(RefreshTokenCookieName, out var refreshTokenValue) ||
                string.IsNullOrWhiteSpace(refreshTokenValue))
            {
                return Unauthorized();
            }

            var existing = await _dbContext.RefreshTokens
                .Include(rt => rt.User)
                .SingleOrDefaultAsync(rt => rt.Token == refreshTokenValue);

            if (existing == null || !existing.IsActive)
                return Unauthorized();

            var user = existing.User;

            // Rotacja refresh tokenu – stary unieważniamy
            existing.RevokedAt = DateTime.UtcNow;

            var roles = await _userManager.GetRolesAsync(user);
            var (accessToken, accessExpiresAt) = GenerateJwt(user, roles);
            var (newRefreshToken, refreshExpiresAt) = await CreateRefreshTokenAsync(user);

            SetAuthCookies(accessToken, accessExpiresAt, newRefreshToken, refreshExpiresAt);

            await _dbContext.SaveChangesAsync();

            return Ok(new LoginResponse(user.Email ?? string.Empty, accessExpiresAt));
        }

        /// <summary>
        /// Logout – unieważnia refresh token i czyści cookies.
        /// </summary>
        [HttpPost("logout")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> Logout()
        {
            if (Request.Cookies.TryGetValue(RefreshTokenCookieName, out var refreshTokenValue) &&
                !string.IsNullOrWhiteSpace(refreshTokenValue))
            {
                var existing = await _dbContext.RefreshTokens
                    .SingleOrDefaultAsync(rt => rt.Token == refreshTokenValue && rt.RevokedAt == null);

                if (existing != null)
                {
                    existing.RevokedAt = DateTime.UtcNow;
                    await _dbContext.SaveChangesAsync();
                }
            }

            DeleteAuthCookies();

            return Ok();
        }

        [HttpGet("role")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> GetRole()
        {
            return Ok(httpContextAccessor?.HttpContext?.User.Claims.First(x => x.Type == ClaimTypes.Role).Value);
        }

        private (string token, DateTime expiresAt) GenerateJwt(ApplicationUser user, IList<string>? roles)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Secret));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var expiresAt = DateTime.UtcNow.AddMinutes(_jwtSettings.ExpirationMinutes);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email ?? string.Empty),
                new Claim("role", roles[0])
            };

            var token = new JwtSecurityToken(
                _jwtSettings.Issuer,
                _jwtSettings.Audience,
                claims,
                expires: expiresAt,
                signingCredentials: creds);

            var jwt = new JwtSecurityTokenHandler().WriteToken(token);
            return (jwt, expiresAt);
        }

        private async Task<(string token, DateTime expiresAt)> CreateRefreshTokenAsync(ApplicationUser user)
        {
            var randomBytes = RandomNumberGenerator.GetBytes(64);
            var token = Convert.ToBase64String(randomBytes);

            var expiresAt = DateTime.UtcNow.AddDays(_jwtSettings.RefreshTokenExpirationDays);

            var refreshToken = new RefreshToken
            {
                Id = Guid.NewGuid(),
                UserId = user.Id,
                User = user,
                Token = token,
                ExpiresAt = expiresAt
            };

            _dbContext.RefreshTokens.Add(refreshToken);
            await _dbContext.SaveChangesAsync();

            return (token, expiresAt);
        }

        private void SetAuthCookies(string accessToken, DateTime accessExpiresAt, string refreshToken, DateTime refreshExpiresAt)
        {
            var accessCookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = accessExpiresAt,
                Path = "/"
            };

            var refreshCookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = refreshExpiresAt,
                Path = "/"
            };

            Response.Cookies.Append(AccessTokenCookieName, accessToken, accessCookieOptions);
            Response.Cookies.Append(RefreshTokenCookieName, refreshToken, refreshCookieOptions);
        }

        private void DeleteAuthCookies()
        {
            var opts = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTime.UtcNow.AddDays(-1),
                Path = "/"
            };

            Response.Cookies.Delete(AccessTokenCookieName, opts);
            Response.Cookies.Delete(RefreshTokenCookieName, opts);
        }
    }
}
