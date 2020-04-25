var level, goal, canvx, canvy, cdtl, prize;
level = goal = canvx = canvy = prize = 0;
var walls = [];

pw = '../'

$(document).ready(function () {
    campaign = true;
    $.getJSON( "level/level"+level+".json", function( data ) {
        $.each( data, function( key, val ) {
            window[key] = val;
        });
        var bmbs = "no";
        if(bombs) {
            bmbs = "yes";
        }
        $('p.middle.text-center').append("<span>Area size: <span class='init'>"+rows+'x'+cols+'</span></span>');
        $('p.middle.text-center').append("<span>Countdown: <span class='init'>"+cdtl+' min.</span></span>');
        $('p.middle.text-center').append("<span>Bombs: <span class='init'>"+bmbs+'</span></span>');
        $('p.middle.text-center').append("<span>Goal: <span class='init'>"+goal+' gems</span></span>');
        $('#goal').html(goal);
    });
});

function GenWalls() {
    var wl = walls.length;
    var i = 0;
    while(i <= wl-1) {
        var ob = walls[i];
        var object = ob.split('|');
        $('#row'+object[1]+' > #block'+object[0]).addClass('wall');
        i += 1;
    }
}