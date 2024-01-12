using System.Globalization;
using Balloon.Shared.DataModels;
using Balloon.Shared.MessagePacks;
using Game;
using Reflex.Scripts.Attributes;
using TMPro;
using UnityEngine;

namespace UI
{
    public class GameWindow : MonoBehaviour
    {
        public delegate void PlayButtonUp();
        public delegate void PlayButtonDown();
        public static event PlayButtonUp OnPlayButtonUpEvent;
        public static event PlayButtonDown OnPlayButtonDownEvent;
        
    
        public TextMeshProUGUI txtBalance;
        public TextMeshPro txtCurrentWin;
    
        public RectTransform loginPanel;
    
        [Inject] private GameManager gameManager;

        private void Start()
        {
            GameManager.OnUserInfoUpdated += OnUserInfoUpdated;
            GameManager.OnGameInfoUpdated += OnGameInfoUpdated;
        }

        private void OnGameInfoUpdated(GameViewModel gameInfo)
        {
            txtCurrentWin.text = $"{gameInfo.CurrentWin:C2}";
            
            txtCurrentWin.gameObject.SetActive(gameInfo.GameState == GameState.Update);
        }

        private void OnUserInfoUpdated(UserViewModel userInfo)
        {
            UpdateBalanceText(userInfo.Balance);
        }

        private void OnFinish(UpdateResponse finishModel)
        {
            UpdateBalanceText(finishModel.User.Balance);
            txtCurrentWin.text = string.Empty;
            txtCurrentWin.gameObject.SetActive(false);
        }

        private void OnUpdate(GameViewModel info)
        {
            txtCurrentWin.text = $"{info.CurrentWin:C2}";
        }
    
        private void UpdateBalanceText(double balance)
        {
            var balanceString = string.Format(new CultureInfo("en-US"), "{0:C2}", balance);
            //<size=12>DMO
            txtBalance.text = $"Balance <color=#FFED77><font=\"DUNKIN SANS SDF\"> {balanceString}</font>";
        }

        public void OnPlayButtonDown()
        {
            OnPlayButtonDownEvent?.Invoke();
        }

        public void OnPlayButtonUp()
        {
            OnPlayButtonUpEvent?.Invoke();
        }
    }
}
