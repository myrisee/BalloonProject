using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Balloon.Shared.DataModels;

namespace Balloon.Server.DataModels;

public class UserDataModel : IDataModel<UserViewModel>
{
    [Key,DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public Guid Id { get; set; }
    public string Username { get; set; }
    public string Password { get; set; }
    public string Currency { get; set; }
    public double Balance { get; set; }
    
    public UserDataModel(string username,string password)
    {
        Username = username;
        Password = password;
        Currency = "USD";
        Balance = 1000;
    }
    
    public UserViewModel ToViewModel()
    {
        return new UserViewModel()
        {
            Id = Id,
            Username = Username,
            Currency = Currency,
            Balance = Balance
        };
    }
}