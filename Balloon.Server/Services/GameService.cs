using System.Security.Claims;
using Balloon.Server.Database;
using Balloon.Server.DataModels;
using Balloon.Server.Helpers;
using Balloon.Shared.DataModels;
using Balloon.Shared.MessagePacks;
using Balloon.Shared.Services;
using Grpc.Core;
using MagicOnion;
using MagicOnion.Server;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace Balloon.Server.Services;

[Authorize]
public class GameService : ServiceBase<IGameService> , IGameService
{
    private readonly ILogger<GameService> logger;
    private readonly DatabaseContext _databaseContext;
    
    private Random random = new();

    public GameService(ILogger<GameService> logger,DatabaseContext databaseContext)
    {
        this.logger = logger;
        _databaseContext = databaseContext;
    }
    
    public async UnaryResult<StartResponse> StartGame(StartRequest request)
    {
        var userPrincipal = Context.CallContext.GetHttpContext().User;
        var userId = userPrincipal.Claims.First(x => x.Type == ClaimTypes.NameIdentifier).Value;
        var userGuid = Guid.Parse(userId);
        
        var userDto = await _databaseContext.Users.FirstOrDefaultAsync(x => x.Id == userGuid);
        
        var gameDto = new GameDataModel(userGuid,request.BetAmount);
        
        var startResponse = new StartResponse();

        if (userDto.Balance >= request.BetAmount)
        {
            userDto.Balance -= request.BetAmount;
            var gameEntity = await _databaseContext.AddAsync(gameDto);
            await _databaseContext.SaveChangesAsync();

            startResponse.Success = gameEntity.State == EntityState.Added;
            startResponse.GameViewModel = gameDto.ToViewModel();
            startResponse.UserViewModel = userDto.ToViewModel();
            
            Console.WriteLine($"Game Started : {gameEntity.State == EntityState.Added} With TicketId : {startResponse.GameViewModel.TicketId}");
        }
        
        return startResponse;
    }
    
    public async UnaryResult<UpdateResponse> UpdateGame(UpdateRequest request)
    {
        var userPrincipal = Context.CallContext.GetHttpContext().User;
        var userId = userPrincipal.Claims.First(x => x.Type == ClaimTypes.NameIdentifier).Value;
        var userGuid = Guid.Parse(userId);
        var ticketGuid = Guid.Parse(request.TicketId);
        
        var userDto = await _databaseContext.Users.FirstOrDefaultAsync(x => x.Id == userGuid);
        var gameDto = await _databaseContext.Games.FirstAsync(x => x.TicketId == ticketGuid);
        
        var updateResponse = new UpdateResponse();
        
        var gameTime = Convert.ToSingle(gameDto.GameTime);
        var currentRatio = gameTime / 60;
        var easedRatio = EasingFunctions.InQuad(currentRatio);
        var randomChance = (1f - easedRatio) * 97f;
        var randomAmount = random.NextSingle() * 100;
        var currentWin = gameDto.BetAmount +  EasingFunctions.InQuad(currentRatio) * 96;
        gameDto.CurrentWin = currentWin;

        gameDto.GameState = request.NeedToStop ? GameState.Finish : (randomAmount < randomChance ? GameState.Update : GameState.Finish);
        
        updateResponse.Game = gameDto.ToViewModel();
        updateResponse.IsWin = gameDto.GameState == GameState.Finish && request.NeedToStop && randomAmount < randomChance;

        if (updateResponse.IsWin)
        {
            userDto.Balance += gameDto.CurrentWin;
            await _databaseContext.SaveChangesAsync();
        }

        updateResponse.User = userDto.ToViewModel();
        
        return updateResponse;
    }
}