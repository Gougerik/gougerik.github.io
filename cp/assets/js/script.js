var revealed = false;
var started = false;
var seconds = 00;
var minutes = 00;
var Interval;

$(document).ready(function() {
    $('.loader').css('opacity',0);
    $('#body').css('opacity','1');
    setTimeout(function () {
        $('.loader').remove();
    }, 500);
    Shuffle();
    $('.card').click(function() {
        if(started == false) {
            Start();
        }
        if(revealed == true || revealed == false) {
            if(!$(this).hasClass('first') && !$(this).hasClass('paired')) {
                if(revealed == false) {
                    $(this).addClass('revealed');
                    $(this).addClass('first');
                    revealed = true;
                } else {
                    $(this).addClass('revealed');
                    $(this).addClass('second');
                    revealed = 2;
                    setTimeout(Check, 1000);
                }
            }
        }
    });
});

Shuffle = () => {
    $('.paired').removeClass('paired');
    $('.modal').css('display','none');
    var ul = document.querySelector('.grid');
    for (var i = ul.children.length; i >= 0; i--) {
        ul.appendChild(ul.children[Math.random() * i | 0]);
    }
}

Check = () => {
    if($('.first').attr('id') == $('.second').attr('id')) {
        $('.revealed').addClass('paired');
    }
    $('.revealed').removeClass('revealed');
    $('.first').removeClass('first');
    $('.second').removeClass('second');
    revealed = false;
    if($('.paired').length == 24) {
        clearInterval(Interval);
        started = false;
        $('.modal').css('display','flex');
    }
}

Start = () => {
    started = true;
    seconds = 00;
    minutes = 00;
    $('seconds').html('0'+0);
    $('minutes').html('0'+0);
    clearInterval(Interval);
    Interval = setInterval(startTimer, 1000);
}

startTimer = () => {
    seconds++; 
    if(seconds < 9){
        $('#seconds').html("0"+seconds);
    }
    if (seconds > 9){
        $('#seconds').html(seconds);
    }
    if (seconds > 59) {
        minutes++;
        $('#minutes').html("0" + minutes);
        seconds = 0;
        $('#seconds').html("0"+0);
    }
    if(minutes > 9) {
        $('#minutes').html(minutes);
    }
    console.log(seconds);
    console.log(minutes);
}

