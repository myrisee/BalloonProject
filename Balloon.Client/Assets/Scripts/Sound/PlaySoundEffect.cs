using Game;
using Reflex.Scripts.Attributes;
using UnityEngine;

namespace Sound
{
    public class PlaySoundEffect : MonoBehaviour
    {
        public SoundType soundType;

        [Inject]
        private SoundManager soundManager;

        public void PlaySfx()
        {
            soundManager.PlaySound(soundType);
        }
    }
}