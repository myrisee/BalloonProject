const gameInfo = {
    url: {
        sound: '../../Content/Balloon/Sound/',
        image: '../../Content/Balloon/Images/',
        spine: '../../Content/Balloon/Images/Spine/',
        sprite: '../../Content/Balloon/Images/Sprite/'
    },
    resourceLoaded: false,
    vertical: {
        allow: true,
        width: 756,
        maxWidth: 756 + 80,
        minWidth: 756,
        height: 1344,
        maxHeight: 1750,
    },
    allowHeader: true
}

function UpdateGameSound(GameSound) {
    console.log('GameSound: ', GameSound);
}
let precashout = false;
let showRealityCheckPopup = false;

$(window).on('load', function (e) {
    if(mobileDevice) {
        ScaleDiv();
    }
});

$(window).on('resize', function (e) {
    if(mobileDevice) {
        ScaleDiv();
        scaleHorizontalCanvas();
    }
})

function InitializeAdditionalUrls(baseUrl, connrollerName, externalUrl) {
    urlHolder.additional = {
        LuckyDoubleLastCombination: {
            Url: baseUrl + "/api/" + connrollerName + "/DragRaceLastCombination/3"
        }
    };
}

function InitGameSounds() {
    sounds = [
        { id: "GrrowBollSound", src: "Bushtis gaberva.mp3", loaded: false },
        { id: "DetonateBallSound", src: "Bushtis gaxetqva.mp3", loaded: false },
        { id: "ClickSound", src: "Ghilakze dacheris xma.mp3", loaded: false },
        { id: "StartGame", src: "Ghilakze dacheris xma.mp3", loaded: false },
        { id: "WinSound", src: "Mogebis Xma.mp3", loaded: false }
    ];


    let assetsPath = '../../Content/Balloon/Sound/';
    if (StaticContentUrl !== "") {
        assetsPath = StaticContentUrl + '../Sound/';
    }

    return assetsPath;
}


function staticUrl(url) {
    if (staticContentUrl !== '') {
        url = staticContentUrl.replace('/Sound', '') + url.replace('../../Content/Balloon/Images/', '');
    } else if (mobileDevice) {
        url = staticContentUrl.replace('/Sound', '') + url.replace('../../Content/Balloon/Images/', '../../../Content/');
    }
    if (mobileDevice) {
        url = url.replace(`/Images/${gameInfo.name}/`, `/Images/${gameInfo.name}/`);
    }
    return url;
}

function RequestFail(jqXHR, textStatus, errorThrown) {
    let errorObj = {
        Message : jqXHR.responseJSON.Message,
        Status :  jqXHR.status
    };
    gameEvent.errorMessage(errorObj);
    if (jqXHR.status == 401) {
        if (jqXHR.responseText == undefined || jqXHR.responseText == null || jqXHR.responseText == '') {
            // location.reload();
            requestTimeoutPopup();
        } else {
            responseText = JSON.parse(jqXHR.responseText);
            var Message = GetCaption(responseText.Message);
            $('.game-error-popup').css('display', 'block');
            $('.game-error-popup-text').html(Message);
            $('.game-error-popup-button').hide();
            if (gamesLobby) {
                $('.game-error-popup-close').attr('onclick', 'parent.location.href = \'' + urlHolder.GameExit.Url + '\';');
            } else {
                $('.game-error-popup-close').attr('onclick', 'top.location.href = \'' + urlHolder.GameExit.Url + '\';');
            }
            gameEvent.quit();
        }
    } else if (jqXHR.status == 400) {
        responseText = JSON.parse(jqXHR.responseText);
        var Message = GetCaption(responseText.Message);
        if(!$('#balanceError').hasClass('active')) {
            $('#balanceError').addClass('active');
        }
        setTimeout(function() {
            $('#balanceError').removeClass('active');
        }, 2000);
    } else if (jqXHR.status == 410) {
        responseText = JSON.parse(jqXHR.responseText);
        var Message = GetCaption(responseText.Message);

        $('.game-error-popup').css('display', 'block');
        $('.game-error-popup-text').html(Message);
        $('.game-error-popup-button').hide();
        if (gamesLobby) {
            $('.game-error-popup-close').attr('onclick', 'parent.location.href = \'' + urlHolder.GameExit.Url + '\';');
        } else {
            $('.game-error-popup-close').attr('onclick', 'top.location.href = \'' + urlHolder.GameExit.Url + '\';');
        }
        gameEvent.quit();
    } else {
        $('.game-error-popup').css('display', 'block');
        $('.game-error-popup-text').html(GetCaption('Balloon.board.connection.is.lost'));
        $('.game-error-popup-button').hide();
        //$('.popup-bt').css('display', 'none');
        if (gamesLobby) {
            $('.game-error-popup-close').attr('onclick', 'parent.location.href = \'' + urlHolder.GameExit.Url + '\';');
        } else {
            $('.game-error-popup-close').attr('onclick', 'top.location.href = \'' + urlHolder.GameExit.Url + '\';');
        }
        gameEvent.quit();
    }
}

