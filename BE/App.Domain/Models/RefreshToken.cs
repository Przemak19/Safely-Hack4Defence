namespace App.Domain.Models
{
    public class RefreshToken : BaseEntity<Guid>
    {
        public Guid UserId { get; set; }
        public ApplicationUser User { get; set; } = default!;

        public string Token { get; set; } = default!;

        public DateTime ExpiresAt { get; set; }

        public DateTime? RevokedAt { get; set; }

        public bool IsActive => RevokedAt == null && DateTime.UtcNow < ExpiresAt;
    }
}
