var canvasApp = new PIXI.Application({
    width: 1239,// 1239
    height: 746, // 746
    transparent: true,
    autoResize: true
})
class BalloonCanvas {
    constructor() {
        this.Loader = null;
        this.balloons = new Array(5);
        this.balloonDif = 0.002;
        this.buttonPipe = null;
        this.balloonShadow = null;
        this.gameBackground = null;
        this.detonateBalloons = new Array(5);
        this.detonateBalloonCount = 0;
        this.fadeList = [];
        this.balloonCompletedIndex = 0;
        this.stepReverse = false;
        this.drawBalloonsAnimation = false;
        this.winCoinsAnimation = null;
        this.winBalanceAnimation = null;
        this.gameBackground2 = null;
        this.balloonsFadeCounter = 0;
        this.f12Image = null;

        this.objectsIsInit = false;

        // FTN start
        this.isFTNskin = false
        this.FTNWinAnimation = null;
        this.FTNBalanceAnimation = null;
        // FTN end
    }

    createCanvas() {
        this.Application = canvasApp;
        this.Application.stage.sortableChildren = true;
        document.querySelector('.game-container').appendChild(this.Application.view);
    }

    loadLoader() {
        this.Loader = new PIXI.Loader();
        this.Loader
            .add('Balloon1', gameInfo.spineUrl + 'Balloon/1/Levan.json')
            .add('Balloon2', gameInfo.spineUrl + 'Balloon/2/Levan.json')
            .add('Balloon3', gameInfo.spineUrl + 'Balloon/3/Levan.json')
            .add('Balloon4', gameInfo.spineUrl + 'Balloon/4/Levan.json')
            .add('Balloon5', gameInfo.spineUrl + 'Balloon/5/Levan.json')
            .add('Detonate1', gameInfo.spineUrl + 'Detonate/1/Levan.json')
            .add('Detonate2', gameInfo.spineUrl + 'Detonate/2/Levan.json')
            .add('Detonate3', gameInfo.spineUrl + 'Detonate/3/Levan.json')
            .add('Detonate4', gameInfo.spineUrl + 'Detonate/4/Levan.json')
            .add('Detonate5', gameInfo.spineUrl + 'Detonate/5/Levan.json')
            .add('BalloonShadow', gameInfo.spineUrl + 'Shadow/Levan.json')
            .add('Background', gameInfo.spineUrl + 'Background/Levan.json')
            .add('Button', gameInfo.spineUrl + 'Button/gilaki.json')
            .add('WinBalance', gameInfo.spineUrl + 'Win/monetebi balansshi/Jackpot.json')
            .add('WinCoin', gameInfo.spineUrl + 'Win/monetebis amoyra/zoma.json')
        if(mobileDevice) {
            this.Loader
                .add('Horizontal', gameInfo.spineUrl + 'Horizontal/turn.json')
        }
        //FTN start
        if(getParameterByName('Skin') === 'FTN' || getParentParameterByName('Skin')) this.isFTNskin = true
        if(this.isFTNskin) {
            this.Loader
            .add('FTNWin', gameInfo.spineUrl + 'FTN/win/zoma.json')
            .add('FTNCoin', gameInfo.spineUrl + 'FTN/monetis chavardna/Jackpot.json')
        }
        //FTN end
        this.Loader.load();

        this.Application.ticker.maxFPS = 60;
        this.Application.ticker.add(function (delta) {
            if(gameInfo.resourceLoaded) {
                balloonAnimations.animations(delta)
            }
        });
    }

    animations() {
        for(let i = 0; i < this.fadeList.length; i++) {
            let info = this.fadeList[i];
            let delay = info.delay;
            let delayTime = info.delayTime;
            if(delayTime > 0) {
                delayTime -= delta;
                this.fadeList[i].delayTime = delayTime;
            } else if(delay > 0) {
                delay--;
                this.fadeList[i].delay = delay;
            } else {
                let alpha = info.alpha;
                let max = info.max;
                let dif = info.dif;
                alpha += dif;
                if ((dif > 0 && alpha >= max) || (dif < 0 && alpha <= max)) {
                    alpha = max;
                    this.fadeList[i].alpha = alpha;
                    this.fadeList[i].element.alpha = alpha;
                    this.fadeList.splice(i, 1);
                    this.updateBalloons();
                } else {
                    this.fadeList[i].alpha = alpha;
                    this.fadeList[i].element.alpha = alpha;
                }
            }
        }
    }

