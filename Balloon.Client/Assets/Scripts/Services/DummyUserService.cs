using System;
using System.Collections.Generic;
using Balloon.Shared.DataModels;
using Cysharp.Threading.Tasks;
using Services.Interfaces;
using UnityEngine;
using Random = System.Random;

namespace Services
{
    public class DummyUserService : MonoBehaviour,IUserService
    {
        public UserTable userTable;
        
        private Dictionary<string, UserInfo> sessions = new Dictionary<string, UserInfo>();

        public Action<string, UserInfo> OnLogin { get; set; }

        public async void Login(string username, string password)
        {
            await UniTask.Delay(UnityEngine.Random.Range(1000, 3000));
            
            var user = userTable.GetUser(username);

            if (user.Password == password)
            {
                var sessionKey = System.Guid.NewGuid();
                
                sessions.Add(sessionKey.ToString(),user);
                
                OnLogin?.Invoke(sessionKey.ToString(),user);
            }
        }

        public void Register(string username, string password)
        {
            
        }

        public bool SessionIsValid(string sessionKey)
        {
            return sessions.ContainsKey(sessionKey);
        }

        public bool GetUserInfo(string sessionKey,out UserInfo userInfo)
        {
            return sessions.TryGetValue(sessionKey, out userInfo);
        }

        public void Logout(string sessionKey)
        {
            if(sessions.ContainsKey(sessionKey))
                sessions.Remove(sessionKey);
        }
    }
}