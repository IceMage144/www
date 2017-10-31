//http://www.williammalone.com/articles/create-html5-canvas-javascript-sprite-animation/
var dirs = [[1, 0], [0, -1], [-1, 0], [0, 1]]
var dirNames = ["Right", "Up", "Left", "Down"]
var pixelSize = 32
var pixelBorder = 2
var pheight = 16
var pwidth = 18
var rheight = pheight*pixelSize
var rwidth = pwidth*pixelSize

const ANIMATION_TIME = 200

const STILL = 0
const BEGTOBEG = -1
const BEGTOEND = 1

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

function idn(pos1, pos2) {
    let dif = [pos2[1] - pos1[1], pos2[0] - pos1[0]]
    for (var i = 0; i < 4; i++) {
        if (arrayCmp(dif, dirs[i]))
            return i
    }
    return -1
}

function exists(pos) {
    return (pos[0] >= 0 && pos[0] < pheight && pos[1] >= 0 && pos[1] < pwidth)
}

function insideFrame(pos) {
    return (pos[0] >= 1 && pos[0] < pheight-1 && pos[1] >= 1 && pos[1] < pwidth-1)
}

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex -= 1
        temporaryValue = array[currentIndex]
        array[currentIndex] = array[randomIndex]
        array[randomIndex] = temporaryValue
    }
}

