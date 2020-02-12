var rows, cols;
rows = cols = 5;
var x1, y1, x2, y2, gemx, gemy, bombx, bomby, gems1, gems2, countdown, totcd, paused;
x1 = y1 = x2 = y2 = gemx = gemy = bombx = bomby = gems1 = gems2 = countdown = totcd = paused = 0;
var bombs = false;
var sound = true;

var pw = '';

$(document).ready(function () {
    $('#loader').css("display", "none");
    $('#home').css("display", "flex");
});

function Render(numrows, numcols) {
    $('#canvas').html("");
    for (var i = 1; i <= numcols; i += 1) {
        //console.log("Rendering row " + i);
        $("#canvas").append('<div class="row" id="row' + i + '"></div>');
        for (var z = 1; z <= numrows; z += 1) {
            //console.log("Rendering block " + z);
            $("#row" + i).append('<div class="block" id="block' + z + '"></div>');
        }
    }
    rows = numrows;
    cols = numcols;
    Melee(1, 1, 'none');
    Andrew(rows, cols, 'none');
    Gem();
    if (bombs) {
        Bomb();
    }
}

function Melee(posx, posy, dir) {
    if (posx >= 1 && posy >= 1 && posy <= cols && posx <= rows && paused == 0) {
        //console.log('Rendering Player at x: ' + posx + ', y: ' + posy);
        $('.melee').html("");
        $('.melee').removeClass('melee');
        $("#row" + posy + " > #block" + posx).addClass('melee');
        $('.melee').html('<div class="player"></div>');
        $('.andrew').html('<div class="player"></div>');
        $('.melee > .player').addClass('dir-'+dir);
        $('#posx1').html(posx);
        $('#posy1').html(posy);
        x1 = posx;
        y1 = posy;
        if(x1 == x2 && y1 == y2) {
            $('.melee').addClass('andrew');
        }
    }
}

function Andrew(posx, posy, dir) {
    if (posx >= 1 && posy >= 1 && posy <= cols && posx <= rows && paused == 0) {
        //console.log('Rendering Player at x: ' + posx + ', y: ' + posy);
        $('.andrew').html("");
        $('.andrew').removeClass('andrew');
        $("#row" + posy + " > #block" + posx).addClass('andrew');
        $('.andrew').html('<div class="player"></div>');
        $('.melee').html('<div class="player"></div>');
        $('.andrew > .player').addClass('dir-'+dir);
        $('#posx2').html(posx);
        $('#posy2').html(posy);
        x2 = posx;
        y2 = posy;
        if(x1 == x2 && y1 == y2) {
            $('.andrew').addClass('melee');
        }
    }
}

function Gem() {
    if (paused == 0) {
        var xr = Math.floor(Math.random() * Math.floor(rows)) + 1;
        var yr = Math.floor(Math.random() * Math.floor(cols)) + 1;
        if (yr !== y1 && xr !== x1 && yr !== y2 && xr !== x2 && yr !== bomby && xr !== bombx) {
            $('.treasure').html('<div class="player"></div>');
            $('.treasure').removeClass('treasure');
            $("#row" + yr + " > #block" + xr).addClass('treasure');
            $('.treasure').html('<div class="gem"></div>');
            //console.log('Rendering Gem at x: ' + xr + ', y: ' + yr);
            gemx = xr;
            gemy = yr;
            if($('.treasure').hasClass('wall')) {
                $('.treasure').html("");
                $('.treasure').removeClass('treasure');
                Gem();
            }
        } else {
            Gem();
        }
    }
}

function Collect(player) {
    if(sound) {
        var rollSound = new Audio(pw+"sounds/score.wav");
        rollSound.play();
    }
    if(player == 1) {
        gems1 += 1;
        $('#gems1').html(gems1);
    } else if(player == 2) {
        gems2 += 1;
        $('#gems2').html(gems2);
    }
    Gem();
    if (bombs) {
        Bomb();
    }
}