function SendPing() {
    if ($('#GameId').val() != '') {
        eventUrl = urlHolder.Ping.Url + "/" + $('#GameId').val() + "/" + $("#Token").val();
        $.post(eventUrl, function (data) {
            CallPingTimer();
            if(!gameClass.gameIsSarted && showRealityCheckPopup) {
                window.parent.postMessage({ key: "draw.reality.check.popup" }, "*");
            }
        }).fail(function (jqXHR, textStatus, errorThrown) {
            RequestFail(jqXHR, textStatus, errorThrown)
        });
    }
}

function requestTimeoutPopup() {
    gameEvent.quit();
    let message = GetCaption('balloon.popop.time.out');
    $('.game-error-popup').css('display', 'block');
    $('.game-error-popup-text').text(message);
    $('.game-error-popup-close').attr('onclick', 'parent.location.href = \'' + urlHolder.GameExit.Url + '\';');
    $('.game-error-popup-button').html(GetCaption('balloon.popop.new.game')).attr('onclick', 'location.reload()');
}

function LoadGameData(data, event) {
    gameClass.loadData(data, event);
}

class Balloon {
    constructor() {
        this.fractionDigit = 2;
        this.currency = 2;
        this.winAmountStar = 0;
        this.board = null;
        this.player = null;
        this.eventId = null;
        this.eventTypeCode = null;
        
        this.bets = document.getElementById('betValues').value.split('|');
        this.gameIsSarted = false;
        this.selectedBet = null;
        this.selectedBetIndex = null;
        this.firstLoad = false;
        this.firstLoadEvent = false;
        this.winAnimationIsGoing = false;
        this.availableAmountOld = 0;
        this.isFinishedRound = false;
    }
    