class Stack {
    constructor() {
        this.v = []
    }
    push(e) {
        this.v.push(e)
    }
    pop() {
        return this.v.splice(this.v.length-1, 1)[0]
    }
    isEmpty() {
        return (this.v.length == 0)
    }
    size() {
        return this.v.length
    }
    top() {
        if (this.size() == 0) return null
        return this.v[this.size()-1]
    }
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

class Quad {
    constructor(src, sx, sy, w, h, nfh=1, nfv=1) {
        this.img = new Image()
        this.img.src = src
        this.sx = sx
        this.sy = sy
        this.w = w
        this.h = h
        this.nfh = nfh
        this.nfv = nfv
        this.maxFrame = nfv*nfh
    }
    start() {}
    update(dt) {}
    drawFrameAt(ctx, frame, x, y) {
        let sx = this.sx + this.w*(frame%this.nfh)
        let sy = this.sy + this.h*Math.floor(frame/this.nfh)
        ctx.drawImage(this.img, sx, sy, this.w, this.h, x, y, this.w, this.h)
    }
    draw(ctx) {}
}

class Animation {
    constructor(q, frames, type=STILL, time=0, animationEnd=null) {
        this.quad = q
        this.frames = frames
        this.maxFrame = frames.length
        this.frame = 0
        this.type = type
        this.timer = time
        this.add = (type == STILL)? 0 : 1
        this.onAnimationEnd = animationEnd
        this.time = 0
        this.mtx = false
    }
    start() {
        this.quad.frame = this.frames[0]
    }
    update(dt) {
        this.time += dt
        if (this.time >= this.timer) {
            this.time = 0
            this.frame = this.frame + this.add
            if (((this.frame == this.maxFrame && this.type == BEGTOEND) || (this.frame == 0 && this.type == BEGTOBEG)) && this.onAnimationEnd != null)
                this.onAnimationEnd()
            if (this.frame == this.maxFrame-1 || this.frame == 0)
                this.add *= this.type
            this.frame %= this.maxFrame
            this.quad.frame = this.frames[this.frame]
        }
    }
    draw(ctx) {}
    drawAt(ctx, x, y) {
        this.quad.drawFrameAt(ctx, this.frames[this.frame], x, y)
    }
    setAnimationType(t) {
        this.type = t
        this.add = (type == STILL)? 0 : 1
    }
    rewind() {
        this.frame = 0
        this.time = 0
        this.add = (this.type == STILL)? 0 : 1
    }
}

class Tower2 {
    constructor(path, x, y, w, h) {
        this.quad = new Quad(path, 0, 0, w, h, 6, 4)
        this.x = x
        this.y = y
        this.activeAnim = 3
        this.dir = 3
        this.shoting = false
        var endfunc = (function() {
            this.anims[this.activeAnim].rewind()
            this.activeAnim -= 4
            this.anims[this.activeAnim].start()
            this.shoting = false
        }).bind(this)
        this.anims = [
            new Animation(this.quad, [19], STILL),
            new Animation(this.quad, [7], STILL),
            new Animation(this.quad, [13], STILL),
            new Animation(this.quad, [1], STILL),
            new Animation(this.quad, [21, 22, 23], BEGTOEND, ANIMATION_TIME, endfunc),
            new Animation(this.quad, [9, 10, 11], BEGTOEND, ANIMATION_TIME, endfunc),
            new Animation(this.quad, [15, 16, 17], BEGTOEND, ANIMATION_TIME, endfunc),
            new Animation(this.quad, [3, 4, 5], BEGTOEND, ANIMATION_TIME, endfunc)
        ]
    }
    start() {}
    shot() {
        if (!this.shoting) {
            console.log("OUCH!!!")
            this.shoting = true
            this.activeAnim += 4
            this.anims[this.activeAnim].start()
            // Create bullet
        }
    }
    update(dt) {
        var angle = Math.atan2(Game.mousePos[1] - this.y, Game.mousePos[0] - this.x)
        if (!this.shoting) {
            if (angle <= Math.PI/4 && angle > -Math.PI/4)
                this.activeAnim = 0
            else if (angle <= 3*Math.PI/4 && angle > Math.PI/4)
                this.activeAnim = 3
            else if (angle > 3*Math.PI/4 || angle <= -3*Math.PI/4)
                this.activeAnim = 2
            else if (angle > -3*Math.PI/4 && angle <= -Math.PI/4)
                this.activeAnim = 1
        }
        this.anims[this.activeAnim].update(dt)
    }
    draw(ctx) {
        this.anims[this.activeAnim].drawAt(ctx, this.x-this.quad.w/2, this.y-this.quad.h/2)
    }
}

class Enemy {
    constructor(path, x, y, w, h) {
        this.quad = new Quad(path, 0, 0, w, h, 6, 4)
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
    }
    start() {}
    update(dt) {
        this.time += dt
        if (this.time >= this.timer) {
            this.time = 0
            this.dir = Math.floor(Math.random()*4)
            this.timer = Math.floor(ANIMATION_TIME+Math.random()*ANIMATION_TIME*4)
        }
        if (this.prevDir != this.dir) {
            //this.anims[this.prevDir].rewind()
            this.anims[this.dir].start()
        }
        this.anims[this.dir].update(dt)
        this.move(dirs[this.dir][0], dirs[this.dir][1])
        this.prevDir = this.dir
    }
    move(dx, dy) {
        this.x += dx
        this.y += dy
    }
    draw(ctx) {
        this.anims[this.dir].drawAt(ctx, this.x-this.quad.w/2, this.y-this.quad.h/2)
    }
}

class Tower {
    constructor(path, x, y, w, h) {
        this.quad = new Quad(path, 0, 0, w, h, 8, 1)
        this.x = x
        this.y = y
        this.activeAnim = 6
        this.dir = 6
        this.shoting = false
        this.anims = [
            new Animation(this.quad, [0], STILL),
            new Animation(this.quad, [1], STILL),
            new Animation(this.quad, [2], STILL),
            new Animation(this.quad, [3], STILL),
            new Animation(this.quad, [4], STILL),
            new Animation(this.quad, [5], STILL),
            new Animation(this.quad, [6], STILL),
            new Animation(this.quad, [7], STILL)
        ]
    }
    start() {}
    shot() {
        if (!this.shoting) {
            console.log("OUCH!!!")
            this.shoting = true
            this.activeAnim += 4
            this.anims[this.activeAnim].start()
            // Create bullet
        }
    }
    update(dt) {
        var angle = Math.atan2(Game.mousePos[1] - this.y, Game.mousePos[0] - this.x)
        if (!this.shoting) {
            if (angle <= Math.PI/8 && angle > -Math.PI/8)
                this.activeAnim = 0
            else if (angle <= 3*Math.PI/8 && angle > Math.PI/8)
                this.activeAnim = 7
            else if (angle <= 5*Math.PI/8 && angle > 3*Math.PI/8)
                this.activeAnim = 6
            else if (angle <= 7*Math.PI/8 && angle > 5*Math.PI/8)
                this.activeAnim = 5
            else if (angle > 7*Math.PI/8 || angle <= -7*Math.PI/8)
                this.activeAnim = 4
            else if (angle <= -5*Math.PI/8 && angle > -7*Math.PI/8)
                this.activeAnim = 3
            else if (angle <= -3*Math.PI/8 && angle > -5*Math.PI/8)
                this.activeAnim = 2
            else if (angle <= -Math.PI/8 && angle > -3*Math.PI/8)
                this.activeAnim = 1
        }
        this.anims[this.activeAnim].update(dt)
    }
    draw(ctx) {
        this.anims[this.activeAnim].drawAt(ctx, this.x-this.quad.w/2, this.y-this.quad.h/2)
    }
}

/*function recdfs() {
    var path = new Stack()
    var mark = newArray(pheight, (i) => { return newArray(pwidth, (j) => { return false }) })
    recdfsaux(path, mark, floor[Math.floor(pheight/2)][1])
    return path
}

function recdfsaux(path, mark, davez) {
    var pos = [davez.y/32, davez.x/32]
    var prev = path.top()
    //if (mark[pos[0]][pos[1]])
    //    return false
    path.push(davez)
    if (pos[1] == pwidth-1)
        return true
    if (prev != null) {
        prevpos = [prev.y/32, prev.x/32]
        let idx = idn(pos, prevpos)
        davez.neigh[idx] = prev
        prev.neigh[(idx+2)%4] = davez
    }
    mark[pos[0]][pos[1]] = true
    tmp = newArray(4, (i) => { return i })
    shuffle(tmp)
    var k = 0
    var next = [dirs[tmp[0]][0] + pos[0], dirs[tmp[0]][1] + pos[1]]
    while (!exists(next) || mark[next[0]][next[1]]) {
        k++
        if (k == 4) return false
        console.log(k)
        next = [dirs[tmp[k]][0] + pos[0], dirs[tmp[k]][1] + pos[1]]
    }
    for (let i = k+1; i < 4; i++) {
        var next2 = [dirs[tmp[i]][0] + pos[0], dirs[tmp[i]][1] + pos[1]]
        if (exists(next2))
            mark[next2[0]][next2[1]] = true
    }
    //debugger
    if (recdfsaux(path, mark, floor[next[0]][next[1]])) return true
    path.pop()
    return false
}

function dfs(path) {
    var stack = new Stack()
    var mark = newArray(pheight, (i) => { return newArray(pwidth, (j) => { return false }) })
    var brk = false
    stack.push([null, floor[Math.floor(pheight/2)][1]])
    while(!brk && !stack.isEmpty()) {
        var tmp = stack.pop()
        path.push(tmp)
        var prev = tmp[0]
        var now = tmp[1]
        var nowpos = [now.y/32, now.x/32]
        if (mark[nowpos[0]][nowpos[1]])
            continue
        if (prev != null) {
            var prevpos = [prev.y/32, prev.x/32]
            let idx = idn(nowpos, prevpos)
            now.neigh[idx] = prev
            prev.neigh[(idx+2)%4] = now
        }
        mark[nowpos[0]][nowpos[1]] = true
        tmp = newArray(4, (i) => { return i })
        shuffle(tmp)
        for (let i = 0; i < 4; i++) {
            var next = [dirs[tmp[i]][0] + nowpos[0], dirs[tmp[i]][1] + nowpos[1]]
            if (next[1] == pwidth-1) {
                brk = true
                break
            }
            if (insideFrame(next) && !mark[next[0]][next[1]])
                stack.push([now, floor[next[0]][next[1]]])
        }
    }
}*/

var Game = new Canvas("game", rwidth, rheight)

//var bellsprout = new Tower("assets/bellsprout.png", rwidth/2, rheight/2, 50, 50)

var cannon = new Tower("assets/topdown_shooter/towers/cannon/1.png", rwidth/2, rheight/2, 46, 86)

var gork = new Enemy("assets/KemonoSprites/Gork.png", rwidth/2, rheight/2, 32, 32)

var pathQuad = new Quad("assets/TileCraftSet/Tiles2.png", 0, 0, 32, 32, 9, 2)

var floor = newArray(pheight, (i) => {
    return newArray(pwidth, (j) => {
        return new Tile(pixelSize*j, pixelSize*i, pathQuad, 11+Math.floor(Math.random()*3))
    })
})

//var s = recdfs()
for (var i = 0; i < pheight; i++) {
    for (var j = 0; j < pwidth; j++) {
        if (MAPS[0][i][j] == 1) {
            var ctr = 0
            for (var k = 3; k >= 0; k--) {
                var d = [i+dirs[k][1], j+dirs[k][0]]
                ctr = 2*ctr + (exists(d)? MAPS[0][d[0]][d[1]] : 1)
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
    //Game.add(bellsprout, "Bell")
    Game.add(cannon, "Cannon")
    Game.add(gork, "Gork")
    Game.bind(90, () => { bellsprout.shot(); }, KEY_DOWN)
}

window.onload = main