function BlowUp(player) {
    if(sound) {
        var rollSound = new Audio(pw+"sounds/bomb.wav");
        rollSound.play();
    }
    posx1 = 1;
    posy1 = 1;
    posx2 = rows;
    posy2 = cols;
    bombx = 0;
    bomby = 0;
    $('#posx1').html(posx1);
    $('#posy1').html(posy1);
    $('#posx2').html(posx2);
    $('#posy2').html(posy2);
    $('#bombx').html(bombx);
    $('#bomby').html(bomby);
    paused = 1;
    if(player == 1) {
        $('#canvas').html('<p class="init middle">Player 2 wins!</p>');
    } else if(player == 2) {
        $('#canvas').html('<p class="init middle">Player 1 wins!</p>');
    }
    $('#initBtn').html('Replay');
    clearInterval(countdown);
}
$('#initBtn').click(function () {
    var rsg;
    clearInterval(countdown);
    clearInterval(rsg);
    paused = 1;
    this.blur()
    var numcols = $('input[name="columns"]').val();
    var numrows = $('input[name="rows"]').val();
    var timeleft = $('input[name="time"]').val();
    totcd = timeleft;
    if (numrows <= 20 && numcols <= 20 && numrows >= 5 && numcols >= 5 && timeleft >= 1 && timeleft <= 60) {
        var timer = 3,
            minutes, seconds;
        rsg = setInterval(function () {
            seconds = parseInt(timer % 60, 10);
            seconds = seconds < 10 ? seconds : seconds;
            $('#canvas').html('<h1 class="middle init">' + seconds + '</h1>');
            if(sound) {
                var rollSound = new Audio(pw+"sounds/countdown.wav");
                rollSound.play();
            }
            if (--timer < 0) {
                if(sound) {
                    var rollSound = new Audio(pw+"sounds/start.wav");
                    rollSound.play();
                }
                paused = 0;
                clearInterval(rsg);
                Start(timeleft);
                Render(numcols, numrows);
            }
        }, 1000);
    } else {
        $('#canvas').html('<p class="middle" id="initText"></p>');
        $('#initText').append('<span class="init text-center">Wrong parameters!</span><br>');
        $('#initText').append('Min. Size: <span class="init">5 x 5</span><br>');
        $('#initText').append('Max. Size: <span class="init">20 x 20</span><br>');
        $('#initText').append('Max. Countdown: <span class="init">60 min.</span>');
    }
});

function Start(cd) {
    clearInterval(countdown);
    var duration = 60 * cd;
    var timer = duration,
        minutes, seconds;
    countdown = setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        $('#timeleft').html(minutes + ":" + seconds);
        if (--timer < 0) {
            if(sound) {
                var rollSound = new Audio(pw+"sounds/victory.wav");
                rollSound.play();
            }
            var winner = 0;
            if(gems1 > gems2) {
                winner = 1;
            } else if(gems1 < gems2) {
                winner = 2;
            }
            $('#timeleft').html("00:00");
            $('#canvas').html('<p class="middle" id="initText"></p>');
            $('#initText').append('<span class="text-center">Finish!</span>');
            $('#initText').append('Collected Gems: <span class="init">' + gems1 + ' + '+ gems2 + '</span><br>');
            $('#initText').append('Player wins: <span class="init">' + winner + '</span>');
            $('#gems1').html('0');
            $('#gems2').html('0');
            $('#posx1').html('0');
            $('#posy1').html('0');
            $('#posx2').html('0');
            $('#posy2').html('0');
            $('#bombx').html('0');
            $('#bomby').html('0');
            $('#initBtn').html('Replay');
            gems = 0;
            bombx = 0;
            bomby = 0;
            gemx = 0;
            gemy = 0;
            x1 = 0;
            y1 = 0;
            x2 = 0;
            y2 = 0;
            totcd = 0;
            paused = 1;
            clearInterval(countdown);
        }
    }, 1000);
}