    loadData(data, eventCode = "") {
        
        if (data !== undefined && data !== null && data.PlayerEvent !== null) {
            this.board = data.PlayerEvent.Board;
            this.player = this.board.Player;
            this.eventId = data.PlayerEvent.EventId;
            this.currencyCode = this.player.Currency.CurrencyCode;
            this.fractionDigit = this.player.Currency.FractionDigit;
            this.eventTypeCode = data.PlayerEvent.EventType.Code
            this.selectedBet = this.player.SelectedChip;
            if (!this.firstLoad) {
                this.selectedBetIndex = this.bets.indexOf(this.selectedBet.toFixed(this.fractionDigit));
                this.availableAmountOld = this.player.AvailableAmount;
                this.drawBets();
                slider.updateSlider();
            }
            this.drawUpdatedBoard(this.player);
        } else {
            requestTimeoutPopup();
        }
        
        if (this.eventTypeCode === "balloon.playing" && !this.firstLoadEvent) {
            info(true);
            this.firstLoadEvent = true;
            setTimeout(function() { GetCurrentEvents(); }, 100);
            return;
        }

        if (this.eventTypeCode == "balloon.playing") {
            if (precashout) {
                info(true);
                $('.gameButton').removeClass('active');
                PostEvent(this.eventId);
                hub.server.toggle(true);
            } else {
                info();
                balloonAnimations.startBalloonsAnimation();
                this.gameIsSarted = true;
                $('.gameButton').addClass('active');
                PlaySound(4, 'StartGame', 0);
                gameEvent.roundStarted();
                this.isFinishedRound = false;
            }
            $('#UserAmountValue').html(this.player.AvailableAmount.toFixed(this.fractionDigit));
        } else if (this.eventTypeCode == "balloon.start.game") {
            info(true);
            this.gameIsSarted = false;
            WinAmountPopUp(this.bets[this.selectedBetIndex]);
            if(audioElement[0]) {
                audioElement[0].stop();
                audioElement[0] = null;
            } 
            
            if(!gameClass.winAnimationIsGoing)
                $('#UserAmountValue').html(this.player.AvailableAmount.toFixed(this.fractionDigit));
        } else if (this.eventTypeCode == "game.end") {
            if(balloonAnimations.drawBalloonsAnimation) {
                balloonAnimations.destroyGameAnimations();
                balloonAnimations.initObjects();
            }
            if(this.board.WinAmount > 0) {
                if (this.board.WinAmount - this.player.SelectedChip >= this.player.SelectedChip * 2) {
                    this.winAmountStar = 3;
                } else if (this.board.WinAmount - this.player.SelectedChip >= this.player.SelectedChip) {
                    this.winAmountStar = 2;
                } else if (this.board.WinAmount - this.player.SelectedChip >= this.player.SelectedChip / 2) {
                    this.winAmountStar = 1;
                } else {
                    this.winAmountStar = 0;
                }
                
                if (this.board.MyHighScore) {
                    if (this.board.WinAmount >= this.board.MyHighScore) {
                        this.winAmountStar = 3;
                    }
                } 
                $('.start').removeClass('active');
                for(let i = 0; i < this.winAmountStar; i++) {
                    let star = $('.start')[i];
                    $(star).addClass('active');
                }
            }    
            PostEvent(this.eventId);
            gameEvent.roundEnded();
        }
        if (this.availableAmountOld !== this.player.AvailableAmount) {
            gameEvent.balance();
        }
        this.availableAmountOld = this.player.AvailableAmount;
    }

    startGame(value) {
        WinAmountPopUp(value.w, true);
    }

    clearGame() {
        NumWidth = mobileDevice ? 51 : 60;
        NumFontSize = mobileDevice ? 51 : 60;;
        WinAmountPopUp(this.bets[this.selectedBetIndex]);
        $('.WinNumber').attr('style', '');
        $('.WinNumberGEL').attr('style', '');
        $('.WinNumber').hide();
        $('.WinNumberGEL').hide();
        $('.gameButton').addClass('disabled');
    }

    initGame() {
        $('.WinNumber').show(); 
        $('.WinNumberGEL').show();
        WinAmountPopUp(this.bets[this.selectedBetIndex]);
        $('.gameButton').removeClass('disabled active pointerNone');
        if(mobileDevice) {
            $('.WinNumber').css('margin-top', gameInfo.paddingBottom / 3);
            $('.WinNumberGEL').css('margin-top', gameInfo.paddingBottom / 3);
        }
    }

    drawWon(data) {
        if(!gameInfo.resourceLoaded) return;

        this.clearGame();
        PlaySound(2, 'WinSound', 0);
        $('.gameButton').addClass('disabled');
        balloonAnimations.drawWinAnimations();
        $('.winPopup').addClass('active');
        $('.winPopupAmount').html(data.WinAmount.toFixed(this.fractionDigit) + '<span>' + data.CurrencyCode + '</span>');
    }

    drawLoseGame() {
        this.clearGame();
        gameClass.isFinishedRound = true;
        $('.gameButton').addClass('pointerNone');
        balloonAnimations.detonateBalloon();
        PlaySound(1, 'DetonateBallSound', 0);
    }

    drawUpdatedBoard(player) {
        $('.WinNumberGEL').text(this.currencyCode);
        $('#UserAmountGel').html(this.currencyCode);
        if(!this.firstLoad) {
            this.firstLoad = true;
            $('#UserAmountValue').html(this.player.AvailableAmount.toFixed(this.fractionDigit)); 
        }
    }

