using Balloon.Server.DTO;
using Balloon.Shared.DataModels;
using Microsoft.EntityFrameworkCore;

namespace Balloon.Server.Database;

public class DatabaseContext : DbContext
{
    public DbSet<UserDto> Users { get; set; }
    public DbSet<GameDto> Games { get; set; }
    
    public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options)
    {
        
    }
}