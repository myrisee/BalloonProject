using System;
using Balloon.Shared.DataModels;

namespace Services.Interfaces
{
    public interface IUserService
    {
        public Action<string,UserInfo> OnLogin { get; set; }
        void Login(string username, string password);
        void Register(string username, string password);
        void Logout(string sessionKey);
        bool SessionIsValid(string sessionKey);
        bool GetUserInfo(string sessionKey,out UserInfo userInfo);
    }
}