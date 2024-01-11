using System;
using Balloon.Shared.DataModels;
using MessagePack;

namespace Balloon.Shared.MessagePacks
{
    [MessagePackObject(true)]
    public class StartResponse
    {
        public string TicketId { get; set; }
        public GameInfo GameInfo { get; set; }
        public UserInfo UserInfo { get; set; }
    }
    
    [MessagePackObject(true)]
    public class UpdateResponse
    {
        public string TicketId { get; set; }
        public GameInfo GameInfo { get; set; }
        public UserInfo UserInfo { get; set; }
        public bool IsWin { get; set; }
    }

    [MessagePackObject(true)]
    public class LoginResponse
    {
        public string UserId { get; set; }
        public string Token{ get; set; }
        public DateTimeOffset  Expiration { get; set; }
        public bool Success { get; set; }
    }
    
    [MessagePackObject(true)]
    public class SessionInfo
    {
        public string Token { get; set; }
        public DateTimeOffset  Expiration { get; set; }
        public UserInfo UserInfo { get; set; }
        
        public SessionInfo(string token, DateTimeOffset expiration, UserInfo userInfo)
        {
            this.Token = token;
            this.Expiration = expiration;
            this.UserInfo = userInfo;
        }

        public SessionInfo()
        {
            
        }

        public override string ToString()
        {
            return $"{Token + Environment.NewLine} {Expiration + Environment.NewLine} {UserInfo}";
        }
    }
}