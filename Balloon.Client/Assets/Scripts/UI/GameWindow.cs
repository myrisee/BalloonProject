using System;
using System.Collections;
using System.Collections.Generic;
using System.Globalization;
using Balloon.Shared.DataModels;
using Balloon.Shared.MessagePacks;
using Balloon.Shared.Services;
using Game;
using Reflex.Scripts.Attributes;
using Services;
using Services.Interfaces;
using TMPro;
using UnityEngine;

public class GameWindow : MonoBehaviour
{
    public delegate void PlayButtonUp();
    public delegate void PlayButtonDown();
    
    public static event PlayButtonUp OnPlayButtonUpEvent;
    public static event PlayButtonDown OnPlayButtonDownEvent;
    
    public TextMeshProUGUI txtBalance;
    public TextMeshPro txtCurrentWin;
    public TextMeshProUGUI txtBet;
    
    public RectTransform loginPanel;
    
    [Inject] private GameManager gameManager;

    private void Awake()
    {
        //userService.OnLogin += OnLogin;
        
        //gameService.OnStart += OnStart;
        //gameService.OnUpdate += OnUpdate;
        //gameService.OnFinish += OnFinish;
    }

    private void Start()
    {
        GameManager.OnUserInfoUpdated += OnUserInfoUpdated;
        GameManager.OnGameInfoUpdated += OnGameInfoUpdated;
    }

    private void OnGameInfoUpdated(GameInfo gameInfo)
    {
        txtCurrentWin.text = $"{gameInfo.CurrentWin:C2}";
        
        txtCurrentWin.gameObject.SetActive(gameInfo.GameStatus == GameStatus.Update);
    }

    private void OnUserInfoUpdated(UserInfo userInfo)
    {
        UpdateBalanceText(userInfo.Balance);
    }

    private void OnFinish(UpdateResponse finishModel)
    {
        UpdateBalanceText(finishModel.UserInfo.Balance);
        txtCurrentWin.text = string.Empty;
        txtCurrentWin.gameObject.SetActive(false);
    }

    private void OnUpdate(GameInfo info)
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
