using MagicOnion;

namespace Balloon.Shared
{
    public interface IMyFirstService : IService<IMyFirstService>
    {
        // The return type must be `UnaryResult<T>` or `UnaryResult`.
        UnaryResult<int> SumAsync(int x, int y);
        // `UnaryResult` does not have a return value like `Task`, `ValueTask`, or `void`.
        UnaryResult DoWorkAsync();
    }
}