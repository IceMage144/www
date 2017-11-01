var dirs = [[1, 0], [0, -1], [-1, 0], [0, 1]]
var dirNames = ["Right", "Up", "Left", "Down"]
var pixelSize = 32
var pixelBorder = 2
var pheight = 16
var pwidth = 18
var rheight = pheight*pixelSize
var rwidth = pwidth*pixelSize

var towerCounter = 0
var actualMap = 0

var enemyVector = []

const ANIMATION_TIME = 200

const STILL = 0
const BEGTOBEG = -1
const BEGTOEND = 1

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
               [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2],
               [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2]]]

const BEGS = [[12, 0], [12, 1], [12, 2], [11, 2], [10, 2], [9, 2], [8, 2], [7, 2],
[6, 2], [5, 2], [4, 2], [3, 2], [2, 2], [2, 3], [2, 4], [2, 5], [3, 5], [4, 5], [5, 5],
[6, 5], [7, 5], [8, 5], [9, 5], [10, 5], [11, 5], [12, 5], [13, 5], [13, 6], [13, 7],
[13, 8], [13, 9], [12, 9], [11, 9], [10, 9], [9, 9], [8, 9], [7, 9], [6, 9], [5, 9],
[5, 10], [5, 11], [4, 11], [3, 11], [3, 12], [3, 13], [4, 13], [5, 13], [6, 13],
[7, 13], [8, 13], [9, 13], [10, 13], [10, 14], [10, 15], [10, 16], [9, 16], [8, 16],
[7, 16], [6, 16], [6, 17]]

function newArray(size, fill) {
    let arr = new Array(size);
    for (let i = 0; i < size; i++)
        arr[i] = fill(i);
    return arr;
}

function arrayCmp(a1, a2) {
    for (var i = 0; i < a1.length; i++) {
        if (a1[i] != a2[i])
            return false
    }
    return true
}

function exists(pos) {
    return (pos[0] >= 0 && pos[0] < pheight && pos[1] >= 0 && pos[1] < pwidth)
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
    constructor(path, x, y, w, h) {
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
    }
    start() {}
    update(dt) {
        this.time += dt
        if (this.time >= this.timer) {
            this.time = 0
            this.dir = Math.floor(Math.random()*4)
            this.timer = Math.floor(ANIMATION_TIME+Math.random()*ANIMATION_TIME*4)
        }
        if (this.prevDir != this.dir)
            this.anims[this.dir].start()
        this.anims[this.dir].update(dt)
        this.move(dirs[this.dir][0], dirs[this.dir][1])
        this.prevDir = this.dir
        this.life = Math.min(100, Math.max(0, this.life))
        this.lb.w = this.life*0.32
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
    constructor(path, x, y, w, h) {
        this.quad = new Quad(path, 0, 0, w, h, 8, 3)
        this.path = path
        this.x = x
        this.y = y
        this.dir = 6
        this.level = 1
        this.time = 500
        this.timer = 500
        this.ready = false
        this.range = 150
    }
    start() {}
    shot(target) {
        console.log("BANG!")
        this.ready = false
        this.time = this.timer
        // Create bullet
    }
    update(dt) {
        var target = false
        for (var i = 0; i < enemyVector.length; i++) {
            var dist = Math.pow(this.x - enemyVector[i].x, 2) + Math.pow(this.y - enemyVector[i].y, 2)
            if (dist < this.range*this.range && (!target || enemyVector[i].local > target.local))
                target = enemyVector[i]
        }
        if (target) {
            var angle = Math.atan2(target.y - this.y, target.x - this.x)
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
        }
        if (!this.ready) {
            this.time = Math.max(0, this.time-dt)
            if (this.time == 0) this.ready = true
        }
        else if (target)
            this.shot(target)
    }
    draw(ctx) {
        this.quad.drawFrameAt(ctx, this.dir+8*(this.level-1), this.x-16, this.y-this.quad.h+32)
    }
    upgrade() {
        if (this.level < 3)
            this.level++
        else
            console.log("You can't upgrade this tower anymore!!")
    }
}

var Cursor = {
    start() {
        this.visible = false
        this.sprite = new Sprite("assets/cursor.png", 0, 0)
        this.px = 0
        this.py = 0
        this.towerQuad = false
        this.tower = -1
        this.defaultSize = [64, 96]
    },
    update(dt) {
        if (this.visible) {
            this.px = Math.min(pwidth-1, Math.max(0, Math.floor(Game.mousePos[0]/pixelSize)))
            this.py = Math.min(pheight-1, Math.max(0, Math.floor(Game.mousePos[1]/pixelSize)))
        }
    },
    draw(ctx) {
        if (this.visible) {
            var x = pixelSize*this.px
            var y = pixelSize*this.py
            this.sprite.drawSpriteAt(ctx, x, y)
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
        this.visible = true
    },
    putTower() {
        if (this.visible) {
            if (map[this.py][this.px] == -1 && MAPS[actualMap][this.py][this.px] == 0) {
                console.log("PUT")
                var tower = new Tower(TOWERPATH[this.tower], pixelSize*this.px, pixelSize*this.py, this.defaultSize[0], this.defaultSize[1])
                map[this.py][this.px] = towerCounter
                Game.add(tower, "Tower_" + towerCounter)
                towerCounter++
                this.visible = false
            }
            else
                console.log("You can't put your tower here!!")
        }
    },
    cancel() {
        this.visible = false
    }
}

var map = newArray(pheight, (i) => {
    return newArray(pwidth, (j) => {
        return -1
    })
})

var Game = new Canvas("game", rwidth, rheight)

var cannon = new Tower(TOWERPATH[CANNON], rwidth/2, rheight/2, 64, 96)

var gork = new Enemy("assets/KemonoSprites/Gork.png", rwidth/2, rheight/2, 32, 32)
enemyVector[0] = gork

var shopBG = new Rectangle(14*pixelSize, 14*pixelSize, 4*pixelSize, 2*pixelSize, Bl)

var shopButtons = newArray(7, (i) => {
    return new Button(ICONPATH[i], (14 + i%4)*pixelSize, (14 + Math.floor(i/4))*pixelSize, () => {
        console.log(SHOPNAMES[i])
        Cursor.getTower(i)
    })
})

shopButtons[7] = new Button("assets/icons/cancel.png", 17*pixelSize, 15*pixelSize, () => {
    console.log("CANCEL")
    Cursor.cancel()
})

var pathQuad = new Quad("assets/TileCraftSet/Tiles2.png", 0, 0, 32, 32, 9, 2)

var floor = newArray(pheight, (i) => {
    return newArray(pwidth, (j) => {
        return new Tile(pixelSize*j, pixelSize*i, pathQuad, 11+Math.floor(Math.random()*3))
    })
})

for (var i = 0; i < pheight; i++) {
    for (var j = 0; j < pwidth; j++) {
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
    for (var i = 0; i < pheight; i++) {
        for (var j = 0; j < pwidth; j++)
            Game.add(floor[i][j], "Floor_" + i + "_" + j)
    }
    Game.add(shopBG, "ShopBG")
    Game.add(cannon, "Cannon")
    Game.add(gork, "Gork")
    for (var i = 0; i < 8; i++)
        Game.add(shopButtons[i], "B_" + SHOPNAMES[i] + "Icon")
    Game.add(Cursor, "Cursor")
    Game.bind(90, () => { gork.life -= 10 }, KEY_DOWN)
    Game.bindClick("PutTower", () => { Cursor.putTower() })
}

window.onload = main
