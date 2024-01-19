# About
This project aims to replicate gameplay of Casino Balloon game with simple backend and unity client.

- Balloon.Server
    - Asp.Net Core
    - [MagicOnion](https://github.com/Cysharp/MagicOnion)
    - [MessagePack for C#](https://github.com/neuecc/MessagePack-CSharp)
    - EntityFramework

- Balloon.Client
    - Unity 2020.3.48f1

- Balloon.Shared project is used as protocol for messaging between server and client, therefore project contains package.json file and build configuration to hide output folders for Unity Editor.

Its compatible with Rider 2023.2.1
