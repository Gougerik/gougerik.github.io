var revealed = false;

$(document).ready(function() {
    $('.loader').css('opacity',0);
    $('#body').css('opacity','1');
    setTimeout(function () {
        $('.loader').remove();
    }, 500);
    Shuffle();
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
    if($('.paired').length == 12) {
        $('.modal').css('display','flex');
    }
}