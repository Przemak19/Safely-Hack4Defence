using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using App.Domain;
using App.Domain.Models;

namespace App.Infrastructure
{
    public class AppDbContext : IdentityDbContext<ApplicationUser, IdentityRole<Guid>, Guid>

    {
        //private readonly ICurrentUserService _currentUserService;

        public DbSet<Photo> Photos { get; set; } = default!;
        public DbSet<ApplicationUser> ApplicationUsers { get; set; } = default!;

        public DbSet<RefreshToken> RefreshTokens { get; set; } = default!;
        public DbSet<GeoLocation> GeoLocations { get; set; } = default!;
        public DbSet<IncidentReport> IncidentReports { get; set; } = default!;
        public DbSet<StrategicObject> StrategicObjects { get; set; } = default!; 


        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            CorrectModificationFields();
            return await base.SaveChangesAsync(cancellationToken);
        }

        public async Task<int> SaveChangesAsyncWithoutUser()
        {
            return await base.SaveChangesAsync();
        }

        private void CorrectModificationFields()
        {
            foreach (var entry in ChangeTracker.Entries())
            {
                if (entry.Entity is not BaseEntity<Guid>)
                {
                    continue;
                }
                if (entry.State == EntityState.Modified)
                {
                    ((BaseEntity)entry.Entity).LMDate = DateTime.UtcNow;
                   //((BaseEntity)entry.Entity).LMEmail = _currentUserService?.Email;
                }
                else if (entry.State == EntityState.Added)
                {
                    ((BaseEntity)entry.Entity).LMDate = DateTime.UtcNow;
                    //((BaseEntity)entry.Entity).LMEmail = _currentUserService?.Email;
                    ((BaseEntity)entry.Entity).CreateDate = DateTime.UtcNow;
                    //((BaseEntity)entry.Entity).CreateEmail = _currentUserService?.Email;
                }
            }
        }
        public AppDbContext()
        {

        }

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {

        }

        //public AppContext(DbContextOptions<AppContext> options, ICurrentUserService currentUserService) : base(options)
        //{
        //    _currentUserService = currentUserService;
        //}

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(BaseEntity).Assembly);
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Photo>(e =>
            {
                e.HasKey(p => p.Id);
            });
        }
    }
}