    drawBets() {
        const container = document.querySelector('.betsContainer');
        let html = '';
        for(let index = 0; index < this.bets.length; index++) {
            html += `
                <div class="bet bet-${index}" data-index=${index}>
                    <div class="betAmount" data-currency="GEL">${this.bets[index]}</div>   
                    <span>${this.currencyCode}</span>
                </div> 
            `
            if(index < 6) $(`.HL_BET_${index + 1} > .Value`).text(this.bets[index]);
            $('.AmountGel').text(this.currencyCode);
        }
        $(container).html(html);
    }
}

const gameClass = new Balloon();

let NumWidth = mobileDevice ? 51 : 60;
let NumFontSize = mobileDevice ? 51 : 60;

const WinAmountPopUp = (WinAmountNumber, startMoving) => {
    if(!WinAmountNumber) return;
    let number = Array.from(WinAmountNumber);
    let html = '';
    $(".WinNumber").html('<div class="NumCenter"></div>');
    number.forEach(element => {
        html += '<div class="Num" ' + (element == '.' ? 'style="width:10px; font-size:' + NumFontSize + 'px;"' : 'style="font-size:' + NumFontSize + 'px; width:' + NumWidth + 'px; height:' + NumWidth +'px "') + '>' + element + '</div>';
    });
    $(".NumCenter").html(html);
    if(startMoving) UpCoefficientWinNumber();
}

function UpCoefficientWinNumber() {
    let WinNumberTop = parseInt($('.WinNumber').css('top'));
    let WinNumberGELTop = parseFloat($('.WinNumberGEL').css('top'));
    let CoefficientTop = parseFloat($('.Coefficient').css('top'));
    let CurancyFontsiZe = parseFloat($('.WinNumberGEL').css('font-size'));
    let maxTop = mobileDevice ? 300 + gameInfo.paddingBottom / 3 : 100;
    if (WinNumberTop > maxTop) {
        WinNumberTop = WinNumberTop - 3;
        WinNumberGELTop = WinNumberGELTop - 2.7;
        CoefficientTop = CoefficientTop - 0.6;
        NumFontSize = NumFontSize + 0.5;
        NumWidth = NumWidth + 0.5;
        CurancyFontsiZe = CurancyFontsiZe + 0.3;
        $('.WinNumber').css('top', WinNumberTop);//279px;
        $('.WinNumberGEL').css('top', WinNumberGELTop);//195px
        $('.WinNumberGEL').css('font-size', CurancyFontsiZe);
        $('.Coefficient').css('top', CoefficientTop);//290px;
    } else if (NumFontSize < 100) {
        NumFontSize = NumFontSize + 0.5;
        NumWidth = NumWidth + 0.5;
        CurancyFontsiZe = CurancyFontsiZe + 0.5;
        $('.WinNumberGEL').css('font-size', CurancyFontsiZe);
        WinNumberGELTop = WinNumberGELTop + 0.5
        $('.WinNumberGEL').css('top', WinNumberGELTop);//195px
    }
}

function info(lose = false) {
    setTimeout(function () {
        hub.server.info().then(function (value) {
            if (value != null) {
                if (!lose) {
                    if (gameClass.gameIsSarted) gameClass.startGame(value);
                    if (value.f) { setTimeout(GetCurrentEvents, 0); }

                    if (value.f === true && value.p == false) {
                        gameClass.drawLoseGame();
                    } else if (value.f && value.p) {
                        // console.log('won');
                    }
                    if (value === null || !value.f) {
                        info();
                    }
                } else {
                    if (value.f === true && value.p == false) {
                        gameClass.drawLoseGame();
                        $('#UserAmountValue').html(gameClass.player.AvailableAmount.toFixed(gameClass.fractionDigit));
                    }
                }
            }
        });
    }, 100);
}

window.hub.client.playerWin = (data) => {
    if(gameClass.player.PlayerId === data.PlayerId) gameClass.drawWon(data);
};

