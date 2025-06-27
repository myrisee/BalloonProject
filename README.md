# About
This project aims to replicate gameplay of [Casino Balloon game](https://www.smartsoftgaming.com/games/balloon) with simple backend and unity client.

- Balloon.Server
    - Asp.Net Core
    - [MagicOnion](https://github.com/Cysharp/MagicOnion)
    - [MessagePack for C#](https://github.com/neuecc/MessagePack-CSharp)
    - EntityFramework
    - Authorization with JWT

- Balloon.Client
    - Unity 2020.3.48f1
    - Reflex Dependency Injection
    - UniTask
    - MagicOnion For Unity with some additional dependencies

- Balloon.Shared project is used as protocol for messaging between server and client, therefore project contains package.json file and build configuration to hide output folders for Unity Editor.

Its compatible with Rider 2023.2.1

![Screenshot_1](https://github.com/myrisee/BalloonProject/assets/9747463/1f6edef2-b2cd-4019-991e-3b236a8ff3cc)
