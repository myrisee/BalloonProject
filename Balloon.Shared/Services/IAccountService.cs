﻿using Balloon.Shared.DataModels;
using Balloon.Shared.MessagePacks;
using MagicOnion;

namespace Balloon.Shared.Services
{
    public interface IAccountService : IService<IAccountService>
    {
        UnaryResult<LoginResponse> LoginAsync(string username, string password);
        UnaryResult<SessionInfo> GetCurrentSessionInfo();
        UnaryResult<bool> Register(string username, string password);
    }
}