let HighClass = ['HSOne', 'HSTwo', 'HSThree', 'HSFour', 'HSFive', 'HSSix', 'HSSeven', 'HSEight', 'HSNine', 'HSTen'];
let MyClass = ['MSOne', 'MSTwo', 'MSThree', 'MSFour', 'MSFive', 'MSSix', 'MSSeven', 'MSEight', 'MSNine', 'MSTen'];

// Events Start
document.querySelector('.slideLeft').addEventListener('click', function () {
    slider.decrement();
    PlaySound(3, 'ClickSound', 0);
})

document.querySelector('.slideRight').addEventListener('click', function () {
    slider.increment();
    PlaySound(3, 'ClickSound', 0);
});
document.querySelector('.gameButton').addEventListener('touchstart', (e) => {
    document.querySelector('.gameButton').dispatchEvent(new Event('mousedown'));
});
document.querySelector('.gameButton').addEventListener('touchend', () => {
    document.querySelector('.gameButton').dispatchEvent(new Event('mouseleave'));
});
document.querySelector('.gameButton').addEventListener('touchcancel', () => {
    document.querySelector('.gameButton').dispatchEvent(new Event('mouseup'));
});
let readyForNewRoud = true;
document.querySelector('.gameButton').addEventListener('mousedown', function (e) {
    e.preventDefault();
    if (mobileDevice || gameClass.winAnimationIsGoing || gameClass.gameIsSarted) return;
    precashout = false;
    if(readyForNewRoud) {
        readyForNewRoud = false;
        PostEvent(gameClass.eventId, 'StartGame', null, gameClass.selectedBetIndex);
    }
})

document.querySelector('.gameButton').addEventListener('mouseleave', function () {
    if (mobileDevice || !gameClass.gameIsSarted) {
        if (!mobileDevice && !gameClass.gameIsSarted) {
            precashout = true;
        }
        return;
    }
    this.classList.remove('active');
    if (!gameClass.isFinishedRound) hub.server.toggle(true);  
})

document.querySelector('.gameButton').addEventListener('mouseup', function () {
    if (mobileDevice || !gameClass.gameIsSarted) {
        if (!mobileDevice && !gameClass.gameIsSarted) {
            precashout = true;
        }
        return;
    }
    this.classList.remove('active');
    // hub.server.toggle(true);
    $.connection.hub.start().done(function () {
        hub.server.toggle(true);
    });
})

function updateHighScoresStatistics() {
    hub.server.getHighScores().then(function (x) {
        if (x.length !== 0) {
            for (i = 0; i < x.length; i++) {
                $('.' + HighClass[i] + ' > .HSListName').text(x[i].DisplayName);
                $('.' + HighClass[i] + ' > .HSListDate').text(x[i].Date);
                $('.' + HighClass[i] + ' > .HSListGel').html(x[i].Bet) //new
                $('.' + HighClass[i] + ' > .HSBetWin > .HSListWin').html(x[i].Win + '<div class="HSCurancy"> ' + gameClass.currencyCode + ' </div>');

                //$('.' + HighClass[i] + ' > .HSBetWin > .HSListWin').html('< div class="Curancy"> GEL </div >');

                $('.' + HighClass[i] + ' > .HSBetWin > .HSListBet > .BetValue').html(x[i].Win + '<div class="BetCurrancy"> ' + gameClass.currencyCode + ' </div>');
                $('.' + HighClass[i] + ' > .HSBetWin > .HSListBet > .BetText').css('visibility', 'hidden');
                $('.' + HighClass[i]).css('visibility', 'visible');
            }
            $('.HighScoresInfo').show();
            $('.MyScoresInfo').hide();
        }
    });
}

