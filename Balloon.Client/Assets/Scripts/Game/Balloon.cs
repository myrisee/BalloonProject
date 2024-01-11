using System;
using Spine.Unity;
using UnityEngine;

namespace Game
{
    public class Balloon : MonoBehaviour
    {
        private Renderer _renderer;
        private SkeletonAnimation _skeletonAnimation;

        private void Awake()
        {
            _renderer = GetComponent<Renderer>();
            _skeletonAnimation = GetComponent<SkeletonAnimation>();
        }

        public void Start()
        {
            
        }

        public void StartAnimation()
        {
            _skeletonAnimation.AnimationState.SetAnimation(0, "gaberva1", false);
            _skeletonAnimation.timeScale = 1f;
            this.gameObject.SetActive(true);
        }

        public void StopAnimation()
        {
            _skeletonAnimation.AnimationState.SetAnimation(0, "gaberva1", false);
            _skeletonAnimation.timeScale = 0f;
            SetAlpha(1f);
            this.gameObject.SetActive(false);
        }

        public void SetColor(Color color)
        {
            _renderer.material.color = color;
        }

        public void SetAlpha(float alpha)
        {
            var color = _renderer.material.color;
            color.a = alpha;
            _renderer.material.color = color;
        }
    }
}