    fadeEffect(element, param) {
        element.alpha = param.start;
        this.fadeList.push({
            element: element,
            alpha: param.start,
            dif: param.dif,
            max: param.max,
            delay: param.delay === undefined ? 0 : param.delay,
            delayTime: param.delayTime === undefined ? 0 : param.delayTime
        });
    };

    initObjects() {
        let skinName = false;
        if( getParameterByName('Skin') !== '') {
            skinName = getParameterByName('Skin')
        }else if(getParentParameterByName('Skin') !== '') {
            skinName = getParentParameterByName('Skin')
        }else{
            skinName = false;
        }

        if(skinName){
            this.f12Image = PIXI.Sprite.from(gameInfo.imageUrl + `/${mobileDevice ? 'ReskinMobile' : 'Reskin'}/${skinName}/balloon.png`);
            this.Application.stage.addChild(this.f12Image);
            if(mobileDevice){
                this.f12Image.zIndex = 1;
                this.f12Image.x = 150;
                this.f12Image.y = 350
            }
            else{
                this.f12Image.zIndex = 1;
                this.f12Image.x = 1650;
                this.f12Image.y = 480
            }
        }

        if(skinName === 'FTN') this.isFTNskin = true

        for(let i = 0; i < this.balloons.length; i++) {
            this.balloons[i] = drawSpine(this.Loader.resources['Balloon' + (i + 1)].spineData, { 
                container: this.Application.stage, 
                x: mobileDevice ? -1230 : -1040, 
                y: mobileDevice ? 930 + gameInfo.paddingBottom / 1.6 : 1250, 
                scale: mobileDevice ? 1.9 : 2.7, 
                zIndex: this.balloons.length - i, 
                animate: false 
            });
            
            if(mobileDevice) this.balloons[i].y = 1372 + (gameInfo.paddingBottom / 3);
            
            this.balloons[i].state.setAnimation(0, "gaberva1", false);
            this.balloons[i].pause = true;
            
            let p = {start: 0, max: 1, dif: 0.3, delay: 0};
            this.fadeEffect(balloonAnimations.balloons[i], p);
        }
        this.balloonShadow = drawSpine(this.Loader.resources['BalloonShadow'].spineData, { 
            container: this.Application.stage, 
            x: mobileDevice ? -1245 : -1040, 
            y:  mobileDevice ? 930  + gameInfo.paddingBottom / 1.5 : 1250 + 10, 
            scale: mobileDevice ? 1.9 : 2.7, 
            zIndex: 2, 
            animate: false 
        });

        if(mobileDevice) this.balloonShadow.y = 1383 + (gameInfo.paddingBottom / 3);

        this.balloonShadow.alpha = 0.7;
        this.balloonShadow.state.setAnimation(0, "gaberva1", false);
        this.balloonShadow.pause = true;
        if(this.gameBackground) this.gameBackground.destroy();
        this.gameBackground = drawSpine(this.Loader.resources['Background'].spineData, { 
            container: this.Application.stage, 
            x: mobileDevice ? -2016 : -1400, 
            y: mobileDevice ? -2490  + gameInfo.paddingBottom / 1.5 : -2850, 
            scale: 1, 
            zIndex: 0, 
            animate: false 
        });

        for(let i = 0; i < 5; i++) {
            this.detonateBalloons[i] = drawSpine(this.Loader.resources['Detonate' + (i + 1)].spineData, { 
                container: this.Application.stage, 
                x: mobileDevice ? -1400 + 245 : -1200,
                y: mobileDevice ? -2500 + 380 : -2500, 
                scale: mobileDevice ? 1 : 1.3, 
                zIndex: 0, 
                animate: false 
            });
            this.detonateBalloons[i]['x'] = mobileDevice ? 350 :  1100;
            this.detonateBalloons[i]['y'] = mobileDevice ? 660 + gameInfo.paddingBottom / 1.6 : 500;
            this.detonateBalloons[i]['visible'] = false;
        }
        if(this.buttonPipe) this.buttonPipe.destroy();
        this.buttonPipe = drawSpine(this.Loader.resources['Button'].spineData, { 
            container: this.Application.stage, 
            x: mobileDevice ? -100 : 1450, 
            y: mobileDevice ? 1017 + gameInfo.paddingBottom : 0, 
            scale: mobileDevice ? 1 : 1.2, 
            zIndex: 10, 
            animate: false 
        });
        if(mobileDevice) balloonAnimations.buttonPipe.y = 1017 + gameInfo.paddingBottom;

        if(!mobileDevice) this.buttonPipe.state.setAnimation(0, "horizontal", false);
        else this.buttonPipe.state.setAnimation(0, "vertikal", false);
        
        this.buttonPipe.pause = true;
        gameClass.initGame();
        this.objectsIsInit = true;
    }