function updateMyScoresStatistics() {
    hub.server.getMyScores().then(function (x) {
        if (x.length !== 0) {
            let html = ``
            for (i = 0; i < x.length; i++) {
                // $('.' + MyClass[i] + ' > .MSListGEL').html(x[i].Bet);
                // $(".MSListCurrency").addClass("MSList" + gameClass.currencyCode);
                // $(".Curancy").css('display', 'none')
                // $('.' + MyClass[i] + ' > .MSListDate').text(x[i].Date);
                // $('.' + MyClass[i] + ' > .MSListWin').html(x[i].Win + '<div class="HSCurancy"> ' + gameClass.currencyCode + ' </div>');
                // $('.' + MyClass[i] + ' > .MSListCurrency > .MSCurancy').css('visibility', 'hidden');
                // $('.' + MyClass[i]).css('visibility', 'visible');
                html += `<div class="MSList MSTen">
                            <div class="MSListCurrency">${x[i].Bet}</div>
                            <div class="MSListDate">${x[i].Date}</div>
                            <div class="MSListWin">${x[i].Win + '<div class="HSCurancy"> ' + gameClass.currencyCode + ' </div>'}</div>
                        </div>`;
            };
            $('.my-scores-container').html(html)
            $('.HighScoresInfo').hide();
            $('.MyScoresInfo').show();
        }
    });
}

$(document).ready(function() { 
    $('.game-error-popup').addClass('game-error-popup-hiden');
    staticContentUrl = ($('#StaticContentUrl').length ? $('#StaticContentUrl').val() : "");
    if (staticContentUrl.indexOf("?")) {
        staticContentUrl = staticContentUrl.split("?");
        staticContentUrl = staticContentUrl[0];
    }

    gameInfo.imageUrl = staticUrl(gameInfo.url.image);
    gameInfo.spineUrl = staticUrl(gameInfo.url.spine);
    gameInfo.spriteUrl = staticUrl(gameInfo.url.sprite);


    gameEvent.showLoader();
    balloonAnimations.loadLoader();
    PixiLiader(balloonAnimations.Loader, 15);
    
    balloonAnimations.Loader.onComplete.add(() => {
        gameEvent.gameDataLoaded();
        balloonAnimations.initObjects();
        gameInfo.resourceLoaded = true;
        gameEvent.gameReady();
        gameEvent.hideLoader();
        if(mobileDevice) drawHorizontalCanvas();
    });
    GetCurrentEvents();
    let ios = bowser.ios;
    let clickEvent = ios ? 'touchstart' : 'click';

    $(document).on(clickEvent, ".gameButton",function(e) {
        e.stopPropagation();
        if(gameClass.winAnimationIsGoing) balloonAnimations.resetWinAnimationsWithoutCompleted();
    });

    $(document).on(clickEvent, '.bet', function(e){
        let index = parseFloat($(this).attr('data-index'));
        gameClass.selectedBetIndex = index;
        slider.updateSlider();
        PlaySound(3, 'ClickSound', 0);
    });

    $('.MyScores').on(clickEvent, function () {
        if ($('.MyScoresInfo').css("display") == "none") {
            updateMyScoresStatistics()
            $('.MyScoresInfo').show();
            $('.MyScores').addClass('active')
            $('.HighScores').removeClass('active')
        } else {
            $('.MyScoresInfo').hide();
            $('.MyScores').removeClass('active')
        }
    })

    $('.HSclose').on(clickEvent, function(){
        $('.HighScoresInfo').hide();
        $('.MyScoresInfo').hide();
        $('.HighScores').removeClass('active');
    })

    $('.HighScores').on(clickEvent, function(){
        if ($('.HighScoresInfo').css("display") == "none") {
            updateHighScoresStatistics()
            $('.HighScoresInfo').show();
            $('.HighScores').addClass('active')
            $('.MyScores').removeClass('active')
        } else {
            $('.HighScoresInfo').hide();
            $('.HighScores').removeClass('active')
        }
    })

    $('.MSclose').on(clickEvent, function() {
        $('.MyScoresInfo').hide();
        $('.HighScoresInfo').hide();
        $('.MyScores').removeClass('active');
    })

    let skinName = false;
    if( getParameterByName('Skin') !== ''){
        skinName = getParameterByName('Skin')
    }else if(getParentParameterByName('Skin') !== ''){
        skinName = getParentParameterByName('Skin')
    }else{
        skinName = false;
    }
    
    if(skinName){
        $('body').addClass(skinName)
    }

    NumWidth = mobileDevice ? 51 : 60;
    NumFontSize = mobileDevice ? 51 : 60;
})
// Events End

