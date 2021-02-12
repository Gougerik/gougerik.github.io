const color_bg = '#EEEEEE';
const stroke_bg = '#aaaaaa';
const colors = ['blue','green','lime','aqua','purple','magenta','red','yellow'];
const color_surface = colors[Math.floor(Math.random() * Math.floor(4))];
const stroke_width = 10;
const wrapper = document.getElementById('wrapper');
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const count_bots = 4;
const count_balls = 1500;

var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');
var ctx2 = canvas.getContext('2d');
var w = document.documentElement.clientWidth;
var h = document.documentElement.clientHeight;

var canvas2 = document.createElement('canvas')
var ctx2 = canvas2.getContext('2d');

var minimap = document.createElement('canvas');
var mctx = minimap.getContext('2d');

if(!urlParams.get('username')) {
    var username = 'You';
} else {
    var username = urlParams.get('username');
}

var score = [{username:username,score:0}];

var radius;
var speed;
var scale;
var ball_width;
var mp;

var player;
var surface;
var balls;
var map;
var bots;
var myReq;

DistSquared = (pt1, pt2) => {
    var diffX = pt1.x - pt2.x;
    var diffY = pt1.y - pt2.y;
    return (diffX*diffX+diffY*diffY);
}

addscore = (amount) => {
    radius += 0.1*amount;
    scale -= 0.01*amount;
    ball_width -= 0.003*amount;
    for(var i = 0; i < bots.length; i++) {
        bots[i].radius -= 0.01*amount;
    }
    score.find(u => u.username === username).score += 1*amount;
}

// CONSTRUCTORS

function Player(x,y,radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;

    this.update = (radius) => {
        this.radius = radius;
        this.draw(radius);
    };

    this.draw = (radius) => {
        this.radius = radius;
        ctx2.beginPath();
        ctx2.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx2.fillStyle = color_surface;
        ctx2.strokeStyle = 'rgba(0,0,0,0.4)';
        ctx2.lineWidth = stroke_width;
        ctx2.stroke();
        ctx2.fill();
        ctx2.closePath();
    }
}

