namespace App.Application.Options
{
    public class JwtSettings
    {
        public string Issuer { get; set; } = default!;
        public string Audience { get; set; } = default!;
        public string Secret { get; set; } = default!;
        public int ExpirationMinutes { get; set; }
        public int RefreshTokenExpirationDays { get; set; } = 7;
    }
}