    startBalloonsAnimation() {
        if(!this.objectsIsInit) return;

        this.objectsIsInit = false;
        if(audioElement[0]) audioElement[0] = null;
        PlaySound(0, 'GrrowBollSound', 1);
        this.stepReverse = false;
        this.drawBalloonsAnimation = true;
        for(let i = 0; i < this.balloons.length; i++) {
            this.balloons[i].state.setAnimation(0, "gaberva1", false);
            this.balloons[i].lastTime = (new Date()).getTime();
            this.balloons[i].autoUpdate = true;
        }
        this.gameBackground.state.setAnimation(0, "gaberva1", false);
        this.balloonShadow.state.setAnimation(0, "gaberva1", false);
        if(!mobileDevice) this.buttonPipe.state.setAnimation(0, "horizontal", true);
        else this.buttonPipe.state.setAnimation(0, "vertikal", true);
        this.buttonPipe.lastTime = (new Date()).getTime();
        this.buttonPipe.autoUpdate = true;
        this.balloonShadow.lastTime = (new Date()).getTime();
        this.balloonShadow.autoUpdate = true;
        let p = {start: 1, max: 0, dif: -this.balloonDif, delay: 0};
        this.fadeEffect(balloonAnimations.balloons[0], p);
    }
    
    updateBalloons() {
        if(!this.drawBalloonsAnimation) {
            this.balloonsFadeCounter++;
            if(this.balloonsFadeCounter === this.balloons.length) {
                this.balloonsFadeCounter = 0;
            }
            return;
        } 
        if(!this.stepReverse) {
            this.balloonCompletedIndex++;
        } else {
            this.balloonCompletedIndex--;
        }

        if(this.balloonCompletedIndex === this.balloons.length - 1) {
            this.stepReverse = true;
            for(let i = 0; i < this.balloons.length; i++) {
                balloonAnimations.balloons[i]['alpha'] = 1;
            }
            for(let i = 0; i < this.balloons.length; i++) {
                balloonAnimations.balloons[i]['zIndex'] = i;
            }

            let p = {start: 1, max: 0, dif: -this.balloonDif, delay: 0};
            this.fadeEffect(this.balloons[this.balloons.length - 1], p);
        } else if(this.balloonCompletedIndex === 0) {
            this.stepReverse = false;
            for(let i = 0; i < this.balloons.length; i++) {
                balloonAnimations.balloons[i]['alpha'] = 1;
            }
            for(let i = 0; i < this.balloons.length; i++) {
                balloonAnimations.balloons[i]['zIndex'] = this.balloons.length - i;
            }
            let p = {start: 1, max: 0, dif: -this.balloonDif, delay: 0};
            this.fadeEffect(this.balloons[0], p);
        } else {
            let p = {start: 1, max: 0, dif: -this.balloonDif, delay: 0};
            this.fadeEffect(this.balloons[this.balloonCompletedIndex], p);
        }
    }

    detonateBalloon() {
        gameClass.winAnimationIsGoing = true;
        this.detonateBalloons[this.balloonCompletedIndex]['visible'] = true;
        this.detonateBalloons[this.balloonCompletedIndex].state.setAnimation(0, "fetq" + (this.balloonCompletedIndex + 1), false);
        this.detonateBalloons[this.balloonCompletedIndex].state.addListener({
            complete: function(track, event) {
                balloonAnimations.detonateBalloons[balloonAnimations.balloonCompletedIndex].destroy();
                setTimeout(function() {
                    gameClass.winAnimationIsGoing = false;
                    balloonAnimations.initObjects();
                }, 300)
            }
        });
        this.destroyGameAnimations();
        
    }

    destroyGameAnimations() {
        for(let i = 0; i < this.balloons.length; i++) {
            if(this.balloons[i]) {
                this.balloons[i].destroy();
                this.balloons[i] = null;
            }
        }
        // this.gameBackground.destroy();
        if(this.gameBackground) this.gameBackground.pause = true;
        if(this.balloonShadow) this.balloonShadow.destroy();
        if(this.buttonPipe) this.buttonPipe.pause = true;
        if(this.drawBalloonsAnimation) this.drawBalloonsAnimation = false;
        this.fadeList = [];
        this.balloonCompletedIndex = 0;
        if(audioElement[0]) audioElement[0].stop();
        audioElement[0] = null;
    }