function Bot(x,y,radius,color,speed,id) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.gx;
    this.gy;
    this.speed = speed;
    this.id = id;
    this.findclose = true;

    this.update = (gx,gy) => {
        this.gx = gx;
        this.gy = gy;
        for(var i = 0; i < bots.length; i++) {
            if(bots[i] !== this && bots.includes(this) && bots.includes(bots[i])) {
                // Fear of each other
                if(this.x < bots[i].x+this.radius*8 && this.y < bots[i].y+this.radius*8 && this.x+this.radius*16 > bots[i].x+this.radius*8 && this.y+this.radius*16 > bots[i].y+this.radius*8 || !this.findclose) {
                    this.findclose = false;
                    if(bots[i].x > this.x && this.x - this.radius > 0 && this.x + this.radius < w*3) {
                        this.x -= this.speed;
                    } else if(bots[i].x < this.x && this.x - this.radius > 0 && this.x + this.radius < w*3) {
                        this.x += this.speed;
                    }
                    if(bots[i].y > this.y && this.y - this.radius > 0 && this.y + this.radius < h*3) {
                        this.y -= this.speed;
                    } else if(bots[i].y < this.y && this.y - this.radius > 0 && this.y + this.radius < h*3) {
                        this.y += this.speed;
                    }
                    setTimeout(() => {
                        this.findclose = true;
                    }, 3000);
                }
            }
        }

        // Fear of player
        const playerscore = score.find(u => u.username === username).score;
        const current = score.find(b => b.id === this.id).score;
        if(this.gx+this.x < w/2+this.radius*8 && this.gy+this.y < h/2+this.radius*8 && this.gx+this.x+this.radius*16 > w/2+this.radius*8 && this.gy+this.y+this.radius*16 > h/2+this.radius*8 || !this.findclose) {
            this.findclose = false;
            if(Math.round(current/100)*100 > Math.round(playerscore/100)*100) {
                if(w/2 > this.x+this.gx && this.x - this.radius > 0 && this.x + this.radius < w*3) {
                    this.x += this.speed;
                } else if(w/2 < this.x+this.gx && this.x - this.radius > 0 && this.x + this.radius < w*3) {
                    this.x -= this.speed;
                }
                if(h/2 > this.y+this.gy && this.y - this.radius > 0 && this.y + this.radius < h*3) {
                    this.y += this.speed;
                } else if(h/2 < this.y+this.gy && this.y - this.radius > 0 && this.y + this.radius < h*3) {
                    this.y -= this.speed;
                }
            } else if(Math.round(current/100)*100 < Math.round(playerscore/100)*100) {
                if(w/2 > this.x+this.gx && this.x - this.radius > 0 && this.x + this.radius < w*3) {
                    this.x -= this.speed;
                } else if(w/2 < this.x+this.gx && this.x - this.radius > 0 && this.x + this.radius < w*3) {
                    this.x += this.speed;
                }
                if(h/2 > this.y+this.gy && this.y - this.radius > 0 && this.y + this.radius < h*3) {
                    this.y -= this.speed;
                } else if(h/2 < this.y+this.gy && this.y - this.radius > 0 && this.y + this.radius < h*3) {
                    this.y += this.speed;
                }
            } else {
                this.findclose = true;
            }
            setTimeout(() => {
                this.findclose = true;
            }, 3000);
        } 

        // Pop
        if(this.gx+this.x < w/2+player.radius/1.5 && this.gy+this.y < h/2+player.radius/1.5 && this.gx+this.x+player.radius*1.5 > w/2+player.radius/1.5 && this.gy+this.y+player.radius*1.5 > h/2+player.radius/1.5) {
            if(Math.round(current/100)*100 < Math.round(playerscore/100)*100) {
                var i = bots.indexOf(this);
                bots.splice(i, 1);
                i = score.find(b => b.id === this.id);
                addscore(i.score);
                i = score.indexOf(i);
                score.splice(i, 1);
            } else if(Math.round(current/100)*100 > Math.round(playerscore/100)*100) {
                $('.modal').css('display','flex');
                $('.init').html("You lose! You've been eaten!")
                cancelAnimationFrame(myReq);
            }
        }

        // Auto eating
        this.i = 0;
        if(this.findclose) {
            if(!this.closest) {
                this.closest = balls[0];
            }
            while(this.i < balls.length) {
                if(!balls.includes(this.closest)) {
                    this.closest = balls[0];
                }
                var closest = this.closest;
                if(DistSquared(this, balls[this.i]) < DistSquared(this, closest)) {
                    this.closest = balls[this.i];
                }
                this.i = this.i + 1;
                if(this.i === balls.length) {
                    if(this.closest.x > this.x+this.speed) {
                        this.x += this.speed;
                    } else if(this.closest.x < this.x-this.speed) {
                        this.x -= this.speed;
                    }
                    if(this.closest.y > this.y+this.speed) {
                        this.y += this.speed;
                    } else if(this.closest.y < this.y-this.speed) {
                        this.y -= this.speed;
                    }
                }
            }
        }
        this.draw(this.gx, this.gy);
    }

    this.draw = (gx,gy) => {
        this.gx = gx;
        this.gy = gy;
        ctx2.beginPath();
        ctx2.arc(this.x+gx, this.y+gy, this.radius, 0, Math.PI * 2, false);
        ctx2.fillStyle = this.color;
        ctx2.strokeStyle = 'rgba(0,0,0,0.4)';
        ctx2.lineWidth = stroke_width;
        ctx2.stroke();
        ctx2.fill();
        ctx2.closePath();
    }
}

