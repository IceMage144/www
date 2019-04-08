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
    update(dt) {}
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
        this.lastDist = sq(sx - fx) + sq(sy - fy);
    }
    start() {}
    move() {
        let pos = this.getPos();
        let dist = sq(pos[0] - this.fx) + sq(pos[1] - this.fy);
        if (dist < 16 || this.lastDist < dist)
            this.explode();
        else {
            let factor = (this.type == 0)? LevelManager.level/2 : 8;
            this.pixel.x += factor*this.dx;
            this.pixel.y += factor*this.dy;
        }
        this.lastDist = dist;
    }
    getPos() {
        return [this.pixel.x+2, this.pixel.y+2];
    }
    explode() {
        Game.del(this.name);
        let pos = this.getPos();
        if (this.type == 0)
            Field.delNearestCity(pos[0], pos[1]);
        else {
            let name = "_Ex" + MCount;
            let ex = new Explosion(pos[0], pos[1], name);
            Game.add(ex, name);
            MCount++;
        }
    }
    trySplit() {
        if (this.type == 0 && Math.floor(Math.random()*5000) == 0) {
            let c = Field.getRandomCity();
            let pos = this.getPos();
            let name = "_EMi" + MCount;
            let m = new Missile(pos[0], pos[1], c.x + 24, c.y + 32, 0, name);
            Game.add(m, name);
            MCount++;
        }
    }
    update(dt) {
        this.move();
        this.trySplit();
    }
    draw(ctx) {
        let pos = this.getPos();
        ctx.beginPath();
        ctx.moveTo(this.sx, this.sy);
        ctx.lineTo(pos[0], pos[1]);
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
    }
    start() {
        let x = this.x;
        let y = this.y;
        this.ammo = [];
        this.state = true;
        for (let i = 0; i < 3; i++)
            this.ammo.push(new Sprite("assets/Missile.png", x + 8*i + 20, y - 4));
        for (let i = 0; i < 4; i++)
            this.ammo.push(new Sprite("assets/Missile.png", x + 8*i + 16, y + 4));
        for (let i = 0; i < 5; i++)
            this.ammo.push(new Sprite("assets/Missile.png", x + 8*i + 12, y + 12));
    }
    update(dt) {}
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
    update(dt) {
        this.rad += this.grow;
        if (this.rad >= 32)
            this.grow = -2;
        if (this.rad <= 0 && this.grow < 0)
            Game.del(this.name);
        this.destroyMissiles();
    }
    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.rad, 0, 2 * Math.PI, false);
        ctx.fillStyle = Gd;
        ctx.fill();
    }
    destroyMissiles() {
        // TODO: Don't use Game.layers anymore
        for (let k in Game.layers[0].objs) {
            if (k.indexOf("_EMi") == 0) {
                // TODO: Don't use Game.layers anymore
                let pos = Game.layers[0].objs[k].getPos();
                let dist = sq(this.x - pos[0]) + sq(this.y - pos[1]);
                if (dist <= sq(this.rad)) {
                    Game.del(k);
                    LevelManager.score += 30;
                }
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
        this.refillAmmo();
        this.cities = []
        for (let i = 0; i < 3; i++)
            this.cities.push(new City(56*(i+1)+32, rheight-42));
        for (let i = 3; i < 6; i++)
            this.cities.push(new City(56*(i+1)+100, rheight-42));
    },
    refillAmmo() {
        for (let i = 0; i < this.bases.length; i++)
            this.bases[i].start();
    },
    draw(ctx) {
        this.floor.draw(ctx);
        for (let i = 0; i < this.bases.length; i++)
            this.bases[i].draw(ctx);
        for (let i = 0; i < this.cities.length; i++)
            this.cities[i].draw(ctx);
    },
    update(dt) {},
    checkGameOver() {
        return (this.getAliveCities() == 0);
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
        return city;
    },
    getTotalAmmo() {
        let b = this.bases;
        return b[0].ammo.length + b[1].ammo.length + b[2].ammo.length;
    },
    getAliveCities() {
        let count = 0;
        for (let i = 0; i < this.cities.length; i++) {
            if (!this.cities[i].destroyed)
                count++;
        }
        return count;
    }
}

var Cursor = {
    x : 0,
    y : 0,
    sprite : null,
    next : [0, 0],
    start() {
        this.x = Math.floor(rwidth/2);
        this.y = Math.floor(rheight/2);
        this.next = [0, 0];
        this.sprite = new Rectangle(this.x - 2, this.y - 2, 4, 4, Wh);
    },
    update(dt) {
        this.x = Math.min(rwidth, Math.max(0, this.x + 8*this.next[0]));
        this.y = Math.min(rheight, Math.max(0, this.y + 8*this.next[1]));
        this.sprite.x = this.x - 2;
        this.sprite.y = this.y - 2;
    },
    draw(ctx) {
        this.sprite.draw(ctx);
    },
    shoot() {
        let base = Field.nearestBase(Cursor.x, Cursor.y);
        if (base)
            base.shoot();
    }
}

var Planes = {
    counter : 0,
    interval : 0,
    missiles : 10,
    start() {
        this.counter = 0;
        this.interval = 0;
        this.missiles = 10;
    },
    draw(ctx) {},
    update(dt) {
        if (this.missiles == 0) return;
        if (this.counter == this.interval) {
            let sx = Math.floor(Math.random()*rwidth);
            let dest = Field.getRandomCity();
            if (!dest) return;
            let name = "_EMi" + MCount;
            Game.add(new Missile(sx, 0, dest.x + 24, dest.y + 32, 0, name), name);
            this.counter = 0;
            this.interval = Math.floor(10 + Math.random()*6);
            MCount++;
            this.missiles--;
        }
        else
            this.counter++;
    }
}

var LevelManager = {
    level : 1,
    score : 0,
    money : 0,
    start() {
        this.score = 0;
        this.level = 1;
        this.money = 0;
    },
    draw(ctx) {},
    update(dt) {
        if (this.enemyMissiles() == 0 && Planes.missiles == 0 && Field.getAliveCities() != 0) {
            // TODO: Don't use Game.layers anymore
            for (let k in Game.layers[0].objs) {
                if (k.indexOf("_FMi") == 0)
                    Game.del(k);
            }
            this.level++;
            Planes.missiles = (Math.ceil(this.level/5) + 1)*5;
            this.score += Field.getAliveCities()*100 + Field.getTotalAmmo()*10;
            Field.refillAmmo();
            MCount = 0;
        }
    },
    enemyMissiles() {
        let count = 0;
        // TODO: Don't use Game.layers anymore
        for (let k in Game.layers[0].objs) {
            if (k.indexOf("_EMi") == 0)
                count++;
        }
        return count;
    }
}

var Game = new Canvas("game", rwidth, rheight);

var Title1 = new Text((rwidth-210)/2, 110, "Missile", Wh, "50px magicPixelBold");
var Title2 = new Text((rwidth-260)/2, 160, "Command", Wh, "50px magicPixelBold");
var Paused = new Text((rwidth-200)/2, 110, "Paused", Wh, "50px magicPixel");
var Score = new Text(30, 50, function() {
    return "Score: " + LevelManager.score;
}, Wh, "30px magicPixel");
var Level = new Text(rwidth-200, 50, function() {
    return "Level " + LevelManager.level;
}, Wh, "30px magicPixel");
var Money = new Text(30, 100, function() {
    return "Money: " + LevelManager.money;
}, Wh, "30px magicPixel");

var Background = new Rectangle(0, 0, rwidth, rheight, Bl);
var Dim = new Rectangle(0, 0, rwidth, rheight, Op2);
var MenuBg = new Rectangle(0, 0, rwidth, rheight, Bl);

var Play = new Button("assets/Play.png", (rwidth-160)/2, 280, startGame);
var Restart = new Button("assets/Restart.png", (rwidth-192)/2, 160, showMenu);

function startGame() {
    MCount = 0;
    Game.reset();
    Game.setDrawInterval(50);
    Game.setUpdateInterval(50);
    Game.addLayer(2);
    Game.ingame = true;
    // Game adds
    Game.add(Background, "Background");
    Game.add(LevelManager, "LM");
    Game.add(Field, "Field");
    Game.add(Cursor, "Cursor", 1);
    Game.add(Planes, "Planes");
    Game.add(Score, "Score", 1);
    Game.add(Level, "Level", 1);
    Game.add(Money, "Money", 1);
}

function gameover() {
    Game.add(Dim, "Dim", 2);
    Game.add(Restart, "B_Restart", 2);
    Game.draw();
    Game.stopDraw();
    Game.ingame = false;
}

function pause() {
    if (!Game.paused) {
        Game.add(Dim, "Dim", 2);
        Game.add(Paused, "Paused", 2);
        Game.stopDraw();
        Game.stopUpdate();
        Game.paused = true;
    }
    else {
        Game.del("Dim", 2);
        Game.del("Paused", 2);
        Game.setDrawInterval(50);
        Game.setUpdateInterval(50);
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
    Game.bind(90, function() { if (Game.ingame && !Game.pause) Cursor.shoot(); }, KEY_DOWN);
    showMenu();
    Game.bind(83, function() { Game.stop(); }, KEY_DOWN);
    Game.bind(75 , function() { for (let l = 0; l < Game.numLayers; l++) for (let k in Game.layers[l].objs) console.log(k); console.log("=======")}, KEY_DOWN);
}

window.onload = main;
