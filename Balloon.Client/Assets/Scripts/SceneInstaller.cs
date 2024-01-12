using System.Collections;
using System.Collections.Generic;
using Game;
using Reflex;
using Reflex.Scripts;
using Services;
using UnityEngine;
using UnityEngine.Serialization;

public class SceneInstaller : Installer
{
    public GameManager gameManager;
    public SoundManager soundManager;
    
    public override void InstallBindings(Container container)
    {
        container.BindInstanceAs(gameManager, typeof(GameManager));
        container.BindInstanceAs(soundManager,typeof(SoundManager));
    }
}