class Slider extends Balloon {
    constructor() {
        super();
        this.index = 1;
        this.items = [];
        this.marginLeft = 0;
        this.counterWidth5 = 0;
    }

    updateSlider(firstLoad, increment) {
        if(!firstLoad) {
            this.index = gameClass.selectedBetIndex;
        }
        // if(!gameClass.gameIsSarted) WinAmountPopUp(gameClass.bets[this.index]);
        WinAmountPopUp(gameClass.bets[this.index]);
        $('.bet').removeClass('item-md item-lg');
        $('.bet').addClass('item-sm');
        document.querySelector('.bet-' + slider.index).setAttribute("class", `bet bet-${slider.index} item-lg`);
        if(slider.index-1 >= 0)
            document.querySelector('.bet-' + (slider.index-1)).setAttribute("class", `bet bet-${slider.index - 1} item-md`);

        if (slider.index + 1 < this.bets.length) {
            gameEvent.updateBet();
            document.querySelector('.bet-' + (slider.index + 1)).setAttribute("class", `bet bet-${slider.index + 1} item-md`);
        }

        for(let index = 0; index < this.bets.length; index++) {
            if(!firstLoad) {
                if(index < 5) this.counterWidth5 += $(`.bet-${index}`).width();
            }
        }
        
        let itemWidth = $('.bet-' + (slider.index)).width();
        if(firstLoad) {
            if(increment) {
                gameClass.selectedBetIndex++;
                slider.marginLeft = slider.marginLeft - itemWidth;
            }
            else {
                gameClass.selectedBetIndex--;
                slider.marginLeft = slider.marginLeft + itemWidth;
            }
        } else {
            slider.marginLeft = (itemWidth * 2) - gameClass.selectedBetIndex * itemWidth;
        }
            
        this.index = gameClass.selectedBetIndex;

        document.querySelector('.betsContainer').style.marginLeft = slider.marginLeft + 'px';
    }

    increment() {
        if(this.index >= this.bets.length - 1) return;
        this.index++;
        this.updateSlider(true, true);
    }

    decrement() {
        if (this.index === 0) return;
        this.index--;
        this.updateSlider(true, false);
    }
}

const slider = new Slider();

function iOS() {
    return [
      'iPad Simulator',
      'iPhone Simulator',
      'iPod Simulator',
      'iPad',
      'iPhone',
      'iPod'
    ].includes(navigator.platform)
    // iPad on iOS 13 detection
    || (navigator.userAgent.includes("Mac") && "ontouchend" in document)
}

/* New */
GameName = 'Balloon';
var frame = window.frameElement;
$('body').addClass('no-header');
if(frame) {
    var frameId = '';
    try {
        frameId = frame.getAttribute('id');
        if(frameId === 'GameIFrame') {
            $('body').removeClass('no-header');
        }
    } catch (e) {

    }
}

window.addEventListener('beforeunload', function (e) {
    hub.server.toggle(true);
});

window.addEventListener("message", function (event) {
    if (!event.data) return;

    if (event.data.key === 'reality.check.popup.is.ready') {
        showRealityCheckPopup = true;
    } else if (event.data.key === 'reset.reality.check.popup') {
        showRealityCheckPopup = false;
    } else if (event.data.key === 'reality.check.popup.open.game.history') {
        $('.MyScores').trigger(bowser.ios ? 'touchstart' : 'click');
    } else if (event.data.key === 'reality.check.popup.exit.from.game') {
        parent.location.href = urlHolder.GameExit.Url;
    }
}, false)


