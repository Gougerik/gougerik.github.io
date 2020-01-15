var rows, cols;
rows = cols = 5;
var paused, level;
paused = level = 1;
var x, y, gemx, gemy, bombx, bomby, gems, record, credits, countdown, totcd;
x = y = gemx = gemy = bombx = bomby = gems = record = credits = countdown = totcd = 0;
var bombs, sound;
bombs = sound = true;

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
        $('.player').addClass('dir-'+dir);
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
        if (yr !== y && xr !== x && yr !== bomby && xr !== bombx) {
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
    var rollSound = new Audio("sounds/score.wav");
    rollSound.play();
    gems += 1;
    $('#gems').html(gems);
    Gem();
    if (bombs) {
        Bomb();
    }
}

function BlowUp() {
    var rollSound = new Audio("sounds/bomb.wav");
    rollSound.play();
    if (level > 1) {
        level -= 1;
    }
    $('#level').html(level);
    paused = 1;
    $('#canvas').html('<p class="init middle">You blown up!</p>');
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
            var rollSound = new Audio("sounds/countdown.wav");
            rollSound.play();
            if (--timer < 0) {
                var rollSound = new Audio("sounds/start.wav");
                rollSound.play();
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
            var rollSound = new Audio("sounds/victory.wav");
            rollSound.play();
            var balance = parseInt((rows * cols * (gems / totcd)) / 10);
            $('#timeleft').html("00:00");
            $('#canvas').html('<p class="middle" id="initText"></p>');
            $('#initText').append('<span class="text-center">Finish!</span>');
            $('#initText').append('Collected Gems: <span class="init">' + gems + '</span><br>');
            $('#initText').append('Collected Credits:');
            $('#initText').append('<code class="text-center">((rows × columns × (gems ÷ minutes)) ÷ 10</code>');
            $('#initText').append('<code class="text-center">((' + rows + ' × ' + cols + ' × (' + gems + ' ÷ ' + totcd + ')) ÷ 10</code>');
            $('#initText').append('<span class="init text-center">' + balance + '</span>');
            credits = credits + balance;
            if (gems > record) {
                record = credits;
                $('#initText').append('<br><span class="text-center init">New Record!</span>');
                $('#record').html(record);
                $.ajax({
                    type: 'POST',
                    url: 'init/record.php',
                    data: { record:record }
                });
            }
            level += 1;
            $('#balance').html(credits);
            $('#gems').html('0');
            $('#posx').html('0');
            $('#posy').html('0');
            $('#bombx').html('0');
            $('#bomby').html('0');
            $('#level').html(level);
            $('#initBtn').html('Replay');
            gems = 0;
            rows = 0;
            cols = 0;
            gemx = 0;
            gemy = 0;
            bombx = 0;
            bomby =0;
            x = 0;
            y = 0;
            totcd = 0;
            paused = 1;
            clearInterval(countdown);
            $.ajax({
                type: 'POST',
                url: 'init/credits.php',
                data: { credits:credits }
            });
        }
    }, 1000);
}

function Pause() {
    $('#enter').addClass('hover');
    if (x >= 1 && y >= 1) {
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
}

function Bomb() {
    if (paused == 0) {
        var xr = Math.floor(Math.random() * Math.floor(rows)) + 1;
        var yr = Math.floor(Math.random() * Math.floor(cols)) + 1;
        if (yr !== y && xr !== x && yr !== gemy && xr !== gemx) {
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
        Melee((x + 1), y, 'right');
        $('.arrow#right').addClass('hover');
    } else if (id == 'left') {
        Melee((x - 1), y, 'left');
        $('.arrow#left').addClass('hover');
    } else if (id == 'up') {
        Melee(x, (y - 1), 'up');
        $('.arrow#up').addClass('hover');
    } else if (id == 'down') {
        Melee(x, (y + 1), 'down');
        $('.arrow#down').addClass('hover');
    }
    if (x == gemx && y == gemy && paused == 0) {
        Collect();
    }
    if (x == bombx && y == bomby && paused == 0) {
        BlowUp();
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
            Pause();
            break;
        default:
            return;
    }
    e.preventDefault();
});
