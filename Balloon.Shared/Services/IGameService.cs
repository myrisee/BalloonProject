using Balloon.Shared.MessagePacks;
using MagicOnion;

namespace Balloon.Shared.Services
{
    public interface IGameService : IService<IGameService>
    {
        UnaryResult<StartResponse> StartGame(StartRequest request);
        UnaryResult<UpdateResponse> UpdateGame(UpdateRequest request);
    }
}