function PostEvent(eventId, selectedOption, selectedPieces, selectedValue) {
    selectedPieces = selectedPieces !== undefined ? selectedPieces : '';
    selectedValue = selectedValue !== undefined ? selectedValue : '';

    if (selectedOption == 'Cashout') {
        lossepopup = false;
    }

    eventUrl = urlHolder.Events.PostEventUrl + "/" + $("#GameId").val() + "/" + $("#Token").val();
    eventParams = new PostEventInfo(eventId, selectedOption, selectedPieces, selectedValue);
    ajaxReq = $.post(eventUrl, eventParams, function (data) {
        data = RenameObjectKeys(data);
        LoadPostEventData(data, selectedOption);
        readyForNewRoud = true;
    }).fail(function (jqXHR, textStatus, errorThrown) {
        readyForNewRoud = true;
        if (selectedOption != 'game.end') RequestFail(jqXHR, textStatus, errorThrown);
    });
}


/* Gan Message Integration */


function GameEvents() {
    this.onAppFrameReady = function() {
        this.sendMessage('onAppFrameReady');
    };

    this.quit = function() {
        this.sendMessage('quit');
    };

    this.gameReady = function() {
        this.sendMessage('gameReady');
    };


    this.gameDataLoaded = function() {
        this.sendMessage('gameDataLoaded');
    };

    this.roundStarted = function() {
        this.sendMessage('roundStarted');
    };

    this.balance = function() {
        this.sendMessage('balance');
    };

    this.roundEnded = function () {
        if ($('.HighScoresInfo').css("display") !== "none") {
           updateHighScoresStatistics()
        }
        if ($('.MyScoresInfo').css("display") !== "none") {
           updateMyScoresStatistics()
        }
        this.sendMessage('roundEnded');
    };

    this.showLoader = function() {
        this.sendMessage('showLoader');
    };

    this.hideLoader = function() {
        this.sendMessage('hideLoader');
    };

    this.updateBet = function() {
        this.sendMessage('updateBet');
    };

    this.errorMessage = function(errorObject) {
        this.sendMessage('errorMessage',errorObject);
    };

    this.sendMessage = function(type,errorObj) {
        let messageObject = {
            name: 'integration',
            sender: 'Balloon',
            lang: localeCode,
            type: type,
            errorObject : errorObj
        };
        if (!gameClass.firstLoad) {
            messageObject.data = {
                playerTokenId: "",
                clientToken: "",
                currencyCode: "",
                balance: 0,
                winAmount: 0,
                totalBet: 0
            };
        } else {
            messageObject.data = {
                playerTokenId: gameClass.board.PlayerKey,
                clientToken: $("#Token").val(),
                currencyCode: gameClass.player.Currency.CurrencyCode,
                balance: gameClass.player.AvailableAmount,
                winAmount: gameClass.board.WinAmount,
                totalBet: gameClass.bets[gameClass.selectedBetIndex]
            };
        }
        // console.log(messageObject);
        window.parent.postMessage(messageObject, '*');
    };

    this.receiveMessage = function() {
        window.addEventListener('message', EventHandler, false);

        function EventHandler(eventData) {
            switch (eventData.data.type) {
                case "integrationStopAutobet":
                    //stopAutobet();
                    break;
                case "integrationDisableSpin":
                    $('.gameButton').addClass('disabled');
                    $('.gameButton').addClass('pointerNone');
                    break;
                case "integrationEnableSpin":
                    $('.gameButton').removeClass('disabled');
                    $('.gameButton').removeClass('pointerNone');
                    break;
                case "integrationRefreshBalance":
                    PostCustomEvent(token, 'update.balance');
                    break;
                case "integrationFailedCommunication":
                    //enableSpin();
                    break;
                case "integrationConnectionEstablished":
                    //enableSpin();
                    break;
                case "integrationResizeGame":
                    //enableSpin();
                    break;
            }
        }
    };

}

let gameEvent = new GameEvents();
gameEvent.receiveMessage();
gameEvent.onAppFrameReady();

window.addEventListener( "message", function (event){
  let message = event.data;
    if ( message.name !== undefined ) {
      if(event.data !== undefined && event.data.name === "open-promotion-status"){
        window.parent.postMessage({name:"promotion-status",menuClickCheck:'Menu'},"*")
      }
    }
});

function getParentParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
    var results = null;
    try {
        results = regex.exec(parent.location.search);
    } catch (e) {

    }
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)")
    var results = null;
    try {
        results = regex.exec(location.search);
    } catch (e) {

    }
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}