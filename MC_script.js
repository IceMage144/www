const Sa = "rgb(255, 222, 82)";

var dirs = [[1, 0], [0, -1], [-1, 0], [0, 1]];
var pixelSize = 16;
var pixelBorder = 1;
var pheight = 32;
var pwidth = 36;
var rheight = pheight*pixelSize;
var rwidth = pwidth*pixelSize;
var MCount = 0;

class City {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.sprite = new Sprite("assets/City.png", x, y);
        this.destroyed = false;
    }
    start() {
        this.destroyed = false;
    }
    draw(ctx) {
        if (!this.destroyed)
            this.sprite.draw(ctx);
    }
}

class Missile {
    constructor(sx, sy, fx, fy, type, name) {
        let dist = Math.sqrt(sq(fx - sx) + sq(fy - sy));
        this.dx = (fx - sx)/dist;
        this.dy = (fy - sy)/dist;
        this.sx = sx;
        this.sy = sy;
        this.fx = fx;
        this.fy = fy;
        this.type = type;
        this.pixel = new Rectangle(sx-2, sy-2, 4, 4, (type == 0)? Rd : Db);
        this.name = name;
    }
    start() {}
    move() {
        let dist = sq(this.pixel.x - this.fx) + sq(this.pixel.y - this.fy);
        if (dist < 16)
            this.explode();
        else {
            let factor = (this.type + 1)*2;
            this.pixel.x += factor*this.dx;
            this.pixel.y += factor*this.dy;
        }
    }
    explode() {
        Game.del(this.name);
        if (this.type == 0)
            Field.delNearestCity(this.pixel.x, this.pixel.y);
        else {
            let name = "_Ex" + MCount;
            let ex = new Explosion(this.pixel.x+2, this.pixel.y+2, name);
            Game.add(ex, name);
            MCount++;
        }
    }
    draw(ctx) {
        this.move();
        ctx.beginPath();
        ctx.moveTo(this.sx, this.sy);
        ctx.lineTo(this.pixel.x+2, this.pixel.y+2);
        ctx.lineWidth = 1;
        ctx.strokeStyle = (this.type == 0)? Rd : Db;
        ctx.stroke();
        this.pixel.draw(ctx);
    }
}

class Base {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.dome = new Sprite("assets/Base.png", x, y);
        this.ammo = [];
        this.state = true;
        for (let i = 0; i < 3; i++)
            this.ammo.push(new Sprite("assets/Missile.png", x + 8*i + 20, y - 4));
        for (let i = 0; i < 4; i++)
            this.ammo.push(new Sprite("assets/Missile.png", x + 8*i + 16, y + 4));
        for (let i = 0; i < 5; i++)
            this.ammo.push(new Sprite("assets/Missile.png", x + 8*i + 12, y + 12));
    }
    start() {}
    draw(ctx) {
        this.dome.draw(ctx);
        for (let i = 0; i < this.ammo.length; i++)
            this.ammo[i].draw(ctx);
    }
    shoot() {
        if (!this.state)
            return;
        let cx = Cursor.x;
        let cy = Cursor.y;
        let name = "_FMi" + MCount;
        let m = new Missile(this.x + 30, this.y, cx, cy, 1, name);
        Game.add(m, name);
        this.ammo.pop();
        MCount++;
        this.state = (this.ammo.length != 0);
    }
}

class Explosion {
    constructor(x, y, name) {
        this.x = x;
        this.y = y;
        this.name = name;
        this.rad = 0;
        this.grow = 2;
    }
    start() {}
    draw(ctx) {
        this.rad += this.grow;
        if (this.rad >= 32)
            this.grow = -2;
        if (this.rad <= 0 && this.grow < 0)
            Game.del(this.name);
        this.destroyMissiles();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.rad, 0, 2 * Math.PI, false);
        ctx.fillStyle = Gd;
        ctx.fill();
    }
    destroyMissiles() {
        for (let k in Game.objs) {
            if (k.indexOf("_EMi") == 0) {
                let mi = Game.objs[k];
                let dist = sq(this.x - mi.pixel.x + 2) + sq(this.y - mi.pixel.y + 2);
                if (dist <= sq(this.rad))
                    Game.del(k);
            }
        }
    }
}

