var x = 0;
var y = 0;
var gemx = 0;
var gemy = 0;
var gems = 0;
var record = 0;
var credits = 0;
var rows = 5;
var cols = 5;
var countdown = 0;
var paused = 1;
var totcd = 0;

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
    Melee(1, 1);
    Gem();
}

function Melee(posx, posy) {
    if (posx >= 1 && posy >= 1 && posy <= cols && posx <= rows && paused == 0) {
        //console.log('Rendering Player at x: ' + posx + ', y: ' + posy);
        $('.melee').html("");
        $('.melee').removeClass('melee');
        $("#row" + posy + " > #block" + posx).addClass('melee');
        $('.melee').html('<div class="player"></div>');
        $('#posx').html(posx);
        $('#posy').html(posy);
        x = posx;
        y = posy;
    }
}

function Gem() {
    if (paused == 0) {
        var xr = Math.floor(Math.random() * Math.floor(rows)) + 1;
        var yr = Math.floor(Math.random() * Math.floor(cols)) + 1;
        if (yr !== y && xr !== x) {
            $('.treasure').html('<div class="player"></div>');
            $('.treasure').removeClass('treasure');
            $("#row" + yr + " > #block" + xr).addClass('treasure');
            $('.treasure').html('<div class="gem"></div>');
            //console.log('Rendering Gem at x: ' + xr + ', y: ' + yr);
            gemx = xr;
            gemy = yr;
        } else {
            Gem();
        }
    }
}

function Collect() {
    gems += 1;
    $('#gems').html(gems);
    Gem();
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
            if (--timer < 0) {
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
            var balance = parseInt((rows * cols * (gems / totcd)) / 10);
            var columns = cols;
            var row = rows;
            Render(0, 0);
            $('#timeleft').html("00:00");
            $('#canvas').html('<p class="middle" id="initText"></p>');
            $('#initText').append('<span class="text-center">Finish!</span>');
            $('#initText').append('Collected Gems: <span class="init">' + gems + '</span><br>');
            $('#initText').append('Collected Credits:');
            $('#initText').append('<code class="text-center">((rows × columns × (gems ÷ minutes)) ÷ 10</code>');
            $('#initText').append('<code class="text-center">((' + row + ' × ' + columns + ' × (' + gems + ' ÷ ' + totcd + ')) ÷ 10</code>');
            $('#initText').append('<span class="init text-center">' + balance + '</span>');
            if (gems > record) {
                record = gems;
                $('#initText').append('<br><span class="text-center init">New Record!</span>');
                $('#record').html(record);
            }
            credits = credits + balance;
            $('#balance').html(credits);
            $('#gems').html('0');
            $('#posx').html('0');
            $('#posy').html('0');
            $('#initBtn').html('Replay');
            gems = 0;
            rows = 0;
            cols = 0;
            gemx = 0;
            gemy = 0;
            x = 0;
            y = 0;
            totcd = 0;
            paused = 1;
            clearInterval(countdown);
        }
    }, 1000);
}

function Pause() {
    if (paused == 0) {
        //console.log('Paused');
        clearInterval(countdown);
        paused = 1;
        $('#canvas').css('opacity', '0.5');
    } else if (paused == 1) {
        var cd = $('#timeleft').html();
        cd = ($('#timeleft').html()).split(':');
        if (cd[1] < 10) {
            cd = (cd[0]) + '.0' + (parseInt(cd[1] / 60 * 100));
        } else {
            cd = (cd[0]) + '.' + (parseInt(cd[1] / 60 * 100));
        }
        //console.log('Resumed');
        Start(cd);
        paused = 0;
        $('#canvas').css('opacity', '1');
    }
}
$('.arrow').click(function () {
    var id = this.id;
    $('.arrow').removeClass('hover');
    //console.log(id);
    if (id == 'right') {
        Melee((x + 1), y);
        $('.arrow#right').addClass('hover');
    } else if (id == 'left') {
        Melee((x - 1), y);
        $('.arrow#left').addClass('hover');
    } else if (id == 'up') {
        Melee(x, (y - 1));
        $('.arrow#up').addClass('hover');
    } else if (id == 'down') {
        Melee(x, (y + 1));
        $('.arrow#down').addClass('hover');
    }
    if (x == gemx && y == gemy && paused == 0) {
        Collect();
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
        case 13: //enter
            if (x >= 1 && y >= 1) {
                Pause();
            }
            break;
        default:
            return;
    }
    e.preventDefault();
});
