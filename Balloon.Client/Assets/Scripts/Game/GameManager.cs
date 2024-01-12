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
using Spine.Unity;
using UI;
using UnityEngine;
using Channel = Grpc.Core.Channel;

namespace Game
{
    public class GameManager : MonoBehaviour
    {
        public static Action<UserViewModel> OnUserInfoUpdated;
        public static Action<GameViewModel> OnGameInfoUpdated;
        
        [Header("References")]
        public List<Balloon> balloons;
        public List<Explosion> explosions;
        public SkeletonAnimation winParticles;
        public SkeletonAnimation shadow;
        public SkeletonAnimation background;
        public SkeletonGraphic buttonPipe;
        
        [Header("Credentials")]
        [SerializeField] private string username;
        [SerializeField] private string password;

        [Header("Controls")]
        [SerializeField] private bool needToStop;

        public UserViewModel UserInfo
        {
            get => userInfo;
            set
            {
                userInfo = value;
                OnUserInfoUpdated?.Invoke(userInfo);
            }
        }

        public GameViewModel GameInfo
        {
            get => gameInfo;
            set
            {
                gameInfo = value;

                if (gameInfo != null)
                    OnGameInfoUpdated?.Invoke(gameInfo);
            }
        }
        
        [Inject] private SoundManager soundManager;
        
        private UserViewModel userInfo;
        private GameViewModel gameInfo;
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
            
            var authFilter = new WithAuthenticationFilter(username, password, channel);
            
            accountService = MagicOnionClient.Create<IAccountService>(channel,new[] { authFilter});
            
            var userInfo = await accountService.GetCurrentUser();
            UserInfo = userInfo;
        }

        private void OnAuthenticationTokenUpdated()
        {
            var callOptions = new CallOptions().WithHeaders(new Metadata()
            {
                { "Authorization", "Bearer " + AuthenticationTokenStorage.Token }
            });
            
            gameService = MagicOnionClient.Create<IGameService>(channel).WithOptions(callOptions);
        }

        private async void FixedUpdate()
        {
            if(GameInfo == null || GameInfo.GameState == GameState.Finish) 
                return;
            
            var request = new UpdateRequest();
            request.TicketId = GameInfo.TicketId;
            request.NeedToStop = needToStop;
            
            var updateResponse = await gameService.UpdateGame(request);
            OnUpdate(updateResponse);
        }
        
        private void OnStart(StartResponse startModel)
        {
            needToStop = false;
            GameInfo = startModel.GameViewModel;
            UserInfo = startModel.UserViewModel;
            
            StartAnimation();
        }

        private void OnUpdate(UpdateResponse updateResponse)
        {
            GameInfo = updateResponse.Game;
            if (updateResponse.Game.GameState == GameState.Update)
            {
                UserInfo = updateResponse.User;
            }else if(updateResponse.Game.GameState == GameState.Finish)
            {
                needToStop = false;
                
                OnFinish(updateResponse);
            }
        }
        
        private void OnFinish(UpdateResponse finishModel)
        {
            UserInfo = finishModel.User;
            StopAnimation(finishModel.IsWin);
        }

        private async void StartRequest()
        {
            var request = new StartRequest();
            request.BetAmount = 1;
            
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