var dirs = [[-1, 0], [0, -1], [1, 0], [0, 1]];
var pixelSize = 16;
var pheight = 32;
var pwidth = 32;
var rheight = pheight*pixelSize;
var rwidth = pwidth*pixelSize;
var pixelBorder = 1;

var difs = [150, 100, 50];
var dif = -1;

function wall(x, y) {
    return x < 0 || y < 0 || x >= pwidth || y >= pheight;
}

class Queue {
    constructor()  {
        this.size = 0;
        this.vect = [];
    }
    enqueue(e) {
        this.vect.push(e);
        this.size++;
    }
    dequeue() {
        this.size--;
        return this.vect.splice(0, 1)[0];
    }
    isEmpty() {
        return this.size == 0;
    }
    getEnd() {
        return this.vect[this.size-1];
    }
    toString() {
        return ArraytoString(this.vect);
    }
}

class Pixel {
    constructor(x, y, col, back) {
        this.x = x;
        this.y = y;
        this.col = col;
        this.back = back;
    }
    start() {}
    draw(ctx) {
        if (this.back !== undefined) {
            ctx.fillStyle = this.back;
            ctx.fillRect(this.x*pixelSize, this.y*pixelSize, pixelSize, pixelSize);
        }
        ctx.fillStyle = this.col;
        ctx.fillRect(this.x*pixelSize+pixelBorder, this.y*pixelSize+pixelBorder, pixelSize-2*pixelBorder, pixelSize-2*pixelBorder);
    }
}

var Snake = {
    body : null,
    newDir : 2,
    dir : 2,
    still : false,
    start() {
        this.still = false;
        this.dir = 2;
        this.newDir = 2;
        this.body = new Queue();
        for (let i = 5; i < 10; i++)
            this.body.enqueue(new Pixel(i, 8, Mb));
    },
    move() {
        for (let i = 0; i < 4; i++) {
            if (this.newDir == i && this.dir != (i+2)%4)
                this.dir = this.newDir;
        }
        let head = this.body.getEnd();
        let next = [head.x + dirs[this.dir][0], head.y + dirs[this.dir][1]];
        if (this.inter(next[0], next[1]) || wall(next[0], next[1])) {
            this.still = true;
            gameover();
        }
        else {
            if (Apple.x == next[0] && Apple.y == next[1])
                Apple.reset();
            else
                this.body.dequeue();
            this.body.enqueue(new Pixel(next[0], next[1], Mb));
        }
    },
    draw(ctx) {
        if (!this.still)
            this.move();
        for (let i = 0; i < this.body.size; i++)
            this.body.vect[i].draw(ctx);
    },
    inter(x, y) {
        for (let i = 0; i < this.body.size; i++) {
            if (x == this.body.vect[i].x && y == this.body.vect[i].y)
                return true;
        }
        return false;
    }
}

var Apple = {
    x : 0,
    y : 0,
    sqr : null,
    start() {
        this.reset();
    },
    reset() {
        do {
            this.x = Math.floor(Math.random()*pwidth);
            this.y = Math.floor(Math.random()*pheight);
            this.sqr = new Pixel(this.x, this.y, Rd);
        } while(Snake.inter(this.x, this.y));
        //this.sqr.draw();
    },
    draw(ctx) {
        this.sqr.draw(ctx);
    }
}

var Game = new Canvas("game", rwidth, rheight);

var Title = new Text(170, 110, "Snake", Bl, "50px magicPixelBold");
var Paused = new Text((rwidth-200)/2, 110, "Paused", Bl, "50px magicPixel");
var Score = new Text(30, 50, function() {
    let score = (Snake.body.size - 5)*100;
    return "Score: " + score.toString();
}, Bl, "30px magicPixel");

var Background = new Rectangle(0, 0, rwidth, rheight, Wh);
var Dim = new Rectangle(0, 0, rwidth, rheight, Op2);
var MenuBg = new Rectangle(0, 0, rwidth, rheight, Ag);

var Easy = new Button("assets/Easy.png", (rwidth-160)/2, 230, startGame, 0);
var Medium = new Button("assets/Medium.png", (rwidth-160)/2, 300, startGame, 1);
var Hard = new Button("assets/Hard.png", (rwidth-160)/2, 370, startGame, 2);
var Restart = new Button("assets/Restart.png", (rwidth-192)/2, 160, showMenu);

function startGame(num) {
    Game.reset();
    Game.setDrawInterval(difs[num]);
    dif = num;
    Game.ingame = true;
    Game.add(Background, "Background");
    Game.add(Snake, "Snake");
    Game.add(Apple, "Apple");
    Game.add(Score, "Score");
}

function gameover() {
    Game.add(Dim, "Dim");
    Game.add(Restart, "B_Restart");
    Game.draw();
    Game.stopDraw();
    Game.ingame = false;
}

function pause() {
    if (!Game.paused) {
        Game.add(Dim, "Dim");
        Game.add(Paused, "Paused");
        Game.stopDraw();
        Game.paused = true;
    }
    else {
        Game.del("Dim");
        Game.del("Paused");
        Game.setDrawInterval(difs[dif]);
        Game.paused = false;
    }
}

function showMenu() {
    Game.reset();
    Game.add(MenuBg, "Background");
    Game.add(Title, "Title");
    Game.add(Easy, "B_Easy");
    Game.add(Medium, "B_Medium");
    Game.add(Hard, "B_Hard");
}

function main() {
    Game.setInputInterval(10);
    Game.bind(37, function() { Snake.newDir = 0; }, KEY_DOWN);
    Game.bind(38, function() { Snake.newDir = 1; }, KEY_DOWN);
    Game.bind(39, function() { Snake.newDir = 2; }, KEY_DOWN);
    Game.bind(40, function() { Snake.newDir = 3; }, KEY_DOWN);
    Game.bind(80, function() { pause(); }, KEY_DOWN);
    showMenu();
}

/*function resize(num) {
    let div = document.getElementById("gamediv");
    pixelSize += num;
    rheight = pixelSize*pheight;
    rwidth = pixelSize*pwidth;
    div.height = rheight;
    div.width = rwidth;
    Game.canvas.height = rheight;
    Game.canvas.width = rwidth;
    Game.draw();
}*/

window.onload = main;
