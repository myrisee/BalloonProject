using Balloon.Server.DataModels;
using Balloon.Shared.DataModels;
using Microsoft.EntityFrameworkCore;

namespace Balloon.Server.Database;

public class DatabaseContext : DbContext
{
    public DbSet<UserDataModel> Users { get; set; }
    public DbSet<GameDataModel> Games { get; set; }
    
    public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options)
    {
        
    }
}