using System.Security.Claims;
using Balloon.Server.Helpers;
using Balloon.Shared.DataModels;
using Balloon.Shared.MessagePacks;
using Balloon.Shared.Services;
using Grpc.Core;
using MagicOnion;
using MagicOnion.Server;
using Microsoft.AspNetCore.Authorization;

namespace Balloon.Server.Services;

[Authorize]
public class GameService : ServiceBase<IGameService> , IGameService
{
    private readonly ILogger<GameService> logger;

    public static Dictionary<string, GameInfo> Games = new();
    private Random random = new();

    public GameService(ILogger<GameService> logger)
    {
        this.logger = logger;
    }
    
    public async UnaryResult<StartResponse> StartGame(StartRequest request)
    {
        var userPrincipal = Context.CallContext.GetHttpContext().User;
        var userId = userPrincipal.Claims.First(x => x.Type == ClaimTypes.NameIdentifier).Value;
        
        var userInfo = AccountService.Instance.GetSessionInfo(userId).UserInfo;
        var gameInfo = new GameInfo(userId,request.BetAmount);
        var startResponse = new StartResponse();

        if (userInfo.Balance >= request.BetAmount)
        {
            userInfo.Balance -= request.BetAmount;
            var ticketId = Guid.NewGuid().ToString();

            startResponse.TicketId = ticketId;
            startResponse.GameInfo = gameInfo;
            startResponse.UserInfo = userInfo;
            
            var result = Games.TryAdd(startResponse.TicketId,gameInfo);
            Console.WriteLine($"Game Started : {result} With TicketId : {startResponse.TicketId} GameCount : {Games.Count}");
        }
        
        return startResponse;
    }
    
    public async UnaryResult<UpdateResponse> UpdateGame(UpdateRequest request)
    {
        var userPrincipal = Context.CallContext.GetHttpContext().User;
        var userId = userPrincipal.Claims.First(x => x.Type == ClaimTypes.NameIdentifier).Value;
        var updateResponse = new UpdateResponse();
        var sessionInfo = AccountService.Instance.GetSessionInfo(userId);
        
        if (Games.TryGetValue(request.TicketId, out var gameInfo) && sessionInfo != null && gameInfo.UserId == sessionInfo.UserInfo.UserId)
        {
            var gameTime = Convert.ToSingle(gameInfo.GameTime);
            var currentRatio = gameTime / 60;
            var easedRatio = EasingFunctions.InQuad(currentRatio);
            var randomChance = (1f - easedRatio) * 97f;
            var randomAmount = random.NextSingle() * 100;
            var currentWin = gameInfo.BetAmount +  EasingFunctions.InQuad(currentRatio) * 96;
            gameInfo.CurrentWin = currentWin;

            gameInfo.GameStatus = request.NeedToStop ? GameStatus.Finish : (randomAmount < randomChance ? GameStatus.Update : GameStatus.Finish);
            
            updateResponse.TicketId = request.TicketId;
            updateResponse.GameInfo = gameInfo;
            updateResponse.IsWin = gameInfo.GameStatus == GameStatus.Finish && request.NeedToStop && randomAmount < randomChance;
            
            if(updateResponse.IsWin)
                sessionInfo.UserInfo.Balance += gameInfo.CurrentWin;
            
            updateResponse.UserInfo = sessionInfo.UserInfo;
        }
        
        return updateResponse;
    }
}