const RADIUS = 10;
const SPEED = 5;
const COLORS = ['aqua','aqua','aqua','lime','lime','lime'];

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
const w = document.documentElement.clientWidth;
const h = document.documentElement.clientHeight;

// CONSTRUCTORS
function Pixel(color) {
    this.x = w/2;
    this.y = h/2;
    this.color = color;

    this.go = () => {
        this.x += Math.random() * (SPEED - (-SPEED)) + -SPEED;
        this.y += Math.random() * (SPEED - (-SPEED)) + -SPEED;
        ctx.beginPath();
        ctx.arc(this.x, this.y, RADIUS, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
}

canvas.className = 'pixels';
canvas.height = h;
canvas.width = w;

let stop = false;
let pixels = [];

render = () => {
    document.getElementById('wrapper').appendChild(canvas);
    pixels = new Array();
    for(let i = 0; i <= COLORS.length; i++) {
        const color = COLORS[i];
        const pixel = new Pixel(color);
        pixels.push(pixel);
    }
}

animate = () => {
    if(!stop) {
        myReq = requestAnimationFrame(animate);
    }
    // ctx.clearRect(0,0,w,h);
    for(let i = 0; i < pixels.length; i++) {
        pixels[i].go();
    }
}

Stop = () => {
    stop = true;
    const p = document.createElement('p');
    p.innerHTML = 'This is your country :)';
    document.getElementById('button').replaceWith(p)
}

document.onload = render(); animate();