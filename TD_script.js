var dirs = [[1, 0], [0, -1], [-1, 0], [0, 1]]
var dirNames = ["Right", "Up", "Left", "Down"]
var pixelSize = 32
var pixelBorder = 2
var pheight = 16
var pwidth = 22
var rheight = pheight*pixelSize
var rwidth = pwidth*pixelSize

var uiWidth = 4
var towerCounter = 0
var enemyCounter = 0
var bulletCounter = 0
var actualMap = 0

var enemyVector = {}

const ANIMATION_TIME = 200

const CANNON = 0
const FLAMETHROWER = 1
const MATTER = 2
const MINIGUN = 3
const PISTOL = 4
const ROCKET = 5
const SHOTGUN = 6

const SHOPNAMES = [
    "CANNON",
    "FLAMETHROWER",
    "MATTER",
    "MINIGUN",
    "PISTOL",
    "ROCKET",
    "SHOTGUN",
    "CANCEL"
]

const ICONPATH = [
    "assets/icons/cannon-shot.png",
    "assets/icons/fire.png",
    "assets/icons/white-cat.png",
    "assets/icons/minigun.png",
    "assets/icons/pistol-gun.png",
    "assets/icons/rocket.png",
    "assets/icons/winchester-rifle.png"
]

const TOWERPATH = [
    "assets/topdown_shooter/towers/cannon.png",
    "assets/topdown_shooter/towers/flamethrower.png",
    "assets/topdown_shooter/towers/matter.png",
    "assets/topdown_shooter/towers/mg.png",
    "assets/topdown_shooter/towers/pistol.png",
    "assets/topdown_shooter/towers/rocket.png",
    "assets/topdown_shooter/towers/shotgun.png"
]

const BULLETPATH = [
    "assets/topdown_shooter/other/cannonball.png",
    "assets/topdown_shooter/other/flamethrower_bullet.png",
    "assets/topdown_shooter/other/cat.png",
    "assets/topdown_shooter/other/bulletc.png",
    "assets/topdown_shooter/other/bulleta.png",
    "assets/topdown_shooter/other/rocket.png",
    "assets/topdown_shooter/other/bulletb.png"
]

const BULLETSIZE = [
    [34, 34],
    [20, 52],
    [28, 38],
    [16, 22],
    [12, 12],
    [14, 26],
    [16, 20]
]

const RANKPATH = [
    "assets/icons/rank-1.png",
    "assets/icons/rank-2.png",
    "assets/icons/rank-3.png"
]

const TILEMAP = {
    0b0011 : 9,
    0b0101 : 0,
    0b0110 : 10,
    0b0111 : 3,
    0b1001 : 7,
    0b1010 : 1,
    0b1011 : 4,
    0b1100 : 8,
    0b1101 : 2,
    0b1110 : 5,
    0b1111 : 6
}

