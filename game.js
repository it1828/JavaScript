//Nastavení ID
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
const start = document.getElementById('start');
const left = document.getElementById('left');
const right = document.getElementById('right');
const formDelka =  document.getElementById("formDelka");
// Objekt posouvací plošiny
let plosina = {
    //Nastavení proměnných pro plošinu
    delka: 0,
    vyska: 15,
    posun: 40,
    x: canvas.width / 3,
    y: canvas.height - 30,
    points: 0, //Score
    pomocna: 0,
    restart: 0, //Pomocná proměnná pro zabránění vstupu z klávesnice při startu a konci hry
    round: 0, // Kola pro následné přidání rychlosti
// Interval pro padání kuliček
    start: function () {
        this.startTime = new Date();
        this.timer = setInterval(() => {
            repaint();
            //Vypisování akutálního skore a času na canvas
            if(plosina.restart == 1){
                ctx.fillStyle = 'red';
                ctx.font = '30px VT323';
                ctx.fillText(`Score: ${plosina.points}`, canvas.width - 150, 40);
               let actualTime = new Date();
                let time = actualTime.getTime() - this.startTime.getTime();
                ctx.fillText(`Time: ${time/1000}`, 20, 40);
            }                 
            balls.paint();
        }, 30);
    },
// Vykreslení plošiny
    paint: function () {
        if (plosina.restart == 1) {
            ctx.fillStyle = 'blue';
            ctx.fillRect(this.x, this.y, this.delka, this.vyska);
        }
    },
    //Switch k ovládání klávesnicí
    move: function (event) {
        switch (event.code) {
            case 'ArrowLeft': //Levá šipka
                if (this.x >= 0)
                    plosina.x -= this.posun;
                else
                    break;

                break;
            case 'ArrowRight'://Pravá šipka
                if (!(this.x >= (canvas.width - this.delka)))
                    plosina.x += this.posun;
                else
                    break;

                break;
            case 'Enter'://Enter
                if (this.restart == 0) {
                    plosina.restart = 1;
                    repaint();
                    plosina.paint();
                    plosina.start();
                }

                break;
        }
    },
    //Funkce při konci hry
    stop: function () {
        //Zastavení intervalu
        clearInterval(this.timer);
        this.timer = null;
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'red';
        ctx.font = '100px VT323';
        ctx.fillText(`Game over`, 75, canvas.height / 2);
        ctx.font = '50px VT323';
        ctx.fillText(`Score: ${plosina.points}`, 160, (canvas.height / 2) + 50);
        balls.y = 550;
        start.innerHTML = "You failed :(";
        this.audio = new Audio('end.wav');
        this.audio.play();  
        let actualTime = new Date();
        let time = actualTime.getTime() - this.startTime.getTime();
        ctx.fillText(`Time: ${time/1000}`, 140, (canvas.height / 2) + 100);  
        ctx.font = '30px VT323'; 
        ctx.fillText(`Press \"F5\" to restart`, 130, 470);
        this.restart = 2;
    },
    //Funce detekce žluté kuličky
    plus: function () {
        balls.round++;
        balls.y = 550;
        this.points++; //Přidání score
        this.pomocna++;
        this.audio = new Audio('point.wav');
        this.audio.play();
    }
}
// Ovládání klávesnicí
document.addEventListener("keydown", function (event) {
    plosina.move(event);
    if(plosina.restart == 0)
    plosina.paint();
});
// Ovládání myší
canvas.addEventListener('mousemove', function (ev) {
    plosina.x = ev.offsetX - plosina.delka / 2;
});
// Funkce překreslí canvas, a kontroluje detekci kuliček 
function clearCanvas(fillColor) {
    ctx.fillStyle = fillColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    plosina.paint();
    if (balls.y > 473 && balls.y < 500 && balls.color == 'yellow') {
        plosina.pomocna++;
    }
//Kontrola zda-li "neporpadla" žlutá kulička
    if (plosina.pomocna > plosina.points) {
        plosina.stop();
    }
    //Kontrola kolize
    if (balls.y -5 >= (canvas.height - 30 - plosina.vyska) && balls.x >= plosina.x && balls.x <= plosina.x +plosina.delka) {
        if (balls.color == 'yellow') { //Kolize žluté kuličky
            plosina.plus();
        }
        if (balls.color == 'red') {// Kolize červené kuličky
            console.log("cervena")
            plosina.stop();
        }
    }
}

function repaint() {
    clearCanvas("black"); //Barva překreslení canvasu
}
// Objekt kuličky
let balls = {
    ctx: canvas.getContext("2d"),
    x: Math.round(Math.random() * plosina.y),
    speedRed: 6,
    speedYellow: 8,
    radius: 15,
    color: (Math.random() >= 0.7) ? 'red' : 'yellow',
    y: 0,
    round: 0,
// Funkce vykresluje kuličky a mění proměnné
    paint: function () {
        //Vykreslení kuličky
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        if (this.color == 'red') {

            this.speedRed = this.speedRed;
            this.y += this.speedRed;
        };
        if (this.color == 'yellow') {

            this.speedYellow = this.speedYellow;
            this.y += this.speedYellow;
        };
        //Zrychlení kuliček
        if (this.round == 4) {
            this.round = 0;
            this.speedRed += 2;
            this.speedYellow += 2;
   
        }


        if (this.y > canvas.height + 10) {
            this.x = Math.round(Math.random() * plosina.y);
            this.color = (Math.random() >= 0.7) ? 'red' : 'yellow';
            this.y = 0;
        }
    },
}
//Spuštění hry
start.addEventListener('click', () => {
    if (plosina.restart == 0) {
        if( formDelka.value >= 100 &&  formDelka.value <=200)
            plosina.delka = formDelka.value;
        else
            plosina.delka = 150;
        plosina.restart = 1;
        repaint();
        plosina.paint();
        plosina.start();
    }
})
//Vypsání textu na canvas
ctx.fillStyle = 'red';
ctx.font = '50px VT323';
ctx.fillText(`Press "Start"`, canvas.width / 2 - 125, canvas.height / 2);
ctx.fillText(`or Enter`, canvas.width / 2 - 90, (canvas.height / 2) + 40);
