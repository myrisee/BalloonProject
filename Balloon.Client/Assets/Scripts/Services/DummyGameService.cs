using System;
using System.Collections.Generic;
using System.Threading;
using Balloon.Shared.DataModels;
using Balloon.Shared.MessagePacks;
using Balloon.Shared.Services;
using Cysharp.Threading.Tasks;
using Grpc.Core;
using MagicOnion;
using Reflex.Scripts.Attributes;
using Services.Interfaces;
using UnityEngine;
using Random = UnityEngine.Random;

namespace Services
{
    public class DummyGameService : MonoBehaviour,IGameService
    {
        public AnimationCurve incrementCurve;
        public AnimationCurve randomChanceCurve;

        public Action<StartResponse> OnStart { get; set; }
        public Action<GameInfo> OnUpdate { get; set; }
        public Action<UpdateResponse> OnFinish { get; set; }

        private Dictionary<string,GameInfo> gameInfos = new Dictionary<string, GameInfo>();
        
        private IUserService userService;

        public async UnaryResult<StartResponse> StartGame(StartRequest request)
        {
            var startModel = new StartResponse();

            await UniTask.Delay(1);
            
            //if (userService.SessionIsValid(request.SessionKey) == false)
                //return startModel;

            /*if (userService.GetUserInfo(request.SessionKey, out var userInfo) && userInfo.Balance >= request.BetAmount)
            {
                userInfo.Balance -= request.BetAmount;
                startModel = new StartResponse();
                var guid = System.Guid.NewGuid();
                var id = guid.ToString();
                var gameInfo = new GameInfo(userInfo.UserId,request.BetAmount);
            
                if (gameInfos.TryGetValue(id, out var info))
                    info = gameInfo;
                else
                    gameInfos.Add(id,gameInfo);

                startModel.TicketId = id;
                startModel.GameInfo = gameInfo;
                startModel.UserInfo = userInfo;
            
                await UniTask.Delay(Random.Range(50,150));
                OnStart?.Invoke(startModel);
            }*/

            return startModel;
        }
        
        public async UnaryResult<UpdateResponse> UpdateGame(UpdateRequest request)
        {
            var updateResponse = new UpdateResponse();
            
            /*if (gameInfos.TryGetValue(request.TicketId, out var gameInfo) && userService.GetUserInfo(request.SessionKey, out var userInfo) && gameInfo.UserId == userInfo.UserId)
            {
                var randomChance = randomChanceCurve.Evaluate(System.Convert.ToSingle(gameInfo.GameTime)) * 100;

                var randomAmount = Random.Range(0f, 100f);
                
                var currentWin = incrementCurve.Evaluate(System.Convert.ToSingle(gameInfo.GameTime));
                
                gameInfo.CurrentWin = currentWin;

                gameInfo.GameStatus = request.NeedToStop ? GameStatus.Finish : (randomAmount < randomChance ? GameStatus.Update : GameStatus.Finish);
                
                Debug.Log($"r{randomAmount} : c{randomChance}");

                if (gameInfo.GameStatus == GameStatus.Finish)
                {
                    gameInfo.GameStatus = GameStatus.Finish;
                    updateResponse.TicketId = request.TicketId;
                    updateResponse.GameInfo = gameInfo;
                    updateResponse.IsWin = request.NeedToStop && randomAmount < randomChance;
                    
                    if(updateResponse.IsWin)
                        userInfo.Balance += gameInfo.CurrentWin;
                    
                    updateResponse.UserInfo = userInfo;
                }
                else
                {
                    OnUpdate?.Invoke(gameInfo);
                }
            }*/

            return updateResponse;
        }

        public IGameService WithOptions(CallOptions option)
        {
            throw new NotImplementedException();
        }

        public IGameService WithHeaders(Metadata headers)
        {
            throw new NotImplementedException();
        }

        public IGameService WithDeadline(DateTime deadline)
        {
            throw new NotImplementedException();
        }

        public IGameService WithCancellationToken(CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }

        public IGameService WithHost(string host)
        {
            throw new NotImplementedException();
        }
    }
}