function Bomb() {
    if (paused == 0) {
        var xr = Math.floor(Math.random() * Math.floor(rows)) + 1;
        var yr = Math.floor(Math.random() * Math.floor(cols)) + 1;
        if (yr !== y1 && xr !== x1 && yr !== y2 && xr !== x2 && yr !== gemy && xr !== gemx) {
            $('.bomb').html("");
            $('.bomb').removeClass('bomb');
            $("#row" + yr + " > #block" + xr).addClass('bomb');
            $('.bomb').html('<div class="mine"></div>');
            //console.log('Rendering Gem at x: ' + xr + ', y: ' + yr);
            bombx = xr;
            bomby = yr;
            $('#bombx').html(bombx);
            $('#bomby').html(bomby);
        } else {
            Bomb();
        }
    }
}

$('.arrow').click(function () {
    var id = this.id;
    $('.arrow').removeClass('hover');
    //console.log(id);
    if (id == 'right') {
        if(!$('#row'+y1+' > #block'+(x1+1)).hasClass('wall')) {
            Melee((x1 + 1), y1, 'right');
            $('.arrow#right').addClass('hover');
        }
    } else if (id == 'left') {
        if(!$('#row'+y1+' > #block'+(x1-1)).hasClass('wall')) {
            Melee((x1 - 1), y1, 'left');
            $('.arrow#left').addClass('hover');
        }
    } else if (id == 'up') {
        if(!$('#row'+(y1-1)+' > #block'+x1).hasClass('wall')) {
            Melee(x1, (y1 - 1), 'up');
            $('.arrow#up').addClass('hover');
        }
    } else if (id == 'down') {
        if(!$('#row'+(y1+1)+' > #block'+x1).hasClass('wall')) {
            Melee(x1, (y1 + 1), 'down');
            $('.arrow#down').addClass('hover');
        }
    }
    if (x1 == gemx && y1 == gemy && paused == 0) {
        Collect(1);
    }
    if (x1 == bombx && y1 == bomby && paused == 0) {
        BlowUp(1);
    }
});
$('.wasd').click(function () {
    var id = this.id;
    $('.wasd').removeClass('hover');
    //console.log(id);
    if (id == 'right') {
        if(!$('#row'+y2+' > #block'+(x2+1)).hasClass('wall')) {
            Andrew((x2 + 1), y2, 'right');
            $('.wasd#right').addClass('hover');
        }
    } else if (id == 'left') {
        if(!$('#row'+y2+' > #block'+(x2-1)).hasClass('wall')) {
            Andrew((x2 - 1), y2, 'left');
            $('.wasd#left').addClass('hover');
        }
    } else if (id == 'up') {
        if(!$('#row'+(y2-1)+' > #block'+x2).hasClass('wall')) {
            Andrew(x2, (y2 - 1), 'up');
            $('.wasd#up').addClass('hover');
        }
    } else if (id == 'down') {
        if(!$('#row'+(y2+1)+' > #block'+x2).hasClass('wall')) {
            Andrew(x2, (y2 + 1), 'down');
            $('.wasd#down').addClass('hover');
        }
    }
    if (x2 == gemx && y2 == gemy && paused == 0) {
        Collect(2);
    }
    if (x2 == bombx && y2 == bomby && paused == 0) {
        BlowUp(2);
    }
});
$(document).keydown(function (e) {
    switch (e.which) {
        case 39: // right
            $('.arrow#right').click();
            break;
        case 37: // left
            $('.arrow#left').click();
            break;
        case 40: // down
            $('.arrow#down').click();
            break;
        case 38: //up
            $('.arrow#up').click();
            break;
        case 68: // right
            $('.wasd#right').click();
            break;
        case 65: // left
            $('.wasd#left').click();
            break;
        case 83: // down
            $('.wasd#down').click();
            break;
        case 87: //up
            $('.wasd#up').click();
            break;
        default:
            return;
    }
    e.preventDefault();
});

Switch = (id,tar) => {
    if ($('#'+id).is(':checked')) {
        window[tar] = false;
        $('#toggle-'+id).attr('class','jockey toggle-off');
    } else {
        window[tar] = true;
        $('#toggle-'+id).attr('class','jockey toggle-on');
    }
}