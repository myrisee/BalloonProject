using System;
using System.Runtime.InteropServices;
using MessagePack;

namespace Balloon.Shared.DataModels
{
    [MessagePackObject(true),System.Serializable]
    public class UserInfo
    {
        public string UserId { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string Currency { get; set; }
        public double Balance { get; set; }
        public string Name { get; set; }

        public UserInfo(string username, string password)
        {
            this.UserId = System.Guid.NewGuid().ToString();
            this.Username = username;
            this.Password = password;
            this.Currency = "USD";
            this.Balance = 20000;
            this.Name = username;
        }

        public UserInfo()
        {
            
        }

        public override string ToString()
        {
            return $"UserId: {UserId} Currency: {Currency} Balance: {Balance}";
        }
    }
}