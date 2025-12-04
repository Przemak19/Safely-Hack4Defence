using App.Domain.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;

namespace App.Infrastructure
{
    public static class IdentitySeed
    {
        private static readonly string[] Roles =
        {
            "Admin",
            "FireFighter",
            "Police",
            "Soldier",
            "CBZC"
        };

        public static async Task SeedAsync(IServiceProvider services)
        {
            using var scope = services.CreateScope();

            var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole<Guid>>>();
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();

            foreach (var roleName in Roles)
            {
                if (!await roleManager.RoleExistsAsync(roleName))
                {
                    await roleManager.CreateAsync(new IdentityRole<Guid>
                    {
                        Id = Guid.NewGuid(),
                        Name = roleName,
                        NormalizedName = roleName.ToUpperInvariant()
                    });
                }
            }

            var adminEmail = "admin@hack.local";
            if (await userManager.FindByEmailAsync(adminEmail) is null)
            {
                var admin = new ApplicationUser
                {
                    Id = Guid.NewGuid(),
                    Email = adminEmail,
                    UserName = adminEmail,
                    NormalizedUserName = adminEmail.ToUpperInvariant(),
                    NormalizedEmail = adminEmail.ToUpperInvariant(),
                    EmailConfirmed = true
                };

                var result = await userManager.CreateAsync(admin, "Admin123!");
                if (result.Succeeded)
                {
                    await userManager.AddToRolesAsync(admin, new[]
                    {
                        "Admin"
                    });
                }
            }

            var fireFighterEmail = "fire@hack.local";
            if (await userManager.FindByEmailAsync(fireFighterEmail) is null)
            {
                var fire = new ApplicationUser
                {
                    Id = Guid.NewGuid(),
                    Email = fireFighterEmail,
                    UserName = fireFighterEmail,
                    NormalizedUserName = fireFighterEmail.ToUpperInvariant(),
                    NormalizedEmail = fireFighterEmail.ToUpperInvariant(),
                    EmailConfirmed = true
                };

                var result = await userManager.CreateAsync(fire, "Fire123!");
                if (result.Succeeded)
                {
                    await userManager.AddToRolesAsync(fire, new[]
                    {
                        "FireFighter"
                    });
                }
            }

            var policeEmail = "police@hack.local";
            if (await userManager.FindByEmailAsync(policeEmail) is null)
            {
                var police = new ApplicationUser
                {
                    Id = Guid.NewGuid(),
                    Email = policeEmail,
                    UserName = policeEmail,
                    NormalizedUserName = policeEmail.ToUpperInvariant(),
                    NormalizedEmail = policeEmail.ToUpperInvariant(),
                    EmailConfirmed = true
                };

                var result = await userManager.CreateAsync(police, "Police123!");
                if (result.Succeeded)
                {
                    await userManager.AddToRolesAsync(police, new[]
                    {
                        "Police"
                    });
                }
            }

            var soldierEmail = "soldier@hack.local";
            if (await userManager.FindByEmailAsync(soldierEmail) is null)
            {
                var soldier = new ApplicationUser
                {
                    Id = Guid.NewGuid(),
                    Email = soldierEmail,
                    UserName = soldierEmail,
                    NormalizedUserName = soldierEmail.ToUpperInvariant(),
                    NormalizedEmail = soldierEmail.ToUpperInvariant(),
                    EmailConfirmed = true
                };

                var result = await userManager.CreateAsync(soldier, "Soldier123!");
                if (result.Succeeded)
                {
                    await userManager.AddToRolesAsync(soldier, new[]
                    {
                        "Soldier"
                    });
                }
            }

            var cbzcEmail = "cbzc@hack.local";
            if (await userManager.FindByEmailAsync(cbzcEmail) is null)
            {
                var cbzc = new ApplicationUser
                {
                    Id = Guid.NewGuid(),
                    Email = cbzcEmail,
                    UserName = cbzcEmail,
                    NormalizedUserName = cbzcEmail.ToUpperInvariant(),
                    NormalizedEmail = cbzcEmail.ToUpperInvariant(),
                    EmailConfirmed = true
                };

                var result = await userManager.CreateAsync(cbzc, "Cbzc123!");
                if (result.Succeeded)
                {
                    await userManager.AddToRolesAsync(cbzc, new[]
                    {
                        "CBZC"
                    });
                }
            }
        }
    }
}
