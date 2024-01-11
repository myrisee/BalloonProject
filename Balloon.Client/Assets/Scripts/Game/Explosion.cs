using System.Collections;
using System.Collections.Generic;
using Spine.Unity;
using UnityEngine;

public class Explosion : MonoBehaviour
{
    private SkeletonAnimation _skeletonAnimation;

    private void Awake()
    {
        _skeletonAnimation = GetComponent<SkeletonAnimation>();
        this.gameObject.SetActive(false);
    }
    
    public void Play()
    {
        _skeletonAnimation.AnimationState.SetAnimation(0,"fetq1",false);
        _skeletonAnimation.timeScale = 1f;
        this.gameObject.SetActive(true);
    }

    public void Stop()
    {
        this.gameObject.SetActive(false);
    }
}
