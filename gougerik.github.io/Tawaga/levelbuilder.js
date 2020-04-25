var walls = [];
var rows, cols;
rows = cols = 5;
var cdtl, goal;
cdtl = goal = 0;
var bombs = 1;

$(document).ready(function () {
    $('#loader').css("display", "none");
    $('#home').css("display", "flex");
});

Render = (numrows, numcols) => {
    $('#canvas').html("");
    for (var i = 1; i <= numcols; i += 1) {
        //console.log("Rendering row " + i);
        $("#canvas").append('<div class="row" id="row' + i + '"></div>');
        for (var z = 1; z <= numrows; z += 1) {
            //console.log("Rendering block " + z);
            $("#row" + i).append('<div class="block" id="block' + z + '"></div>');
        }
    }
    $('.block').click(function () {
        var col = $(this).attr('id').split('block')[1];
        var row = ($(this).parent()).attr('id').split('row')[1];
        var wall = col + '|' + row;
        if($(this).hasClass('wall')) {
            Array.prototype.remove = function() {
                var what, a = arguments, L = a.length, ax;
                while (L && this.length) {
                    what = a[--L];
                    while ((ax = this.indexOf(what)) !== -1) {
                        this.splice(ax, 1);
                    }
                }
                return this;
            };
            $(this).removeClass('wall');
            walls.remove(wall);
        } else {
            $(this).addClass('wall');
            walls.push(wall);
        }
    });
}

$('#initBtn').click(function () {
    var numrows = $('input[name="rows"]').val();
    var numcols = $('input[name="columns"]').val();
    var time = $('input[name="time"]').val();
    var tgoal = $('input[name="goal"]').val();
    if(numrows >= 5 && numrows <= 20 && numcols >= 5 && numcols <= 20 && time >= 1 && time <= 60 && tgoal >= 1) {
        rows = numrows;
        cols = numcols;
        cdtl = time;
        goal = tgoal;
        Render(rows,cols);
    } else {
        $('#canvas').html('<p class="middle" id="initText"></p>');
        $('#initText').append('<span class="init text-center">Wrong parameters!</span><br>');
        $('#initText').append('Min. Size: <span class="init">5 x 5</span><br>');
        $('#initText').append('Max. Size: <span class="init">20 x 20</span><br>');
        $('#initText').append('Max. Countdown: <span class="init">60 min.</span><br>');
        $('#initText').append('<span class="init">Possibly some fields<br>are empty.</span>');
    }
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

$('#generateBtn').click(function () {
    var twalls = walls.join('","');
    var json = '{"rows":'+rows+',"cols":'+cols+',"cdtl":'+cdtl+',"goal":'+goal+',"bombs":'+bombs+',"walls":["'+twalls+'"]}';
    $('#jsonModal').css('display','unset');
    $('#initJson').val(json);
});

ctc = (obj) => {
    $(obj).select();
    document.execCommand('copy');
    $('#ctcModal').css('display','unset');
}