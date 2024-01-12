using System.Security.Claims;
using Balloon.Server.Database;
using Balloon.Server.DTO;
using Balloon.Shared.DataModels;
using Balloon.Shared.MessagePacks;
using Balloon.Shared.Services;
using Grpc.Core;
using MagicOnion;
using MagicOnion.Server;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace Balloon.Server.Services;

[Authorize]
public class AccountService : ServiceBase<IAccountService>, IAccountService
{
    public static AccountService Instance;
    
    private readonly ILogger _logger;
    private readonly DatabaseContext _databaseContext;
    private readonly JwtTokenService _jwtTokenService;

    public AccountService(ILogger<AccountService> logger,DatabaseContext databaseContext,JwtTokenService jwtTokenService)
    {
        Instance = this;
        _logger = logger;
        _databaseContext = databaseContext;
        _jwtTokenService = jwtTokenService;
    }
    
    [AllowAnonymous]
    public async UnaryResult<LoginResponse> LoginAsync(string username, string password)
    {
        var userDto = await _databaseContext.Users.FirstOrDefaultAsync(x => x.Username == username && x.Password == password);
        
        if(userDto == null)
            return new LoginResponse() {Success = false};
        
        var loginResponse = new LoginResponse();
        var userInfo = new UserViewModel()
        {
            Id = userDto.Id,
            Username = userDto.Username,
            Currency = userDto.Currency,
            Balance = userDto.Balance
        };
        
        var (token,expirationTime) = _jwtTokenService.CreateToken(userInfo);
        var session = new SessionInfo(token,expirationTime,userInfo);

        loginResponse.Token = token;
        loginResponse.UserId = userInfo.Id.ToString();
        loginResponse.Expiration = expirationTime;
        loginResponse.Success = true;
        
        Console.WriteLine($"User {userInfo.Id} Logged with Token : {token}");
        
        return loginResponse;
    }
    
    [AllowAnonymous]
    public async UnaryResult<bool> Register(string username, string password)
    {
        var user = new UserDto(username, password);
        var result = _databaseContext.Users.Add(user);
        await _databaseContext.SaveChangesAsync();
        return result.State == EntityState.Added;
    }
    
    public async UnaryResult<UserViewModel> GetCurrentUser()
    {
        var userId = Context.CallContext.GetHttpContext().User.Claims.First(x => x.Type == ClaimTypes.NameIdentifier);
        var userIdGuid = Guid.Parse(userId.Value);
        
        var userDto = await _databaseContext.Users.FirstOrDefaultAsync(x => x.Id == userIdGuid);
        var userViewModel = new UserViewModel()
        {
            Id = userDto.Id,
            Username = userDto.Username,
            Currency = userDto.Currency,
            Balance = userDto.Balance
        };

        return userViewModel;
    }
}