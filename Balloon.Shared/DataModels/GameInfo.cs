using System;
using MessagePack;

namespace Balloon.Shared.DataModels
{
    [MessagePackObject(true), System.Serializable]
    public class GameInfo
    {
        public string UserId { get; set; }
        public GameStatus GameStatus { get; set; }
        public DateTime StartTime { get; set; }
        public double CurrentWin { get; set; }
        public double BetAmount { get; set; }
        
        [IgnoreMember]
        public double GameTime => (DateTime.Now - StartTime).TotalSeconds;
        
        public GameInfo(string userId, double betAmount)
        {
            UserId = userId;
            GameStatus = GameStatus.Start;
            StartTime = DateTime.Now;
            CurrentWin = betAmount;
            BetAmount = betAmount;
        }

        public GameInfo(){}
    }
    
    [System.Serializable]
    public enum GameStatus
    {
        Start,
        Update,
        Finish
    }
}