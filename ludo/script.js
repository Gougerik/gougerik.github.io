// CONSTANT VARIABLES

const start = [
    // BLUE TEAM
    [25,25],[75,25],[25,75],[75,75],
    // RED TEAM
    [425,375],[475,375],[425,425],[475,425]
];

const fields = [
    [25, 175],[75, 175],[125, 175],[175, 175],[225, 175],[275, 175],[325, 175],[375, 175],[425, 175],[475, 175],[475, 225],[475, 275],[425, 275],[375, 275],[325, 275],[275, 275],[225,275],[175, 275],[125, 275],[75, 275],[25, 275],[25,225]
]

const home = [
    // BLUE TEAM
    [75,225],[125,225],[175,225],[225,225],
    // RED TEAM
    [425,225],[375,225],[325,225],[275,225]
];

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 500;
canvas.height = 450;
document.getElementById('wrapper').appendChild(canvas);

// CONSTRUCTORS

function Character(field,team) {
    this.out = false;
    this.field = field;
    this.team = team;
    this.home = false;

    this.start = () => {
        this.out = true;
        this.field = this.team ? 11 : 0;

        // Vybiť nepriateľa vonku
        const toKick = characters.filter(i => i.field === this.field && i.team !== this.team && i.out === true);
        if(toKick.length >= 1) {
            for(let i = 0; i < toKick.length; i++) {
                toKick[i].kick();
            }
        } 
        this.render();
    }

    this.move = amount => {
        // BLUE HOME
        if(this.field + amount > 21 && !this.team) {
            this.Home();
        // RED HOME
        } else if(this.field < 11 && this.field + amount > 10 && this.team) {
            this.Home();
        // RED PASS START
        } else if(this.field + amount > 21 && this.team) {
            const remain = this.field + amount - 22;
            this.field = remain;
        } else {
            this.field += amount;
        }

        // KICK ENEMY
        const toKick = characters.filter(i => i.field === this.field && i.team !== this.team && i.out === true);
        if(toKick.length >= 1 && !this.home) {
            for(let i = 0; i < toKick.length; i++) {
                toKick[i].kick();
            }
        } 
        this.render();
    }

    this.Home = () => {
        this.field = characters.findIndex(i => i === this);
        this.out = false;
        this.home = true;
    }

    this.kick = () => {
        this.field = characters.findIndex(i => i === this);
        this.out = false;
    }

    this.render = () => {
        ctx.beginPath();
        if(this.out) {
            ctx.arc(fields[this.field][0], fields[this.field][1], 15, Math.PI * 2, false);
        } else if(this.home) {
            ctx.arc(home[this.field][0], home[this.field][1], 15, Math.PI * 2, false);
        } else {
            ctx.arc(start[this.field][0], start[this.field][1], 15, Math.PI * 2, false);
        }
        ctx.fillStyle = this.team ? '#800000' : '#0000FF';
        ctx.fill();
        ctx.closePath();
    }
}

// VARIABLES

let characters = new Array();
let player = false;
let move = false;
let stop = false;
let amount = 0;
let random = 0;

// FUNCTIONS

render = () => {
    characters = [];
    player = false;
    move = false;
    random = 0;
    amount = 0;
    for(let i = 0; i < 4; i++) {
        const team = false;
        const field = i;
        characters.push(new Character(field,team));
    }
    for(let i = 4; i < 8; i++) {
        const team = true;
        const field = i;
        characters.push(new Character(field,team));
    }
}

animate = () => {
    !stop && requestAnimationFrame(animate);
    ctx.clearRect(0,0,500,450);
    document.getElementById('player').style.backgroundColor = player ? '#800000' : '#0000FF';
    for(let i = 0; i < characters.length; i++) {
        characters[i].render();
    }
    if(characters.filter(i => i.team === false && i.home === true).length === 4) {
        win(false);
    } else if(characters.filter(i => i.team === true && i.home === true).length === 4) {
        win(true);
    }
}

win = team => {
    stop = true;
    document.getElementById('button').disabled = true;
    document.getElementById('win').style.transform = 'unset';
    document.getElementById('winner').innerHTML = team ? 'červený' : 'modrý';
}

Throw = () => {
    if(!move) {
        const indicator = document.getElementById('amount');
        random = Math.floor(Math.random() * (6 - 1 + 1)) + 1;

        indicator.style.color = random === 6 ? '#F2D04D' : '#fff';
        indicator.innerHTML = random;

        const dispo = characters.filter(i => i.out === false && i.home === false && i.team === player);
        const out = characters.filter(i => i.out === true && i.team === player); 

        // Hráč nemá na ploche žiadne figúrky a padla šestka
        if(dispo.length >= 1 && out.length === 0 && random === 6) {
            dispo[0].start();
            player = !player;
        // Padla šestka a hráč má na ploche jednu alebo viac figúrok a padla šestka (hráč volí)
        } else if(out.length >= 1 && random === 6) {
            move = true;
            document.getElementById('button').disabled = true;
        } else {
            // Hráč má na ploche len jednu figúrku a nepadla šestka
            if(out.length === 1) {
                out[0].move(random);
                player = !player;
            // Hráč má na ploche viacero figúriek a nepadla šestka (hráč volí)
            } else if(out.length > 1) {
                move = true;
                document.getElementById('button').disabled = true;
            // Hráč ešte nemá žiadne figúrky na ploche alebo ich už má všetky v domove (skip)
            } else {
                player = !player;
            }
        }
    }
}

// LISTENERS

canvas.addEventListener('mousedown', e => {
    if(move) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const field = fields.findIndex(i => x > i[0]-25 && x < i[0]+25 && y > i[1]-25 && y < i[1]+25);
        const dispo = start.findIndex(i => x > i[0]-25 && x < i[0]+25 && y > i[1]-25 && y < i[1]+25);

        if(random === 6) {
            if(field >= 0) {
                // Voľba figúrky ktorá sa pohne + ďalší hod kockou lebo padla šestka
                const character = characters.find(i => i.team === player && i.field === field && i.out === true);
                if(character) {
                    character.move(random);
                    move = false;
                    document.getElementById('button').disabled = false;
                }
            }
            if(dispo >= 0) {
                // Spawn figúrky na začiatočné políčko
                const character = characters.find(i => i.team === player && i.field === dispo && i.out === false);
                if(character) {
                    character.start();
                    move = false;
                    document.getElementById('button').disabled = false;
                    player = !player;
                }
            }
        } else {
            // Voľba figúrky ktorá sa pohne
            if(field >= 0) {
                const character = characters.find(i => i.team === player && i.field === field && i.out === true);
                if(character) {
                    character.move(random);
                    move = false;
                    document.getElementById('button').disabled = false;
                    player = !player;
                }
            }
        }
    }
});

document.onload = render(); animate();