var x = 0;
var y = 0;
var gemx = 0;
var gemy = 0;
var gems = 0;
var rows = 5;
var cols = 5;


$(document).ready(function () {
    $('#loader').css("display", "none");
    $('#home').css("display", "flex");
    //Render(rows, cols);
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
    //$('#canvas').html('<p class="middle">Wrong parameters! Size must be at least 5x5 and maximum 20x20!</p>');
}

function Melee(posx, posy) {
    if (posx >= 1 && posy >= 1 && posy <= cols && posx <= rows) {
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

function Collect() {
    gems += 1;
    $('#gems').html(gems);
    Gem();
}
$('#initBtn').click(function () {
    var numcols = $('input[name="columns"]').val();
    var numrows = $('input[name="rows"]').val();
    var timeleft = $('input[name="time"]').val();
    if (numrows <= 20 && numcols <= 20 && numrows >= 5 && numcols >= 5 && timeleft >= 1 && timeleft <= 60) {
        Start(timeleft);
        Render(numcols, numrows);
    } else {
        $('#canvas').html('<p class="middle" id="initText"></p>');
        $('#initText').append('<span class="init text-center">Wrong parameters!</span><br>');
        $('#initText').append('Max. Size: <span class="init">20 x 20</span><br>');
        $('#initText').append('Max. Countdown: <span class="init">60 min.</span>');
    }
});

function Start(cd) {
    var duration = 60 * cd;
    var timer = duration,
        minutes, seconds;
    var countdown = setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        $('#timeleft').html(minutes + ":" + seconds);
        if (--timer < 0) {
            $('#timeleft').html("00:00");
            $('#canvas').html('<p class="middle text-center" id="initText"></p>');
            $('#initText').append('Finish!<br>');
            $('#initText').append('Collected Gems: <span class="init">' + gems + '</span><br>');
            $('#gems').html('0');
            $('#initBtn').html('Replay');
            gems = 0;
            clearInterval(countdown);
        }
    }, 1000);
}
$(document).keydown(function (e) {
    switch (e.which) {
        case 37: // right
            Melee((x - 1), y);
            break;
        case 39: // left
            Melee((x + 1), y);
            break;
        case 40: // down
            Melee(x, (y + 1));
            break;
        case 38: //up
            Melee(x, (y - 1));
            break;
        default:
            return;
    }
    if (x == gemx && y == gemy) {
        Collect();
    }
    e.preventDefault();
});
