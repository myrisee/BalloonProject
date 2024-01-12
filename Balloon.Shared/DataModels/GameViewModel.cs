using System;
using MessagePack;

namespace Balloon.Shared.DataModels
{
    [MessagePackObject(true), System.Serializable]
    public class GameViewModel
    {
        public string TicketId { get; set; }
        public string UserId { get; set; }
        public GameState GameState { get; set; }
        public DateTime StartTime { get; set; }
        public double CurrentWin { get; set; }
        public double BetAmount { get; set; }
        
        public GameViewModel(Guid userId, double betAmount)
        {
            UserId = userId.ToString();
            GameState = GameState.Start;
            StartTime = DateTime.Now;
            CurrentWin = betAmount;
            BetAmount = betAmount;
        }

        public GameViewModel(){}
    }
}