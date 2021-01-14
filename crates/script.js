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

// Open

$(document).ready(function() {
    for(var i = 0; i < main.length; i++) {
        const value = Math.ceil(main[i].chance*(main.length*0.01));
        console.log(value);
        for(var j = 0; j < value; j++) {
            items.push(main[i]);
        }
    }
    $('.items').css('width',`${items.length * 134 * 4}px`);
    shuffle(items);
    for(var i = 0; i < items.length; i++) {
        $('.items').append(`<div class="item" id="${items[i].id}" style="background-color: ${items[i].color};"></div>`);
        const sort = items.filter(item => item.id == Number(i)+1);
        $('.menu').append(`<div class="menuitem" style="background-color: ${sort[0].color}"><span>${sort[0].color}</span><p>${sort[0].chance}%</p></div>`);
    }
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
    const final = Math.floor(Math.random() * (3000 - 2000)) + 2000;
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
        const id = $('.item').eq(Math.round(final/134+2)).attr("id");
        const reward = items.filter(item => item.id == Number(id));
        $('#reward').css('background-color',reward[0].color);
        $('#text').html(`Congratulations.<br>You won <b style="text-transform: uppercase">${reward[0].color}</b> color!`);
        win.play();
        $('.modal').css('display','flex');
        $('.modal').css('opacity',1);
    }, 4000);
}

opener = () => {
    shuffle(items);
    $('.items').html('');
    for(var i = 0; i < items.length; i++) {
        $('.items').append(`<div class="item" id="${items[i].id}" style="background-color: ${items[i].color};"></div>`);
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