function Ball(x,y,bradius,color) {
    this.x = x;
    this.y = y;
    this.radius = bradius;
    this.color = color;

    this.update = (gx,gy,bradius) => {
        this.gx = gx;
        this.gy = gy;
        this.radius = bradius;
        if(this.gx+this.x < w/2+player.radius && this.gy+this.y < h/2+player.radius && this.gx+this.x+player.radius*2 > w/2+player.radius && this.gy+this.y+player.radius*2 > h/2+player.radius) {
            for(i = 0; i < balls.length; i++) {
                if(balls[i] === this) {
                    balls.splice(i, 1);
                    addscore(1);
                }
            }
        }
        for(var i = 0; i < bots.length; i++) {
            bot = bots[i];
            if(bots.includes(bot)) {
                if(this.x < bot.x+player.radius && this.y < bot.y+player.radius && this.x+player.radius*2 > bot.x+player.radius && this.y+player.radius*2 > bot.y+player.radius) {
                    for(i = 0; i < balls.length; i++) {
                        if(balls[i] === this) {
                            balls.splice(i, 1);
                            bot.radius += 0.1;
                            score.find(u => u.id === bot.id).score += 1;
                        }
                    }
                }
            }
        }
        this.draw(this.gx, this.gy, this.radius);
    };

    this.draw = (gx,gy,bradius) => {
        this.radius = bradius;
        this.gx = gx;
        this.gy = gy;
        ctx.beginPath();
        ctx.arc(this.gx+this.x, this.gy+this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    };
}

function Surface(width,height,scale,x,y) {
    this.width = width;
    this.height = height;
    this.scale = scale;
    this.x = x;
    this.y = y;

    this.update = (gx,gy,scale) => {
        this.gx = gx;
        this.gy = gy;
        this.scale = scale;
        this.draw(this.gx,this.gy,this.scale);
    }

    this.draw = (gx,gy,scale) => {
        this.gx = gx;
        this.gy = gy;
        this.scale = scale;
        this.h = this.width*2/this.scale;
        this.v = this.height*2/this.scale;
        for(var i = 0; i <= this.v; i++) {
            for(var j = 0; j <= this.h; j++) {
                ctx.beginPath();
                ctx.rect(-w/2+this.gx+(j*this.scale), -w/2+this.gy+(i*this.scale), this.scale, this.scale);
                ctx.lineWidth = 0.3;
                ctx.strokeStyle = stroke_bg;
                ctx.stroke();
                ctx.closePath();
            }
        }
    }
}

function Map(x, y) {
    this.x = x;
    this.y = y;

    this.update = (x,y) => {
        this.x = x;
        this.y = y;
        this.draw(this.x, this.y);
    }

    this.draw = (x,y) => {
        this.x = x;
        this.y = y;
        mctx.beginPath();
        mctx.rect(0,0,w/7,h/7);
        mctx.fillStyle = color_bg;
        mctx.fill();
        mctx.closePath();

        mctx.beginPath();
        mctx.rect((w+this.x)/21,(h+this.y)/21,w/7,h/7);
        mctx.fillStyle = color_bg;
        mctx.strokeStyle = '#FF0000';
        mctx.lineWidth = 2;
        mctx.stroke();
        mctx.fill();
        mctx.closePath();

        mctx.beginPath();
        mctx.moveTo((w/2)/7, (h/7)/2-5);
        mctx.lineTo((w/2)/7, (h/7)/2+5)
        mctx.strokeStyle = '#333333';
        mctx.lineWidth = 3;
        mctx.stroke();
        mctx.closePath();

        mctx.beginPath();
        mctx.moveTo((w/7)/2-5, (h/2)/7);
        mctx.lineTo((w/7)/2+5, (h/2)/7)
        mctx.strokeStyle = '#333333';
        mctx.lineWidth = 3;
        mctx.stroke();
        mctx.closePath();
    }
}

canvas.height = h;
canvas.width = w;
canvas2.height = h;
canvas2.width = w;
minimap.height = h/7;
minimap.width = w/7;
wrapper.appendChild(minimap);
wrapper.appendChild(canvas2);
wrapper.appendChild(canvas);
minimap.className = 'minimap';
canvas2.className = 'players';

var gx = -w;
var gy = -h;
var dx = 0;
var dy = 0;

// FUNCTIONS

restart = () => {
    dx = 0;
    dy = 0;

    canvas = document.createElement('canvas');
    canvas2 = document.createElement('canvas');
    ctx = canvas.getContext('2d');
    ctx2 = canvas2.getContext('2d');
    w = document.documentElement.clientWidth;
    h = document.documentElement.clientHeight;

    minimap = document.createElement('canvas');
    mctx = minimap.getContext('2d');

    $('.minimap').remove();
    $('.players').remove();
    $('canvas').remove();

    canvas.height = h;
    canvas.width = w;
    canvas2.height = h;
    canvas2.width = w;
    player.x = w/2;
    player.y = h/2;
    minimap.height = h/7;
    minimap.width = w/7;
    wrapper.appendChild(minimap);
    wrapper.appendChild(canvas2);
    wrapper.appendChild(canvas);
    minimap.className = 'minimap';
    canvas2.className = 'players';

    cancelAnimationFrame(myReq);

    animate();
}

showhide = () => {
    if(mp === 1) {
        mp = 0;
        $('#minimap').removeAttr('checked');
        $('.minimap').css('width',0)
    } else {
        mp = 1;
        $('.minimap').css('width',w/7)
        $('#minimap').attr('checked',true);
    }
}

render = () => {
    score = [{username:username,score:0}];
    player = null;
    surface = null;
    bots = new Array();
    balls = new Array();
    gx = -w;
    gy = -h;
    radius = 50;
    speed = 6;
    scale = 150;
    ball_width = 10;
    mp = 1;

    var width = w*3;
    var height = h*3; 
    surface = new Surface(width,height,scale,gx,gy);

    var x = w/2;
    var y = h/2;
    var color = colors[Math.floor(Math.random() * Math.floor(8))];
    $('.player').css('background-color',color);
    player = new Player(x,y,50);

    for(var i = 0; i <= count_balls; i++) {
        x = Math.random() * ((width - 30) - 30) + 30; 
        y = Math.random() * ((height - 30) - 30) + 30;
        color = colors[Math.floor(Math.random() * Math.floor(8))];
        const ball = new Ball(x,y,ball_width,color);
        balls.push(ball);
    }

    for(var i = 1; i <= count_bots; i++) {
        x = Math.random() * ((width - (radius + stroke_width)) - (radius + stroke_width)) + (radius + stroke_width); 
        y = Math.random() * ((height - (radius + stroke_width)) - (radius + stroke_width)) + (radius + stroke_width);
        color = colors[i-1];
        const bspeed = 5.5;
        bot = new Bot(x,y,50,color,bspeed,i);
        bots.push(bot);
        const sbi = {id:i,username:`Bot#${i}`,score:0};
        score.push(sbi);
    }

    map = new Map(gx,gy);
}

animate = () => {
    myReq = requestAnimationFrame(animate);

    ctx.clearRect(0,0,w,h);
    ctx2.clearRect(0,0,w,h);
    mctx.clearRect(0,0,w/7,h/7);

    if(dx === 1) {
        if(gx+w*3 > (w/2+player.radius+stroke_width)) {
            gx -= speed;
        }
    } if(dx === -1) {
        if(gx < (w/2-radius-stroke_width)) {
            gx += speed;
        }
    } if(dy === 1) {
        if(gy < (h/2-radius-stroke_width)) {
            gy += speed;
        }
    } if(dy === -1) {
        if(gy+h*3 > (h/2+player.radius+stroke_width)) {
            gy -= speed;
        }
    }

    surface.update(gx, gy, scale);
    for(var i = 0; i < balls.length; i++) {
        balls[i].update(gx,gy,ball_width);
    }
    const scoreboard = score
    .sort((a,b) => b.score - a.score)
    .map((x, i) => {
        if(x.id) {
            return `<li><b>${i+1}</b>. <b style="color: ${(bots.find(b => b.id === x.id)) ? bots.find(b => b.id === x.id).color : ''}">${x.username}: </b>${x.score}</li>`;
        } else {
            return `<li><b>${i+1}</b>. <b>${x.username}: </b>${x.score}</li>`;
        }
    });

    score.sort((a,b) => a.score - b.score)
    .map(x => {
        const bot = bots.find(b => b.id === x.id);
        if(!bot) {
            player.update(radius);
        } else {
            bot.update(gx,gy);
        }
    });
    $('.score').html(scoreboard);

    if(mp === 1) {
        map.update(gx,gy);
    }
    if(balls.length === bots.length) {
        balls = [];
    }
    if(bots.length <= 0) {
        $('.modal').css('display','flex');
        $('.init').html('You won! There are no remaining AIs!');
        //cancelAnimationFrame(myReq);
    }
}

//myReq = requestAnimationFrame(animate);

//document.onload = render(); animate(); $('.username').html(username);

// LISTENERS

$(document).keydown(function(e){
    if (e.keyCode == 37) { 
        dx = -1;
    } if (e.keyCode == 39) { 
        dx = 1;
    } if (e.keyCode == 38) { 
        dy = 1;
    } if (e.keyCode == 40) { 
        dy = -1;
    }
});

$(document).on('keyup', function(e) {
    if (e.keyCode == 37) { 
        if(dx === -1) {
            dx = 0;
            return false;
        }
    } if (e.keyCode == 39) { 
        if(dx === 1) {
            dx = 0;
            return false;
        }
    } if (e.keyCode == 38) { 
        if(dy === 1) {
            dy = 0;
            return false;
        }
    } if (e.keyCode == 40) { 
        if(dy === -1) {
            dy = 0;
            return false;
        }
    }
});

addEventListener("resize", () => {
    restart();
});