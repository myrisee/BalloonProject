using System.Security.Claims;
using Balloon.Shared.DataModels;
using Balloon.Shared.MessagePacks;
using Balloon.Shared.Services;
using Grpc.Core;
using MagicOnion;
using MagicOnion.Server;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;

namespace Balloon.Server.Services;

[Authorize]
public class AccountService : ServiceBase<IAccountService>, IAccountService
{
    public static AccountService Instance;
    
    public static Dictionary<string,SessionInfo> Sessions = new();
    
    private readonly ILogger _logger;
    private readonly JwtTokenService _jwtTokenService;

    public AccountService(ILogger<AccountService> logger,JwtTokenService jwtTokenService)
    {
        Instance = this;
        _logger = logger;
        _jwtTokenService = jwtTokenService;
    }
    
    [AllowAnonymous]
    public async UnaryResult<LoginResponse> LoginAsync(string username, string password)
    {
        var loginResponse = new LoginResponse();
        var userInfo = new UserInfo(username, password);
        var (token,expirationTime) = _jwtTokenService.CreateToken(userInfo);
        var session = new SessionInfo(token,expirationTime,userInfo);
        
        var isAdded = Sessions.TryAdd(userInfo.UserId,session);

        loginResponse.Token = token;
        loginResponse.UserId = userInfo.UserId;
        loginResponse.Expiration = expirationTime;
        loginResponse.Success = true;
        
        Console.WriteLine($"User {userInfo.UserId} Logged {isAdded} with Token : {token}");
        
        return loginResponse;
    }
    
    public UnaryResult<bool> Register(string username, string password)
    {
        throw new NotImplementedException();
    }
    
    public async UnaryResult<SessionInfo> GetCurrentSessionInfo()
    {
        var userId = Context.CallContext.GetHttpContext().User.Claims.First(x => x.Type == ClaimTypes.NameIdentifier);
        var sessionInfo = Sessions[userId.Value];
        return sessionInfo;
    }
    
    public SessionInfo? GetSessionInfo(string userId)
    {
        return Sessions[userId];
    }
}