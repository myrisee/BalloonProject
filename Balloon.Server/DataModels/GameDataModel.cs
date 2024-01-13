using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Balloon.Shared.DataModels;

namespace Balloon.Server.DataModels;

public class GameDataModel : IDataModel<GameViewModel>
{
    [Key,DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public Guid TicketId { get; set; }
    public Guid UserId { get; set; }
    public GameState GameState { get; set; }
    public DateTime StartTime { get; set; }
    public double CurrentWin { get; set; }
    public double BetAmount { get; set; }
    public double GameTime => (DateTime.Now - StartTime).TotalSeconds;
    
    public GameDataModel(Guid userId, double betAmount)
    {
        UserId = userId;
        GameState = 0;
        StartTime = DateTime.Now;
        CurrentWin = betAmount;
        BetAmount = betAmount;
    }
    
    public GameViewModel ToViewModel()
    {
        return new GameViewModel()
        {
            TicketId = TicketId.ToString(),
            UserId = UserId.ToString(),
            GameState = GameState,
            StartTime = StartTime,
            CurrentWin = CurrentWin,
            BetAmount = BetAmount
        };
    }
}