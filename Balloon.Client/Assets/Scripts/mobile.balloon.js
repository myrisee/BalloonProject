

mobileDevice = true;
$(document).ready(function() {
    $('.body').on('touchstart', function(e){
        e.preventDefault();
    });

    $('.gameButton').on('touchstart', function(e){
        precashout = false;
        if(gameClass.winAnimationIsGoing || gameClass.gameIsSarted) return;
        e.preventDefault();
        PostEvent(gameClass.eventId, 'StartGame', null, gameClass.selectedBetIndex);
    });

    $('.gameButton').on('touchend', function(e){
        if (!gameClass.gameIsSarted) {
            precashout = true;
            return;
        }
        e.preventDefault();
        $(this).removeClass('active');
        hub.server.toggle(true);
    });
    
    $('.sliderHidden').on('touchstart', function(e) {
        touchStart(e)
    })

    $('.sliderHidden').on('touchmove', function(e) {
        touchMove(e);
    })

    $('.sliderHidden').on('touchend', function(e) {
        touchEnd(e);
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
})

// function mouseUp() {
//     $(this).removeClass('active');
//     hub.server.toggle(true);
// }

// let element = document.querySelector('.gameButton');

// document.addEventListener('touchmove', function(event) {
//     var touch = event.touches[0];
//     if (element !== document.elementFromPoint(touch.pageX,touch.pageY)) {
//         hub.server.toggle(true);
//         element.classList.remove('active');
//     }
// }, false);

function mobileSound(type) {
    if ($('.button_sound_on').hasClass('active') === type) {
        $('.game-sound-bt').trigger('click');
    } 
    toggleSoundIcon();
    $('.sound-popup').fadeOut(100);
    mobileFullScreen();
}

function toggleSoundIcon() {
    if ($(".sound-control").hasClass("active")) {
        $(".lobby-sound-icon").css("background", `url(../../../Content/LobbyContent/Images/Mobile/soundOff.png) no-repeat`);
    } else {
        $(".lobby-sound-icon").css("background", `url(../../../Content/LobbyContent/Images/Mobile/soundOn.png) no-repeat`);

    }
}

function mobileFullScreen() {
    window.parent.postMessage({name: "fullscreen-on"}, "*");
    // if(bowser.name === 'Opera') {
    //     launchFullscreen(document.documentElement);
    // } else {
    //     if ((window.fullScreen) || (window.innerWidth === screen.width && window.innerHeight === screen.height)) {
    //         $('body').addClass('fullscreenView');
    //     } else {
    //         launchFullscreen(document.documentElement);
    //     }
    // }
}

// function ScaleDiv() {
//     let windowWidth = $(window).width();
//     let windowHeight = $(window).height();
//     let canvasWidth = 1446;
//     let canvasHeight = 1080;
//     let scale = 1;
//     let r_deg = 0;

//     let windowHeightMax = 1750; // 1750 / 1322

//     window.scrollTo(0, 0);
//     document.body.scrollTop = 0;
//     setTimeout(function() {
//         window.scrollTo(0, 0);
//         document.body.scrollTop = 0;
//     }, 10);

//     if(windowWidth < windowHeight) {
//         canvasWidth = 720;
//         canvasHeight = 1280;
//         gameInfo.marginLeft = 362;
//     }

//     if(iOS()) {
//         if(windowWidth > windowHeight) {
//             windowHeightMax = 540;
//             r_deg = -90;
//         }
//     } else {
//         if(screen.orientation.type !== 'portrait-primary') {
//             windowHeightMax = 540;
//             r_deg = -90;
//         }
//     }

//     scale = Math.min(windowWidth / canvasWidth, windowHeight / canvasHeight);

//     if(r_deg !== 0) {
//         canvasWidth = $(window).width();
//         canvasHeight = $(window).height();
//         windowWidth = $(window).height();
//         windowHeight = $(window).width();
//         scale = Math.min(windowWidth / canvasWidth, windowHeight / canvasHeight);
//     } 
    
//     gameInfo.scale = scale;
//     let windowWidthOriginal = windowWidth;
//     windowWidth = windowWidth / scale > 960 ? 960 * scale : windowWidth;
//     windowHeight = windowHeight / scale > windowHeightMax ? windowHeightMax * scale : windowHeight;
//     gameInfo.paddingLeft = (windowWidth / scale - canvasWidth) / 2;
//     gameInfo.paddingBottom = windowHeight / scale - canvasHeight;

//     let marginLeft = (windowWidth / scale - canvasWidth) / 2;

//     if (r_deg !== 0) {
//         $('.game-div').css({ 
//             '-webkit-transform': 'scale(' + gameInfo.scale + ',' + gameInfo.scale + ') rotate(' + r_deg + 'deg)',
//             '-ms-transform': 'scale(' + gameInfo.scale + ',' + gameInfo.scale + ') rotate(0de' + r_deg + 'degg)',
//             'transform': 'scale(' + gameInfo.scale + ',' + gameInfo.scale + ') rotate(' + r_deg + 'deg)',
//             'left': (r_deg == 90 ? '100%' : '0px'), 
//             'top': (r_deg == -90 ? '100%' : '0px'),
//             'position': 'absolute'
//         });

//         $('.game').css({
//             'margin-left': '-' + (canvasWidth / 2) + 'px',
//             'left': (windowWidthOriginal / 2) / scale,
//             'top': '0',
//             'margin-top': '0'
//         });
//         // $('.game-content').css({'margin-left': '-' + (marginLeft) + 'px'});

//         let horizontalmaxHeight = $(window).width() / scale > 1750 ? 1750 * scale : $(window).width();
        
//         $('.game-content').css({
//             'height': horizontalmaxHeight / scale + "px",
//             "width": 750 + "px"
//         }); 
//     } else {
    
//         $('.game-div').css({
//             '-webkit-transform': 'scale(' + scale + ',' + scale + ')',
//             '-ms-transform': 'scale(' + scale + ',' + scale + ')',
//             'transform': 'scale(' + scale + ',' + scale + ')',
//             'left': '0px',
//             'top': '0px'
//         });

//         $('.game').css({
//             'margin-left': '-' + (canvasWidth / 2) + 'px',
//             'left': (windowWidthOriginal / 2) / scale,
//             'top': '0',
//             'margin-top': '0'
//         });
//         // $('.game-content').css({'margin-left': '-' + (marginLeft) + 'px'});
    
    
//         let height = Math.max(windowHeight, 1280);
//         // position objects screen resolution start
//         $('.WinNumber').css('margin-top', gameInfo.paddingBottom / 1.6);
//         $('.WinNumberGEL').css('margin-top', gameInfo.paddingBottom / 1.6);

//         if(balloonAnimations.buttonPipe) {
//             balloonAnimations.buttonPipe.y = 972 + gameInfo.paddingBottom;
//         }

//         for(let i = 0; i < balloonAnimations.balloons.length; i++) {
//             if(balloonAnimations.balloons[i]) {
//                 balloonAnimations.balloons[i].y = 1252 + gameInfo.paddingBottom / 1.6;
//                 balloonAnimations.detonateBalloons[i].y = 1100 + gameInfo.paddingBottom / 1.6
//             }
//         }

//         if(balloonAnimations.balloonShadow) {
//             balloonAnimations.balloonShadow.y = 1252 + gameInfo.paddingBottom / 1.6;
//         }

//         // if(balloonAnimations.winCoinsAnimation) {
//         //     balloonAnimations.winCoinsAnimation.y = 600 + gameInfo.paddingBottom;
//         // }

//         // position objects screen resolution end
    
//         $('canvas').css({
//             'height': windowHeight / scale + "px",
//             "width":  windowWidth / scale + "px"
//         }); 

//         $('.game-content').css({
//             'height': windowHeight / scale + "px",
//             "width":  windowWidth / scale < 720 ? windowWidth / scale + "px" : 720 + "px"
//         }); 
        
//         balloonAnimations.Application.view.width = windowWidth / scale < 720 ? windowWidth / scale : 720;
//         balloonAnimations.Application.view.height = windowHeight / scale;
//     }
// }

let oldEndX = null;
let lastX = null;
let startingX = null;
let itemsWidth = null;
let increament = 0;
let moveright = true;
let moveleft = false;
let counterSlider = 0;
let dragCount = 0;

let transformX = 0;

function touchStart(e) {
    startingX = e.originalEvent.touches[0].clientX;
    let x = Math.floor(startingX / itemsWidth);
}

function touchMove(e) {
    // gameClass.clearSelectedElement();
    let currentX = e.originalEvent.touches[0].clientX;
    if(startingX > currentX && moveright){
        moveright = false;
        bool = true;
        moveRight();
    }else if(startingX < currentX && !moveleft){
        moveleft = true;
        moveLeft();
    }

    lastX = currentX;
}


function moveRight() {
    if(dragCount < gameClass.bets.length - 1) {
        dragCount++;
        $('.slideRight').trigger('click');
    }
}

function moveLeft() {
    if(dragCount >= 0) {
        dragCount--;
        $('.slideLeft').trigger('click');
    }
}

function touchEnd(e) {
    moveright = true;
    moveleft = false;
}

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