var Field = {
    floor : null,
    bases : [],
    counter : 0,
    cities : [],
    start() {
        this.floor = new Rectangle(0, rheight-20, rwidth, 20, Sa);
        this.bases = [];
        for (let i = 0; i < 3; i++)
            this.bases.push(new Base((240*i)+16, rheight-40));
        this.cities = []
        for (let i = 0; i < 3; i++)
            this.cities.push(new City(56*(i+1)+32, rheight-42));
        for (let i = 3; i < 6; i++)
            this.cities.push(new City(56*(i+1)+100, rheight-42));
    },
    draw(ctx) {
        this.floor.draw(ctx);
        for (let i = 0; i < this.bases.length; i++)
            this.bases[i].draw(ctx);
        for (let i = 0; i < this.cities.length; i++)
            this.cities[i].draw(ctx);
    },
    checkGameOver() {
        for (let i = 0; i < this.cities.length; i++) {
            if (!this.cities[i].destroyed)
                return false;
        }
        return true;
    },
    delNearestCity(x, y) {
        let mdist = 10000000;
        let idx = -1;
        for (let i = 0; i < this.cities.length; i++) {
            let dist = sq(this.cities[i].x - x) + sq(this.cities[i].y - y);
            if (dist < mdist) {
                mdist = dist;
                idx = i;
            }
        }
        if (idx == -1)
            return;
        if (!this.cities[idx].destroyed)
            this.cities[idx].destroyed = true;
        if (this.checkGameOver())
            gameover();
    },
    nearestBase(x, y) {
        let mdist = 10000000;
        let base = null;
        for (let i = 0; i < this.bases.length; i++) {
            let dist = sq(this.bases[i].x - x) + sq(this.bases[i].y - y);
            if (dist < mdist && this.bases[i].state) {
                mdist = dist;
                base = this.bases[i];
            }
        }
        return base;
    },
    getRandomCity() {
        if (this.checkGameOver())
            return null;
        let r = Math.floor(Math.random()*6);
        var city = this.cities[r];
        while (city.destroyed) {
            r = Math.floor(Math.random()*6);
            city = this.cities[r];
        }
        return city;
    }
}

var Cursor = {
    x : 0,
    y : 0,
    sprite : null,
    next : [0, 0],
    score : 0,
    start() {
        this.x = Math.floor(rwidth/2);
        this.y = Math.floor(rheight/2);
        this.next = [0, 0];
        this.sprite = new Rectangle(this.x - 2, this.y - 2, 4, 4, Wh);
    },
    draw(ctx) {
        this.x = Math.min(rwidth, Math.max(0, this.x + 8*this.next[0]));
        this.y = Math.min(rheight, Math.max(0, this.y + 8*this.next[1]));
        this.sprite.x = this.x - 2;
        this.sprite.y = this.y - 2;
        this.sprite.draw(ctx);
    },
    shoot() {
        let base = Field.nearestBase(Cursor.x, Cursor.y);
        if (base)
            base.shoot();
    }
}

var Planes = {
    start() {
        this.counter = 0;
        this.interval = 0;
    },
    draw(ctx) {
        if (this.counter == this.interval) {
            let sx = Math.floor(Math.random()*rwidth);
            let dest = Field.getRandomCity();
            if (!dest) return;
            let name = "_EMi" + MCount;
            Game.add(new Missile(sx, 0, dest.x + 24, dest.y + 32, 0, name), name);
            this.counter = 0;
            this.interval = Math.floor(10 + Math.random()*6);
            MCount++;
        }
        else
            this.counter++;
    }
}

var Game = new Canvas("game", rwidth, rheight);

var Title1 = new Text((rwidth-210)/2, 110, "Missile", Wh, "50px bitOperatorBold");
var Title2 = new Text((rwidth-260)/2, 160, "Command", Wh, "50px bitOperatorBold");
var Paused = new Text((rwidth-200)/2, 110, "Paused", Wh, "50px bitOperator");
var Score = new Text(30, 50, function() {
    return "Score: " + Cursor.score;
}, Wh, "30px bitOperator");

var Background = new Rectangle(0, 0, rwidth, rheight, Bl);
var Dim = new Rectangle(0, 0, rwidth, rheight, Op);
var MenuBg = new Rectangle(0, 0, rwidth, rheight, Bl);

var Play = new Button("assets/Play.png", (rwidth-160)/2, 280, startGame);
var Restart = new Button("assets/Restart.png", (rwidth-192)/2, 160, showMenu);

function startGame() {
    MCount = 0;
    Game.reset();
    Game.setDrawInterval(100);
    Game.ingame = true;
    // Game adds
    Game.add(Background, "Background");
    Game.add(Field, "Field");
    Game.add(Cursor, "Cursor");
    Game.add(Planes, "Planes");
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
        Game.setDrawInterval(10);
        Game.paused = false;
    }
}

function showMenu() {
    Game.reset();
    Game.add(MenuBg, "Background");
    Game.add(Title1, "Title1");
    Game.add(Title2, "Title2");
    Game.add(Play, "B_Play");
}

function main() {
    Game.setInputInterval(10);
    Game.bind(37, function() { Cursor.next[0] = -1; }, KEY_PRESS);
    Game.bind(38, function() { Cursor.next[1] = -1; }, KEY_PRESS);
    Game.bind(39, function() { Cursor.next[0] = 1; }, KEY_PRESS);
    Game.bind(40, function() { Cursor.next[1] = 1; }, KEY_PRESS);
    Game.bind(37, function() { Cursor.next[0] = 0; }, KEY_UP);
    Game.bind(38, function() { Cursor.next[1] = 0; }, KEY_UP);
    Game.bind(39, function() { Cursor.next[0] = 0; }, KEY_UP);
    Game.bind(40, function() { Cursor.next[1] = 0; }, KEY_UP);
    Game.bind(80, function() { if (Game.ingame) pause(); }, KEY_DOWN);
    Game.bind(90, function() { if (Game.ingame) Cursor.shoot(); }, KEY_DOWN);
    showMenu();
    //Game.bind(83, function() { Game.stop(); }, KEY_DOWN);
    //Game.bind(75 , function() { for (let k in Game.objs) console.log(k); console.log("=======")}, KEY_DOWN);
}

window.onload = main;
