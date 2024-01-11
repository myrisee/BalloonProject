using System.Collections;
using System.Collections.Generic;
using Game;
using Reflex;
using Reflex.Scripts;
using Services;
using Services.Interfaces;
using UnityEngine;
using UnityEngine.Serialization;

public class SceneInstaller : Installer
{
    public DummyUserService dummyUserService;
    public DummyGameService dummyGameService;
    public GameManager gameManager;
    public SoundManager soundManager;
    
    public override void InstallBindings(Container container)
    {
        
        //container.BindInstanceAs(dummyGameService,typeof(IGameService));
        //container.BindInstanceAs(dummyUserService,typeof(IUserService));
        container.BindInstanceAs(gameManager, typeof(GameManager));
        container.BindInstanceAs(soundManager,typeof(SoundManager));
    }
}
