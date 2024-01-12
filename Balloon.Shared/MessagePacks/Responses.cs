using System;
using Balloon.Shared.DataModels;
using MessagePack;

namespace Balloon.Shared.MessagePacks
{
    [MessagePackObject(true)]
    public class StartResponse
    {
        public bool Success { get; set; }
        public GameViewModel GameViewModel { get; set; }
        public UserViewModel UserViewModel { get; set; }
    }
    
    [MessagePackObject(true)]
    public class UpdateResponse
    {
        public GameViewModel Game { get; set; }
        public UserViewModel User { get; set; }
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
        public UserViewModel User { get; set; }
        
        public SessionInfo(string token, DateTimeOffset expiration, UserViewModel user)
        {
            this.Token = token;
            this.Expiration = expiration;
            this.User = user;
        }

        public SessionInfo()
        {
            
        }

        public override string ToString()
        {
            return $"{Token + Environment.NewLine} {Expiration + Environment.NewLine} {User}";
        }
    }
}