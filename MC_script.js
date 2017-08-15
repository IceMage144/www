var dirs = [[1, 0], [0, -1], [-1, 0], [0, 1]];
var pixelSize = 16;
var pixelBorder = 1;
var pheight = 32;
var pwidth = 32;
var rheight = pheight*pixelSize;
var rwidth = pwidth*pixelSize;

class City {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.sprite = new Sprite("assets/City.png", x, y);
    }
    start() {}
    draw(ctx) {
        this.sprite.draw(ctx);
    }
}

class Missile {
    constructor(sx, sy, fx, fy) {
        let dx = fx - sx;
        let dy = fy - sy;
        let dist = Math.sqrt(dx*dx + dy*dy);
        this.dx = dx/dist;
        this.dy = dy/dist;
        this.sx = sx;
        this.sy = sy;
        this.pixel = new Rectangle(sx-2, sy-2, 4, 4, Gd);
    }
    start() {}
    move() {
        this.pixel.x += this.dx;
        this.pixel.y += this.dy;
    }
    draw(ctx) {
        this.move();
        ctx.beginPath();
        ctx.moveTo(this.sx, this.sy);
        ctx.lineTo(this.x, this.y);
        ctx.lineWidth = 10;
        ctx.strokeStyle = Gd;
        ctx.stroke();
        this.pixel.draw(ctx);
    }
}

var Game = new Canvas("game", rwidth, rheight);

var Title = new Text((rwidth-200)/2, 110, "Missile\nCommand", Wh, "50px bitOperatorBold");
var Paused = new Text((rwidth-200)/2, 110, "Paused", Wh, "50px bitOperator");

var Background = new Rectangle(0, 0, rwidth, rheight, Bl);
var Dim = new Rectangle(0, 0, rwidth, rheight, Op);
var MenuBg = new Rectangle(0, 0, rwidth, rheight, Bl);

var Play = new Button("assets/Play.png", (rwidth-160)/2, 230, startGame);
var Restart = new Button("assets/Restart.png", (rwidth-192)/2, 160, showMenu);

var Cities = []
for (let i = 0; i < 6; i++)
    Cities.push(new City(70*(i+1), 480));

var TMissile = new Missile(0, 0, 300, 300);

function startGame() {
    Game.reset();
    Game.setDrawInterval(100);
    Game.ingame = true;
    // Game adds
    Game.add(Background, "Background");
    for (let i = 0; i < 6; i++)
        Game.add(Cities[i], "City"+i);
    Game.add(TMissile, "TM");
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
        Game.setDrawInterval(100);
        Game.paused = false;
    }
}

function showMenu() {
    Game.reset();
    Game.add(MenuBg, "Background");
    Game.add(Title, "Title");
    Game.add(Play, "B_Play");
}

function main() {
    Game.setInputInterval(10);
    Game.bind(37, function() { Cursor.nextDir = 2; }, KEY_PRESS);
    Game.bind(39, function() { Cursor.nextDir = 0; }, KEY_PRESS);
    Game.bind(40, function() { Cursor.nextDir = 3; }, KEY_PRESS);
    //Game.bind(83, function() { Game.stop(); }, KEY_DOWN);
    Game.bind(80, function() { if (Game.ingame) pause(); }, KEY_DOWN);
    Game.bind(90, function() { if ("Cursor" in Game.objs) Game.objs["Cursor"].rotateL(); }, KEY_DOWN);
    Game.bind(88, function() { if ("Cursor" in Game.objs) Game.objs["Cursor"].rotateR(); }, KEY_DOWN);
    showMenu();
}

window.onload = main;