    drawWinAnimations() {
        gameClass.winAnimationIsGoing = true;
        balloonAnimations.destroyGameAnimations();
        if(this.isFTNskin) {
            this.FTNWinAnimation = drawSpine(this.Loader.resources['FTNWin'].spineData, {
                container: this.Application.stage,
                x: -5,
                y: -85,
                scale: 1.5,
                zIndex: 100,
                animate: false
            })
            if(this.FTNBalanceAnimation) {
                this.FTNBalanceAnimation.destroy();
                this.FTNBalanceAnimation = null;
            }
            this.FTNBalanceAnimation = drawSpine(this.Loader.resources['FTNCoin'].spineData, {
                container: this.Application.stage,
                x: -425,
                y: 1206,
                scale: 1,
                zIndex: 100,
                animate: false,
                visible: false
            })
    
            if(mobileDevice) {
                this.FTNWinAnimation.state.setAnimation(0, "win", false);
                this.FTNWinAnimation.x = 360;
                this.FTNWinAnimation.y = 640 + gameInfo.paddingBottom / 1.6;
                this.buttonPipe.visible = false
                $('.gameButton').css('display', 'none')
            }  else {
                this.FTNWinAnimation.state.setAnimation(0, "windesktopi", false);
            }

            this.FTNWinAnimation.state.addListener({
                complete: function(track, event) {
                    gameClass.winAnimationIsGoing = false;
                    balloonAnimations.FTNWinAnimation.destroy();
                    balloonAnimations.FTNBalanceAnimation.state.setAnimation(0, "balansi", false);
                    if(mobileDevice) {
                        balloonAnimations.FTNBalanceAnimation.x = -800;
                        balloonAnimations.FTNBalanceAnimation.y = 1880;
                    }
                    $('#UserAmountValue').html(gameClass.player.AvailableAmount.toFixed(gameClass.fractionDigit));
                    setTimeout(function() {
                        balloonAnimations.FTNBalanceAnimation.visible = true;
                        if(mobileDevice) {
                            balloonAnimations.buttonPipe.visible = true
                            $('.gameButton').css('display', 'block')
                        }
                        balloonAnimations.initObjects();
                    }, 10)
                    balloonAnimations.FTNWinAnimation.destroy();
                    $('.winPopup').removeClass('active');
                }
            });
        }else {
            this.winCoinsAnimation = drawSpine(this.Loader.resources['WinCoin'].spineData, {
                container: this.Application.stage,
                x: 455,
                y: -7,
                scale: 1,
                zIndex: 100,
                animate: false
            });
            if(this.winBalanceAnimation) {
                this.winBalanceAnimation.destroy();
                this.winBalanceAnimation = null;
            }
            this.winBalanceAnimation = drawSpine(this.Loader.resources['WinBalance'].spineData, {
                container: this.Application.stage,
                x: -425,
                y: 1206,
                scale: 1,
                zIndex: 100,
                animate: false,
                visible: false
            });

            if(mobileDevice) {
                this.winCoinsAnimation.state.setAnimation(0, "win", false);
                this.winCoinsAnimation.x = 360;
                this.winCoinsAnimation.y = 600 + gameInfo.paddingBottom / 1.6;
            }  else {
                this.winCoinsAnimation.state.setAnimation(0, "windesktopi", false);
            }

            this.winCoinsAnimation.state.addListener({
                complete: function(track, event) {
                    gameClass.winAnimationIsGoing = false;
                    balloonAnimations.winCoinsAnimation.destroy();
                    balloonAnimations.winBalanceAnimation.state.setAnimation(0, "balansi", false);
                    if(mobileDevice) {
                        balloonAnimations.winBalanceAnimation.x = -800;
                        balloonAnimations.winBalanceAnimation.y = 1880;
                    }
                    $('#UserAmountValue').html(gameClass.player.AvailableAmount.toFixed(gameClass.fractionDigit));
                    setTimeout(function() {
                        balloonAnimations.winBalanceAnimation.visible = true;
                        balloonAnimations.initObjects();
                    }, 10)
                    balloonAnimations.winCoinsAnimation.destroy();
                    $('.winPopup').removeClass('active');
                }
            });
            this.winBalanceAnimation.state.addListener({
                complete: function(track, event) {
                    balloonAnimations.winBalanceAnimation.destroy();
                    this.winBalanceAnimation = null;
                }
            });
        }
        

    }

