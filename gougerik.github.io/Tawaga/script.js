var rows, cols;
rows = cols = 5;
var paused, level;
paused = level = 1;
var x, y, gemx, gemy, bombx, bomby, gems, record, credits, countdown, totcd;
x = y = gemx = gemy = bombx = bomby = gems = record = credits = countdown = totcd = 0;
var bombs, campaign, loadcode;
bombs = sound = loadcode = false;
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
        $("#minimap").append('<div class="row" id="minirow' + i + '"></div>');
        for (var z = 1; z <= numrows; z += 1) {
            //console.log("Rendering block " + z);
            $("#row" + i).append('<div class="block" id="block' + z + '"></div>');
            $("#minirow" + i).append('<div class="block" id="miniblock' + z + '"></div>');
            var rn = Math.floor(Math.random() * Math.floor(8)) + 1;
            if(rn == 1) {
                $("#row" + i + " > #block" + z).addClass('grass');
            }
        }
    }
    rows = numrows;
    cols = numcols;
    Melee(1, 1, 'none');
    if(campaign) {
        GenWalls();
    }
    Gem();
    if (bombs) {
        $('#ifbombs').css('display','unset');
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

function Collect() {
    if(sound) {
        var rollSound = new Audio(pw+"sounds/score.wav");
        rollSound.play();
    }
    gems += 1;
    $('#gems').html(gems);
    Gem();
    if (bombs) {
        Bomb();
    }
}

function BlowUp() {
    if(sound) {
        var rollSound = new Audio(pw+"sounds/bomb.wav");
        rollSound.play();
    }
    if (level > 1) {
        level -= 1;
    }
    posx = 1;
    posy = 1;
    bombx = 0;
    bomby = 0;
    $('#posx').html(posx);
    $('#posy').html(posy);
    $('#bombx').html(bombx);
    $('#bomby').html(bomby);
    $('#level').html(level);
    paused = 1;
    $('#canvas').html('<p class="init middle">You blown up!</p>');
    $('#initBtn').html('Replay');
    clearInterval(countdown);
}
$('#initBtn').click(function () {
    if(paused == 1) {
        var rsg;
        clearInterval(countdown);
        clearInterval(rsg);
        paused = 1;
        this.blur()
        var numcols = $('input[name="columns"]').val();
        var numrows = $('input[name="rows"]').val();
        var timeleft = $('input[name="time"]').val();
        if(campaign) {
            numcols = cols;
            numrows = rows;
            timeleft = cdtl;
        }
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
    }
});

function Start(cd) {
    gems = 0;
    $('#gems').html('0');
    $('#ifbombs').css('display','none');
    $('#minimap').html('');
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
            if(campaign) {
                if(gems >= goal) {
                    if(sound) {
                        var rollSound = new Audio(pw+"sounds/victory.wav");
                        rollSound.play();
                    }
                    $('#timeleft').html("00:00");
                    $('#canvas').html('<p class="middle" id="initText"></p>');
                    $('#initText').append('<span class="text-center">Level completed!</span>');
                    $('#initText').append('Collected Gems: <span class="init">' + gems + '</span><br>');
                    if(loadcode == false) {
                        $('#initText').append('Collected Credits: <span class="init">'+prize+'</span>');
                        credits = credits + prize;
                        $.ajax({
                            type: 'post',
                            url: '../init/levelup.php',
                            data: { passed:level }
                        });
                    }
                } else {
                    if(sound) {
                        var rollSound = new Audio(pw+"sounds/lose.wav");
                        rollSound.play();
                    }
                    $('#timeleft').html("00:00");
                    $('#canvas').html('<p class="middle" id="initText"></p>');
                    $('#initText').append('<span class="text-center">Level failed!</span>');
                    $('#initText').append('Collected Gems: <span class="init">' + gems + '</span><br>');
                    $('#initText').append('Collected Credits: <span class="init">0</span>');
                }
            } else {
                if(sound) {
                    var rollSound = new Audio(pw+"sounds/victory.wav");
                    rollSound.play();
                }
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
                if (balance > record) {
                    record = balance;
                    $('#initText').append('<br><span class="text-center init">New Record!</span>');
                    $('#record').html(record);
                    $.ajax({
                        type: 'POST',
                        url: pw+'init/record.php',
                        data: { record:record }
                    });
                }
                level += 1;
            }
            ccredits = (credits/1000).toFixed(2);
            ccredits = ccredits+'k';
            $('#balance').html(ccredits);
            $('#gems').html('0');
            $('#posx').html('0');
            $('#posy').html('0');
            $('#ifbombs').css('display','none');
            $('#minimap').html('');
            $('#level').html(level);
            $('#initBtn').html('Replay');
            gems = 0;
            if(!campaign) {
            rows = 0;
            cols = 0;
            }
            bombx = 0;
            bomby = 0;
            gemx = 0;
            gemy = 0;
            x = 0;
            y = 0;
            totcd = 0;
            paused = 1;
            clearInterval(countdown);
            $.ajax({
                type: 'POST',
                url: pw+'init/credits.php',
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
            $('.bombpoint').removeClass('bombpoint');
            $("#row" + yr + " > #block" + xr).addClass('bomb');
            $('.bomb').html('<div class="mine"></div>');
            //console.log('Rendering Gem at x: ' + xr + ', y: ' + yr);
            bombx = xr;
            bomby = yr;
            $('#minirow'+yr+' > #miniblock'+xr).addClass('bombpoint');
        } else {
            Bomb();
        }
    }
}

function Wall(x,y) {
    $('#row' +x+ ' > #block' + y).addClass('wall');
}

$('.arrow').click(function () {
    var id = this.id;
    $('.arrow').removeClass('hover');
    //console.log(id);
    if (id == 'right') {
        if(!$('#row'+y+' > #block'+(x+1)).hasClass('wall')) {
            Melee((x + 1), y, 'right');
            $('.arrow#right').addClass('hover');
        }
    } else if (id == 'left') {
        if(!$('#row'+y+' > #block'+(x-1)).hasClass('wall')) {
            Melee((x - 1), y, 'left');
            $('.arrow#left').addClass('hover');
        }
    } else if (id == 'up') {
        if(!$('#row'+(y-1)+' > #block'+x).hasClass('wall')) {
            Melee(x, (y - 1), 'up');
            $('.arrow#up').addClass('hover');
        }
    } else if (id == 'down') {
        if(!$('#row'+(y+1)+' > #block'+x).hasClass('wall')) {
            Melee(x, (y + 1), 'down');
            $('.arrow#down').addClass('hover');
        }
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

Switch = (id,tar) => {
    if ($('#'+id).is(':checked')) {
        window[tar] = false;
        $('#toggle-'+id).attr('class','jockey toggle-off');
    } else {
        window[tar] = true;
        $('#toggle-'+id).attr('class','jockey toggle-on');
    }
}

ctc = (obj) => {
    $(obj).select();
    document.execCommand('copy');
    $('#ctcModal').css('display','unset');
}