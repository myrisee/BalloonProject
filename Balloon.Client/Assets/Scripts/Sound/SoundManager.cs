using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class SoundManager : MonoBehaviour
{
    public AudioSource pumpingSfx;
    public AudioSource genericSfx;

    public List<AudioClip> genericSounds;

    public void PlayPumpSound()
    {
        pumpingSfx.Play();
    }
    
    public void StopPumpSound()
    {
        pumpingSfx.Stop();
    }

    public void PlaySound(SoundType soundType)
    {
        genericSfx.PlayOneShot(genericSounds[(int)soundType]);
    }
}

public enum SoundType
{
    Click,
    Win,
    Lose
}
