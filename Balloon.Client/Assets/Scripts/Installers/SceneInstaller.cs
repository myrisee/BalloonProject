using Game;
using Reflex;
using Reflex.Scripts;

namespace Installers
{
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
}
