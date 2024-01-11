﻿using Balloon.Shared;
using MagicOnion;
using MagicOnion.Server;

namespace Balloon.Server.Services;

public class MyFirstService : ServiceBase<IMyFirstService>, IMyFirstService
{
    // `UnaryResult<T>` allows the method to be treated as `async` method.
    public async UnaryResult<int> SumAsync(int x, int y)
    {
        Console.WriteLine($"Received:{x}, {y}");
        return x + y;
    }

    public async UnaryResult DoWorkAsync()
    {
        // Something to do ...
    }
}