var sound = new Audio('./sound.mp3');
var win = new Audio('./win.mp3');
var roll = new Audio('./roll.mp3');
var items = [];
const time = 35;

// Shuffle

shuffle = array => {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    while (0 !== currentIndex) {
  
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }

type = chance => {
    if(chance === 1) {
        return "epic";
    } else if(chance > 1 && chance <= 10) {
        return "rare";
    } else if(chance > 10 && chance <= 30) {
        return "uncommon";
    } else {
        return "common";
    }
}

// Open

$(document).ready(function() {
    for(var i = 0; i < main.length; i++) {
        const value = Math.ceil(main[i].chance*(main.length*0.01));
        for(var j = 0; j < value; j++) {
            items.push(main[i]);
        }
    }
    $('.items').css('width',`${items.length * 134 * 4}px`);
    shuffle(items);
    for(var i = 0; i < items.length; i++) {
        $('.items').append(`<div class="item ${type(items[i].chance)}" id="${items[i].id}" style="background-color: ${items[i].color};"></div>`);
    }
    for(var i = 0; i < main.length; i++) {
        const sort = main;
        sort.sort((a, b) => b.chance - a.chance);
        var value = Math.ceil(sort[i].chance*(sort.length*0.01));
        if(value === sort.length) {
            value -= 1;
        }
        $('.menu').append(`<div class="menuitem ${type(sort[i].chance)}" style="background-color: ${sort[i].color}"><span>${sort[i].color}</span><p>${value + '<b>:</b>' + main.length}</p></div>`);
    }
    $('section#body').css('visibility','visible');
    $('.loader-wrapper').css('display','none');
});

next = () => {
    $('.items').css('transition',`all 0.2s ease-out 0s`);
    $('.items').css('transform','translate3d(-206px, 0, 0)');
    setTimeout(() => {
        const div = $('.item').first();
        div.remove();
        $('.items').append(div);
        $('.items').css('transition','none');
        $('.items').css('transform','translate3d(-72px, 0, 0)');
    }, 60);
}

finish = () => {
    const div = $('.items').html();
    const final = Math.floor(Math.random() * (4000 - 3000)) + 3000;
    $('.items').append(div);
    $('.items').append(div);
    $('.items').css('transition',`all 4s ease-out 0s`);
    $('.items').css('transform',`translate3d(-${final}px, 0, 0)`);
    for(var i = 0; i < 8; i++) {
        setTimeout(() => {
            sound.play();
        }, i * 134 * (i/2));
    }
    setTimeout(() => {
        $('.items').css('transition','none');
        const id = $('.item').eq(Math.round((final + 262)/134)).attr("id");
        const reward = items.filter(item => item.id == Number(id));
        $('#reward').css('background-color',reward[0].color);
        $('#reward').attr('class',type(reward[0].chance))
        $('#text').html(`Congratulations.<br>You won <b style="text-transform: uppercase">${reward[0].color}</b> color!`);
        $('#type').html(`This item is <b style="text-transform: uppercase">${type(reward[0].chance)}</b>`);
        win.play();
        $('.modal').css('display','flex');
        $('.modal').css('opacity',1);
    }, 4200);
}

opener = () => {
    shuffle(items);
    $('.items').html('');
    for(var i = 0; i < items.length; i++) {
        $('.items').append(`<div class="item ${type(items[i].chance)}" id="${items[i].id}" style="background-color: ${items[i].color};"></div>`);
    }
    roll.play();
    $('#init-btn').attr('disabled','true');
    var i = 0;
    for(var i = 0; i < time; i++) {
        setTimeout(() => {
            next();
            sound.play();
        }, i*60);
    }
    setTimeout(() => {
        finish();
    }, time*60.5);
}
// Ripple

const buttons = document.querySelectorAll("[data-animation=\"ripple\"]");
[...buttons].forEach(e => {
    e.onmousedown = function(t) {
        const   e = t.pageX - this.offsetLeft,
                n = t.pageY - this.offsetTop,
                o = this.offsetWidth,
                a = document.createElement("span");
        a.className = "ripple", a.style.left = e + "px", a.style.top = n + "px", a.style.setProperty("--scale", o), this.appendChild(a), setTimeout(() => {
            a.parentNode.removeChild(a)
        }, 500);
    }
});

modalclose = () => {
    $('.modal').css('opacity',0);
    $('.modal').css('display','none');
    $('.btn-raised').removeAttr('disabled');
}