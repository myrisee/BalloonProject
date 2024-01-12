using System;
using System.Runtime.InteropServices;
using MessagePack;

namespace Balloon.Shared.DataModels
{
    [MessagePackObject(true),System.Serializable]
    public class UserViewModel
    {
        public Guid Id { get; set; }
        public string Username { get; set; }
        public string Currency { get; set; }
        public double Balance { get; set; }

        public override string ToString()
        {
            return $"UserId: {Id} Currency: {Currency} Balance: {Balance}";
        }
    }
}