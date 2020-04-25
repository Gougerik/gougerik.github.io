var revealed = false;
var seconds = 00;
var tens = 00;
var minutes = 00;
var appendSeconds = document.getElementById("seconds");
var appendMinutes = document.getElementById("minutes");
var Interval;


$(document).ready(function() {
    $('.loader').css('opacity',0);
    $('#body').css('opacity','1');
    setTimeout(function () {
        $('.loader').remove();
    }, 500);
    Shuffle();
    clearInterval(Interval);
    Interval = setInterval(startTimer, 10);
    $('.card').click(function() {
        if(revealed == true || revealed == false) {
            if(!$(this).hasClass('first')) {
                if(revealed == false) {
                    $(this).addClass('revealed');
                    $(this).addClass('first');
                    revealed = true;
                } else {
                    $(this).addClass('revealed');
                    $(this).addClass('second');
                    revealed = 3;
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
        $('.modal').css('display','flex');
    }
}

startTimer = () => {
    tens++; 
    
    if(tens < 9){
      //appendTens.innerHTML = "0" + tens;
    }
    
    if (tens > 9){
      //appendTens.innerHTML = tens;
      
    } 
    
    if (tens > 99) {
      seconds++;
      appendSeconds.innerHTML = "0" + seconds;
      tens = 0;
      appendTens.innerHTML = "0" + 0;
    }
    
    if (seconds > 9){
      appendSeconds.innerHTML = seconds;
    }

    if (seconds > 59) {
        minutes++;
        appendMinutes.innerHTML = "0" + minutes;
        seconds = 0;
        appendSeconds.innerHTML = "0" + 0;
    }

    if(minutes > 9) {
        appendMinutes.innerHTML = minutes;
    }
  
  }

