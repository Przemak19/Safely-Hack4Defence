namespace App.Domain
{
    public abstract class BaseEntity
    {
        public DateTime CreateDate { get; set; }

        public DateTime LMDate { get; set; }

        public string? CreateEmail { get; set; }

        public string? LMEmail { get; set; }
    }

    public abstract class BaseEntity<TKey> : BaseEntity where TKey : struct
    {
        public TKey Id { get; set; }

        public bool IsActive { get; set; }

        public BaseEntity()
        {
            IsActive = true;
        }
    }
}
