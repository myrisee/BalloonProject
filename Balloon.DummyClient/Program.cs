﻿// See https://aka.ms/new-console-template for more information

using Balloon.Shared;
using Balloon.Shared.MessagePacks;
using Balloon.Shared.Services;
using Grpc.Net.Client;
using MagicOnion.Client;

var channel = GrpcChannel.ForAddress("http://localhost:5000");

// NOTE: If your project targets non-.NET Standard 2.1, use `Grpc.Core.Channel` class instead.
// var channel = new Channel("localhost", 5001, new SslCredentials());

// Create a proxy to call the server transparently.
var client = MagicOnionClient.Create<IMyFirstService>(channel);

// Call the server-side method using the proxy.
var result = await client.SumAsync(5, 3);
Console.WriteLine($"Result: {result}");

var accountService = MagicOnionClient.Create<IAccountService>(channel);
var loginResult = await accountService.LoginAsync("test", "444");
Console.WriteLine($"SessionKey: {loginResult.Token} UserInfo: {loginResult.UserId}");

var gameService = MagicOnionClient.Create<IGameService>(channel);

var startRequest = new StartRequest();
//startRequest.SessionKey = loginResult.Token;
startRequest.BetAmount = 1;
var startResult = await gameService.StartGame(startRequest);

Console.WriteLine($"TicketId: {startResult.TicketId} GameInfo: {startResult.GameInfo.UserId}");

var updateRequest = new UpdateRequest();
//updateRequest.SessionKey = loginResult.Token;
updateRequest.TicketId = startResult.TicketId;
updateRequest.NeedToStop = false;

for (int i = 0; i < 3; i++)
{
    var updateResult = await gameService.UpdateGame(updateRequest);
    
    Console.WriteLine($"{updateResult.GameInfo}");
}