    resetWinAnimationsWithoutCompleted() {
        if(audioElement[0]) audioElement[0].stop();
        audioElement[0] = null;
        $('.winPopup').removeClass('active');
        gameClass.winAnimationIsGoing = false;
        balloonAnimations.destroyGameAnimations();
        if(this.winCoinsAnimation) {
            this.winCoinsAnimation.destroy();
            this.winCoinsAnimation = null;
        }
        if(this.winBalanceAnimation) {
            this.winBalanceAnimation.destroy();
            this.winBalanceAnimation = null;
        }
        //FTN start
        if(this.FTNWinAnimation) {
            this.FTNWinAnimation.destroy();
            this.FTNWinAnimation = null;
        }
        if(this.FTNBalanceAnimation) {
            this.FTNBalanceAnimation.destroy();
            this.FTNBalanceAnimation = null;
        }
        //FTN end
        $('#UserAmountValue').html(gameClass.player.AvailableAmount.toFixed(gameClass.fractionDigit));
        $('.disabled').addClass('pointerNone');
        balloonAnimations.initObjects();
        setTimeout(function() {
            GetCurrentEvents()
        }, 300)
    }
}


function setMobilePositions() {
    if(balloonAnimations.buttonPipe) {
        balloonAnimations.buttonPipe.y = 1017 + gameInfo.paddingBottom;
    }
    
    $('.WinNumber').css('margin-top', gameInfo.paddingBottom / 3);
    $('.WinNumberGEL').css('margin-top', gameInfo.paddingBottom / 3);
    if(balloonAnimations.balloons.length > 0 && balloonAnimations.balloons[0]) {
        for(let i = 0; i < balloonAnimations.balloons.length; i++) {
            balloonAnimations.balloons[i].y = 1372 + (gameInfo.paddingBottom / 3);
        }
        balloonAnimations.balloonShadow.y = 1383 + (gameInfo.paddingBottom / 3);
    }
}

const balloonAnimations = new BalloonCanvas();

balloonAnimations.createCanvas();


function drawSpine(spineData, params, skin) {

    let spineObject = new PIXI.spine.Spine(spineData);
    AvWidth = spineObject.spineData.width;
    AvHeight = spineObject.spineData.height;

    let animationIndex = 0;
    if (params !== undefined && params !== null && params.animationIndex !== undefined) {
        animationIndex = params.animationIndex;
    }

    let skinName;
    if (spineData.skins.length === 0) {
        skinName = '';
    } else if (skin !== undefined) {
        skinName = skin;
    } else if (spineData.skins.length > 0) {
        skinName = spineData.skins[0].name;
    }
    let animationName = spineData.animations[animationIndex].name;

    // set current skin
    if (skinName !== '') spineObject.skeleton.setSkinByName(skinName);
    spineObject.skeleton.setSlotsToSetupPose();
    // set the position
    if (params !== undefined && params !== null) {
        for (let key in params) {
            if (key !== 'container' && key !== 'tempContainer' && key !== 'animationIndex' && key !== 'animate' && key !== 'animateLoop' && key !== 'align' && key !== 'verticalAlign') {
                if (key === 'x') {
                    let x;
                    if (params.align !== undefined && params.align === 'Left') {
                        x = params[key];
                    } else {
                        x = params[key] + AvWidth / 2;
                    }
                    spineObject['defaultX'] = x;
                    spineObject[key] = spineObject['defaultX'];
                } else if (key === 'y') {
                    let y;
                    if (params.verticalAlign !== undefined && params.verticalAlign === 'Top') {
                        y = params[key];
                    } else {
                        y = params[key] + AvHeight / 2;
                    }
                    spineObject[key] = y;
                } else if (key === 'scale') {
                    spineObject.scale.set(params[key]);
                } else if (key === 'scaleX') {
                    spineObject.scale.x = params[key];
                } else {
                    spineObject[key] = params[key];
                }
            }
        }
    }

    let animateLoop = true;
    if (params !== undefined && params !== null && params.animateLoop !== undefined) {
        animateLoop = params.animateLoop;
    }

    // play animation
    if (params !== undefined && params !== null && params.animate !== undefined && !params.animate) {

    } else {
        spineObject.state.setAnimation(0, animationName, animateLoop);
    }

    let container = null;
    if (params !== undefined && params !== null && params.container !== undefined) {
        if (typeof params.container === "string") {
            container = gameContainer[params.container].container;
        } else {
            container = params.container;
        }
    }
    if(container) container.addChild(spineObject);

    sortContainerChildren(container);
    return spineObject;
}


function sortContainerChildren(container) {
    container.children.sort(function (a, b) {
        a.zOrder = a.zOrder || 0;
        b.zOrder = b.zOrder || 0;
        return a.zOrder - b.zOrder
    });
}