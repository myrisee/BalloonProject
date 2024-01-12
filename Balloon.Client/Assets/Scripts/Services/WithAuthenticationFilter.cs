using System;
using System.Threading.Tasks;
using Balloon.Shared.DataModels;
using Balloon.Shared.MessagePacks;
using Balloon.Shared.Services;
using Grpc.Core;
using MagicOnion.Client;
using UnityEngine;

namespace Services
{
    public class WithAuthenticationFilter : IClientFilter
    {
        private readonly string _signInId;
        private readonly string _password;
        private readonly ChannelBase _channel;

        public WithAuthenticationFilter(string signInId, string password, ChannelBase channel)
        {
            _signInId = signInId ?? throw new ArgumentNullException(nameof(signInId));
            _password = password ?? throw new ArgumentNullException(nameof(password));
            _channel = channel ?? throw new ArgumentNullException(nameof(channel));
        }

        public async ValueTask<ResponseContext> SendAsync(RequestContext context, Func<RequestContext, ValueTask<ResponseContext>> next)
        {
            if (AuthenticationTokenStorage.IsExpired)
            {
                Console.WriteLine($@"[WithAuthenticationFilter/IAccountService.Login] Try signing in as '{_signInId}'... ({(AuthenticationTokenStorage.Token == null ? "FirstTime" : "RefreshToken")})");

                var client = MagicOnionClient.Create<IAccountService>(_channel);
                var authResult = await client.LoginAsync(_signInId, _password);
                if (!authResult.Success)
                {
                    var response = await client.Register(_signInId, _password);
                    if (response)
                    {
                        authResult = await client.LoginAsync(_signInId, _password);
                    }
                    else
                    {
                        Debug.LogError($"Failed to register user {_signInId}");
                        return await next(context);
                    }
                }
                Console.WriteLine($@"[WithAuthenticationFilter/IAccountService.Login] User authenticated as {authResult.UserId}");

                AuthenticationTokenStorage.Update(authResult); // NOTE: You can also read the token expiration date from JWT.

                context.CallOptions.Headers.Remove(new Metadata.Entry("Authorization", string.Empty));
            }

            if (!context.CallOptions.Headers.Contains(new Metadata.Entry("Authorization", string.Empty)))
            {
                context.CallOptions.Headers.Add("Authorization","Bearer " + AuthenticationTokenStorage.Token);
            }

            return await next(context);
        }
    }
    
    public static class AuthenticationTokenStorage
    {
        public static Action OnAuthenticationTokenUpdated;
        
        private static readonly object _syncObject = new object();

        public static string Token { get; private set; }
        public static DateTimeOffset Expiration { get; private set; }
        public static string UserId { get; private set; }

        public static bool IsExpired => Token == null || Expiration < DateTimeOffset.Now;

        public static void Update(string token, DateTimeOffset expiration)
        {
            lock (_syncObject)
            {
                Token = token ?? throw new ArgumentNullException(nameof(token));
                Expiration = expiration;
            }
        }

        public static void Update(LoginResponse loginResponse)
        {
            lock (_syncObject)
            {
                Token = loginResponse.Token ?? throw new ArgumentNullException(nameof(loginResponse.Token));
                UserId = loginResponse.UserId;
                Expiration = loginResponse.Expiration;
                Debug.Log("Token Updated");
            }
            
            OnAuthenticationTokenUpdated?.Invoke();
        }
    }
}