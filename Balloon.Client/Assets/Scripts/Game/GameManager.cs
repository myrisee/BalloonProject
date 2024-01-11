using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Balloon.Shared;
using Balloon.Shared.DataModels;
using Balloon.Shared.MessagePacks;
using Balloon.Shared.Services;
using Cysharp.Threading.Tasks;
using Grpc.Core;
using MagicOnion;
using MagicOnion.Client;
using MagicOnion.Unity;
using Reflex.Scripts.Attributes;
using Services;
using Services.Interfaces;
using Spine.Unity;
using UnityEngine;
using Channel = Grpc.Core.Channel;

namespace Game
{
    public class GameManager : MonoBehaviour
    {
        public static Action<UserInfo> OnUserInfoUpdated;
        public static Action<GameInfo> OnGameInfoUpdated;
        
        [Header("References")]
        public List<Balloon> balloons;
        public List<Explosion> explosions;
        public SkeletonAnimation winParticles;
        public SkeletonAnimation shadow;
        public SkeletonAnimation background;
        public SkeletonGraphic buttonPipe;

        [Header("GameService.Protocol")]
        [SerializeField] private string token;
        [SerializeField] private string userId;

        public UserInfo UserInfo
        {
            get => userInfo;
            set
            {
                userInfo = value;
                userId = userInfo.UserId;
                OnUserInfoUpdated?.Invoke(userInfo);
            }
        }

        public SessionInfo SessionInfo
        {
            get => sessionInfo;
            set
            {
                sessionInfo = value;
                UserInfo = sessionInfo.UserInfo;
                token = sessionInfo.Token;
            }
        }

        public GameInfo GameInfo
        {
            get => gameInfo;
            set
            {
                gameInfo = value;

                if (gameInfo != null)
                    OnGameInfoUpdated?.Invoke(gameInfo);
            }
        }

        [SerializeField] private bool needToStop;
        [SerializeField] private string currentTicketId;
        
        [Inject] private SoundManager soundManager;

        private SessionInfo sessionInfo;
        private UserInfo userInfo;
        private GameInfo gameInfo;
        private Channel channel;
        private IAccountService accountService;
        private IGameService gameService;
        
        private void Awake()
        {
            GameWindow.OnPlayButtonDownEvent += StartRequest;
            GameWindow.OnPlayButtonUpEvent += StopRequest;
            AuthenticationTokenStorage.OnAuthenticationTokenUpdated += OnAuthenticationTokenUpdated;
        }

        private async void Start()
        {
            await InitializeClientAsync();
        }

        private async Task InitializeClientAsync()
        {
            channel = new Channel("localhost", 5000, ChannelCredentials.Insecure);
            
            var signInId = "test";
            var password = "1337";
            
            var authFilter = new WithAuthenticationFilter(signInId, password, channel);
            
            accountService = MagicOnionClient.Create<IAccountService>(channel,new[] { authFilter});
            var currentSessionInfo = await accountService.GetCurrentSessionInfo();
            SessionInfo = currentSessionInfo;

            
        }

        private void OnAuthenticationTokenUpdated()
        {
            var signInId = "test";
            var password = "1337";
            
            var authFilter = new WithAuthenticationFilter(signInId, password, channel);
            
            var callOptions = new CallOptions().WithHeaders(new Metadata()
            {
                { "Authorization", "Bearer " + AuthenticationTokenStorage.Token }
            });
            
            gameService = MagicOnionClient.Create<IGameService>(channel).WithOptions(callOptions);
        }

        private async void FixedUpdate()
        {
            if(string.IsNullOrEmpty(currentTicketId) || GameInfo.GameStatus == GameStatus.Finish) 
                return;
            
            var request = new UpdateRequest();
            request.TicketId = this.currentTicketId;
            request.NeedToStop = needToStop;
            
            var updateResponse = await gameService.UpdateGame(request);
            OnUpdate(updateResponse);
        }
        
        private void OnStart(StartResponse startModel)
        {
            needToStop = false;
            currentTicketId = startModel.TicketId;
            GameInfo = startModel.GameInfo;
            UserInfo = startModel.UserInfo;
            
            StartAnimation();
        }

        private void OnUpdate(UpdateResponse updateResponse)
        {
            GameInfo = updateResponse.GameInfo;
            if (updateResponse.GameInfo.GameStatus == GameStatus.Update)
            {
                UserInfo = updateResponse.UserInfo;
            }else if(updateResponse.GameInfo.GameStatus == GameStatus.Finish)
            {
                needToStop = false;
                currentTicketId = string.Empty;
                
                OnFinish(updateResponse);
            }
        }
        
        private void OnFinish(UpdateResponse finishModel)
        {
            UserInfo = finishModel.UserInfo;
            StopAnimation(finishModel.IsWin);
        }

        private async void StartRequest()
        {
            if(string.IsNullOrEmpty(this.token))
                return;
            
            var request = new StartRequest();
            request.BetAmount = 1;
            
            
            /*var callOptions = new CallOptions().WithHeaders(new Metadata()
            {
                { "Authorization", "Bearer " + AuthenticationTokenStorage.Token }
            });
            
            var service = MagicOnionClient.Create<IGameService>(channel).WithOptions(callOptions);*/
            var startResponse = await gameService.StartGame(request);
            OnStart(startResponse);
        }

        private void StopRequest()
        {
            needToStop = true;
        }

        private void StopAnimation(bool isWin)
        {
            soundManager.StopPumpSound();
            
            foreach (var balloon in balloons)
            {
                balloon.StopAnimation();
            }
            
            shadow.gameObject.SetActive(false);
            background.timeScale = 0f;
            buttonPipe.timeScale = 0f;
            
            soundManager.PlaySound(isWin ? SoundType.Win : SoundType.Lose);
            
            if (isWin)
            {
                winParticles.AnimationState.SetAnimation(0,"win", false);
                winParticles.timeScale = 1f;
            }
            else
            {
                foreach (var explosion in explosions)
                {
                    explosion.Play();
                }
            }
        }

        private void StartAnimation()
        {
            soundManager.PlayPumpSound();
            
            foreach (var balloon in balloons)
            {
                balloon.StartAnimation();
            }
            
            shadow.AnimationState.SetAnimation(0, "gaberva1", false);
            shadow.timeScale = 1f;
            shadow.gameObject.SetActive(true);
            background.AnimationState.SetAnimation(0, "gaberva1", false);
            background.timeScale = 1f;
            buttonPipe.timeScale = 1f;
        }
    }
}