const MAPS = [[[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
               [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
               [0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
               [0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
               [0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0],
               [0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0],
               [0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 1],
               [0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0],
               [0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0],
               [0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0],
               [0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 0],
               [0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
               [1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
               [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
               [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
               [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]]

const BEGS = [[12, -1], [12, 0], [12, 1], [12, 2], [11, 2], [10, 2], [9, 2], [8, 2], [7, 2],
[6, 2], [5, 2], [4, 2], [3, 2], [2, 2], [2, 3], [2, 4], [2, 5], [3, 5], [4, 5], [5, 5],
[6, 5], [7, 5], [8, 5], [9, 5], [10, 5], [11, 5], [12, 5], [13, 5], [13, 6], [13, 7],
[13, 8], [13, 9], [12, 9], [11, 9], [10, 9], [9, 9], [8, 9], [7, 9], [6, 9], [5, 9],
[5, 10], [5, 11], [4, 11], [3, 11], [3, 12], [3, 13], [4, 13], [5, 13], [6, 13],
[7, 13], [8, 13], [9, 13], [10, 13], [10, 14], [10, 15], [10, 16], [9, 16], [8, 16],
[7, 16], [6, 16], [6, 17], [6, 18]]

function newArray(size, fill) {
    let arr = new Array(size);
    for (let i = 0; i < size; i++)
        arr[i] = fill(i);
    return arr;
}

function pointInRect(px, py, rx, ry, width, height) {
    return px >= rx && px <= rx + width && py >= ry && py <= ry + height;
}

function mouseInRect(x, y, width, height) {
    let mp = Game.mousePos;
    return pointInRect(mp[0], mp[1], x, y, width, height);
}

function arrayCmp(a1, a2) {
    for (var i = 0; i < a1.length; i++) {
        if (a1[i] != a2[i])
            return false
    }
    return true
}

function idn(d) {
    for (var i = 0; i < 4; i++) {
        if (arrayCmp(d, dirs[i]))
            return i
    }
    return -1
}

function exists(pos) {
    return (pos[0] >= 0 && pos[0] < pheight && pos[1] >= 0 && pos[1] < pwidth-uiWidth)
}

function bisect(list, pos, speed) {
    var act = Math.floor(pos*speed)
    if (act+1 >= list.length)
        return [-1, -1, 3]
    var perc = pos*speed - act
    var dir = idn([list[act+1][1] - list[act][1], list[act+1][0] - list[act][0]])
    var x = (list[act][1]*(1-perc) + list[act+1][1]*perc)*pixelSize + pixelSize/2
    var y = (list[act][0]*(1-perc) + list[act+1][0]*perc)*pixelSize + pixelSize/4
    return [x, y, dir]
}

class Tile {
    constructor(x, y, q, frame) {
        // 0 => right; 1 => up; 2 => left; 3 => down
        this.neigh = [null, null, null, null]
        this.x = x
        this.y = y
        this.quad = q
        this.frame = frame
    }
    start() {}
    update(dt) {}
    draw(ctx) {
        this.quad.drawFrameAt(ctx, this.frame, this.x, this.y)
    }
}

class Enemy {
    constructor(path, x, y, w, h, name) {
        this.quad = new Quad(path, 0, 0, w, h, 6, 4)
        this.lbbg = new Rectangle(0, 0, 32, 4, Rd)
        this.lb = new Rectangle(0, 0, 32, 4, Lg)
        this.life = 100
        this.x = x
        this.y = y
        this.dir = 3
        this.prevDir = 3
        this.anims = [
            new Animation(this.quad, [0, 1, 2], BEGTOBEG, ANIMATION_TIME),
            new Animation(this.quad, [6, 7, 8], BEGTOBEG, ANIMATION_TIME),
            new Animation(this.quad, [12, 13, 14], BEGTOBEG, ANIMATION_TIME),
            new Animation(this.quad, [18, 19, 20], BEGTOBEG, ANIMATION_TIME)
        ]
        this.time = 0
        this.timer = Math.floor(ANIMATION_TIME+Math.random()*ANIMATION_TIME*4)
        this.local = 0
        this.speed = 0.05
        this.name = name
    }
    start() {}
    update(dt) {
        [this.x, this.y, this.dir] = bisect(BEGS, this.local, this.speed)
        this.local++
        if (this.prevDir != this.dir)
            this.anims[this.dir].start()
        this.anims[this.dir].update(dt)
        this.prevDir = this.dir
        this.life = Math.min(100, Math.max(0, this.life))
        this.lb.w = this.life*0.32
        if (this.life == 0 || this.x == -1) {
            Game.del(this.name, 1)
            delete enemyVector[this.name]
            UI.money += 100
        }
    }
    move(dx, dy) {
        this.x += dx
        this.y += dy
    }
    draw(ctx) {
        this.anims[this.dir].drawAt(ctx, this.x-this.quad.w/2, this.y-this.quad.h/2)
        this.lbbg.drawAt(ctx, this.x-this.quad.w/2, this.y-this.quad.h/2)
        this.lb.drawAt(ctx, this.x-this.quad.w/2, this.y-this.quad.h/2)
    }
}

class Tower {
    constructor(type, x, y, w, h, name) {
        this.quad = new Quad(TOWERPATH[type], 0, 0, w, h, 8, 3)
        this.type = type
        this.x = x
        this.y = y
        this.dir = 6
        this.level = 1
        this.time = 500
        this.timer = 500
        this.ready = false
        this.range = 150
        this.damage = 20
        this.name = name
    }
    start() {}
    shot(target) {
        this.ready = false
        this.time = this.timer
        var name = "Bullet_" + bulletCounter
        var yvar = (this.level == 1)? pixelSize : 3*pixelSize/2
        var dx = target.x - this.x
        var dy = target.y - this.y
        var dist = Math.sqrt(dx*dx + dy*dy)
        var angle = Math.atan2(dy + yvar, dx)
        dx *= 20/dist // Magic number :O
        dy *= 20/dist // Magic number :O
        if (angle <= Math.PI/8 && angle > -Math.PI/8)
            this.dir = 0
        else if (angle <= 3*Math.PI/8 && angle > Math.PI/8)
            this.dir = 7
        else if (angle <= 5*Math.PI/8 && angle > 3*Math.PI/8)
            this.dir = 6
        else if (angle <= 7*Math.PI/8 && angle > 5*Math.PI/8)
            this.dir = 5
        else if (angle > 7*Math.PI/8 || angle <= -7*Math.PI/8)
            this.dir = 4
        else if (angle <= -5*Math.PI/8 && angle > -7*Math.PI/8)
            this.dir = 3
        else if (angle <= -3*Math.PI/8 && angle > -5*Math.PI/8)
            this.dir = 2
        else if (angle <= -Math.PI/8 && angle > -3*Math.PI/8)
            this.dir = 1
        Game.add(new Bullet(this.x + dx, this.y - yvar + dy, this.type, name, target, this.damage), name, 2)
        bulletCounter++
    }
    update(dt) {
        var target = false
        for (var k in enemyVector) {
            var dist = Math.pow(this.x - enemyVector[k].x, 2) + Math.pow(this.y - enemyVector[k].y, 2)
            if (dist < this.range*this.range && (!target || enemyVector[k].local > target.local) && enemyVector[k].life != 0)
                target = enemyVector[k]
        }
        if (!this.ready) {
            this.time = Math.max(0, this.time-dt)
            if (this.time == 0) this.ready = true
        }
        else if (target)
            this.shot(target)
    }
    draw(ctx) {
        if (Cursor.isAt(this.x, this.y, 1, 1) || UI.selTower == this.name) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.range, 0, 2 * Math.PI, false);
            ctx.fillStyle = Op2;
            ctx.fill();
            ctx.lineWidth = 1;
            ctx.strokeStyle = Bl;
            ctx.stroke();
        }
        this.quad.drawFrameAt(ctx, this.dir+8*(this.level-1), this.x-pixelSize, this.y-this.quad.h+pixelSize/2)
    }
    upgrade() {
        if (this.level < 3)
            this.level++
        else
            console.log("You can't upgrade this tower anymore!!")
    }
}

class Bullet {
    constructor(x, y, type, name, target, damage) {
        this.x = x
        this.y = y
        this.angle = 0
        this.type = type
        this.target = target
        this.speed = 4
        this.name = name
        this.damage = damage
        this.size = [BULLETSIZE[type][0], BULLETSIZE[type][1]]
        var frames = (type == FLAMETHROWER)? 2 : 1
        this.size[1] /= frames
        this.quad = new Quad(BULLETPATH[type], 0, 0, this.size[1], this.size[0], frames, 1)
        this.anim = new Animation(this.quad, ((type == 1)? [0, 1] : [0]), BEGTOEND, 200)
        this.anim.rewind()
    }
    start() {}
    update(dt) {
        this.anim.update(dt)
        var dx = this.target.x - this.x
        var dy = this.target.y - this.y
        if (this.type == MATTER)
            this.angle += (Math.PI/36)%(2*Math.PI)
        else
            this.angle = Math.atan2(dy, dx)
        var dist = Math.sqrt(dx*dx + dy*dy)
        this.x += dx*this.speed/dist
        this.y += dy*this.speed/dist
        if (this.target.x == -1)
            Game.del(this.name, 2)
        else if (dist < this.target.quad.h/2) {
            this.target.life -= this.damage
            Game.del(this.name, 2)
        }
    }
    draw(ctx) {
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(this.angle)
        this.anim.drawAt(ctx, -this.size[1]/2, -this.size[0]/2)
        ctx.restore()
    }
}

var Cursor = {
    start() {
        this.sprite = new Sprite("assets/cursor.png", 0, 0)
        this.px = 0
        this.py = 0
        this.x = 0
        this.y = 0
        this.towerQuad = false
        this.tower = -1
        this.defaultSize = [64, 96]
    },
    update(dt) {
        this.px = Math.min(pwidth-1, Math.max(0, Math.floor(Game.mousePos[0]/pixelSize)))
        this.py = Math.min(pheight-1, Math.max(0, Math.floor(Game.mousePos[1]/pixelSize)))
        this.x = this.px*pixelSize + pixelSize/3
        this.y = this.py*pixelSize + pixelSize/3
    },
    draw(ctx) {
        var x = pixelSize*this.px
        var y = pixelSize*this.py
        this.sprite.drawSpriteAt(ctx, x, y)
        if (this.tower != -1) {
            ctx.save()
            ctx.globalAlpha = 0.7
            this.towerQuad.drawFrameAt(ctx, 6, x-16, y-this.towerQuad.h+32)
            ctx.restore()
        }
    },
    getTower(id) {
        console.log("GET")
        this.towerQuad = new Quad(TOWERPATH[id], 0, 0, this.defaultSize[0], this.defaultSize[1], 8, 3)
        this.tower = id
    },
    click() {
        if (this.tower != -1) {
            if (map[this.py][this.px] == -1 && MAPS[actualMap][this.py][this.px] == 0 && this.px < pwidth-uiWidth) {
                console.log("PUT")
                var tower = new Tower(this.tower, pixelSize*this.px+16, pixelSize*this.py+16, this.defaultSize[0], this.defaultSize[1], towerCounter)
                map[this.py][this.px] = towerCounter
                Game.add(tower, "Tower_" + towerCounter, 1)
                towerCounter++
                this.tower = -1
            }
            else
                console.log("You can't put your tower here!!")
        }
        else
            UI.selTower = map[this.py][this.px]
    },
    cancel() {
        this.tower = -1
    },
    isAt(x, y, w, h) {
        var px = Math.floor(x/pixelSize)
        var py = Math.floor(y/pixelSize)
        return this.px >= px && this.px < px+w && this.py >= py && this.py < py+h
    }
}

var UI = {
    start() {
        this.bg = new Rectangle(18*pixelSize, 0, uiWidth*pixelSize, 16*pixelSize, Bl)
        this.shopButtons = newArray(7, (i) => {
            return new Button(ICONPATH[i], (18 + i%2)*pixelSize + 2*(i%2 + 1)*pixelSize/3, (1 + Math.floor(i/2))*pixelSize + 2*(Math.floor(i/2)*pixelSize/3), () => {
                console.log(SHOPNAMES[i])
                Cursor.getTower(i)
            })
        })
        this.shopButtons[7] = new Button("assets/icons/cancel.png", 19*pixelSize + 4/3*pixelSize, 6*pixelSize, () => {
            console.log("CANCEL")
            Cursor.cancel()
        })
        this.upgrade = new Button("assets/icons/upgrade.png", 20*pixelSize, 13*pixelSize, () => {
            this.tower.upgrade()
        })
        this.lastSelTower = -1
        this.selTower = -1
        this.tower = -1
        this.selTowerSprite = new Sprite("")
        this.selTowerRank = new Sprite("")
        this.levelText = new Text(0, 0, () => {
            return "Level:       " + UI.tower.level
        }, Wh, "30px bitOperator")
        this.rangeText = new Text(0, 0, () => {
            return "Range:    " + UI.tower.range
        }, Wh, "30px bitOperator")
        this.damageText = new Text(0, 0, () => {
            return "Damage:   " + UI.tower.damage
        }, Wh, "30px bitOperator")
        this.money = 0
        this.moneyText = new Text(0, 0, () => {
            return "Money:  " + this.money
        }, Wh, "30px bitOperator")
    },
    draw(ctx) {
        this.bg.draw(ctx)
        for (var i = 0; i < 8; i++)
            this.shopButtons[i].draw(ctx)
        if (this.selTower != -1) {
            this.selTowerSprite.img.src = ICONPATH[this.tower.type]
            this.selTowerRank.img.src = RANKPATH[this.tower.level-1]
            this.selTowerSprite.drawSpriteAt(ctx, 19*pixelSize, 8*pixelSize);
            this.selTowerRank.drawSpriteAt(ctx, 20*pixelSize, 8*pixelSize)
            this.upgrade.draw(ctx)
            ctx.save()
            ctx.translate(18.5*pixelSize, 10*pixelSize)
            ctx.save()
            ctx.scale(0.5, 0.5)
            this.levelText.draw(ctx)
            ctx.restore()
            ctx.translate(0, pixelSize/2)
            ctx.save()
            ctx.scale(0.5, 0.5)
            this.rangeText.draw(ctx)
            ctx.restore()
            ctx.translate(0, pixelSize/2)
            ctx.save()
            ctx.scale(0.5, 0.5)
            this.damageText.draw(ctx)
            ctx.restore()
            ctx.restore()
        }
        ctx.save()
        ctx.translate(18.5*pixelSize, 15.5*pixelSize)
        ctx.scale(0.5, 0.5)
        this.moneyText.draw(ctx)
        ctx.restore()

    },
    update(dt) {
        if (this.lastSelTower != this.selTower && this.selTower != -1)
            this.tower = Game.get("Tower_" + this.selTower, 1)
        this.lastSelTower = this.selTower
    },
    push(canvas) {
        var mem = false
        for (var i = 0; i < 8; i++) {
            if (this.shopButtons[i].push(canvas))
                mem = true
        }
        if (this.selTower != -1) {
            if (this.upgrade.push(canvas))
                mem = true
        }
        return mem
    }
}

var Spawner = {
    start() {
        this.time = 1000
        this.timer = 1000
    },
    update(dt) {
        this.time -= dt
        if (this.time <= 0) {
            this.spawn()
            this.time = this.timer
        }
    },
    spawn() {
        var name = "Enemy_" + enemyCounter
        enemyCounter++
        var mons = new Enemy("assets/KemonoSprites/Gork.png", BEGS[0][1]*pixelSize, BEGS[0][0]*pixelSize, 32, 32, name)
        enemyVector[name] = mons
        Game.add(mons, name, 1)
    },
    draw(ctx) {}
}

var map = newArray(pheight, (i) => {
    return newArray(pwidth, (j) => {
        return -1
    })
})

var Game = new Canvas("game", rwidth, rheight)

var pathQuad = new Quad("assets/TileCraftSet/Tiles2.png", 0, 0, 32, 32, 9, 2)

var floor = newArray(pheight, (i) => {
    return newArray(pwidth-uiWidth, (j) => {
        return new Tile(pixelSize*j, pixelSize*i, pathQuad, 11+Math.floor(Math.random()*3))
    })
})

for (var i = 0; i < pheight; i++) {
    for (var j = 0; j < pwidth-uiWidth; j++) {
        if (MAPS[actualMap][i][j] == 1) {
            var ctr = 0
            for (var k = 3; k >= 0; k--) {
                var d = [i+dirs[k][1], j+dirs[k][0]]
                ctr = 2*ctr + (exists(d)? MAPS[actualMap][d[0]][d[1]] : 1)
            }
            floor[i][j].frame = TILEMAP[ctr]
        }
    }
}

function main() {
    Game.setDrawInterval(10)
    Game.setUpdateInterval(10)
    Game.setInputInterval(10)
    Game.addLayer(3)
    Game.setLayerProp(1, "sort", true)
    for (var i = 0; i < pheight; i++) {
        for (var j = 0; j < pwidth-uiWidth; j++)
            Game.add(floor[i][j], "Floor_" + i + "_" + j)
    }
    Game.add(UI, "B_UI", 3)
    Game.add(Cursor, "Cursor", 1)
    Game.add(Spawner, "Spawner")
    //Game.bind(90, () => { }, KEY_DOWN)
    Game.bind(27, () => { Cursor.cancel() }, KEY_DOWN)
    Game.bindClick("CursorClick", () => { Cursor.click() })
}

window.onload = main
