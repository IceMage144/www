var dirs = [[1, 0], [0, -1], [-1, 0], [0, 1]]
var pixelSize = 32
var corners = [[1, 1], [1, 0], [0, 0], [0, 1]]
var pheight = 16
var pwidth = 16
var rheight = pheight*pixelSize
var rwidth = pwidth*pixelSize
var limit = 30

function newArray(size, fill) {
    let arr = [];
    for (let i = 0; i < size; i++)
        arr.push(fill(i));
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
    let dif = [pos2[0] - pos1[0], pos2[1] - pos1[1]]
    for (var i = 0; i < 4; i++) {
        if (arrayCmp(dif, dirs[i]))
            return i
    }
    return -1
}

function exists(pos) {
    return (pos[0] >= 0 && pos[0] < pheight && pos[1] >= 0 && pos[1] < pwidth)
}

function countNeigh(pos) {
    if (!exists(pos))
        return [-1, -1]
    var n = Board.b[pos[0]][pos[1]].neigh
    var dir = 0
    var ctr = 0
    for (var k = 0; k < 4; k++) {
        if (n[k] != null) {
            dir = k
            ctr++
        }
    }
    return [ctr, dir]
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
    //return array
}

class RQ {
    constructor() {
        this.v = []
    }
    enqueue(e) {
        this.v.push(e)
    }
    dequeue() {
        let r = Math.floor(Math.random()*this.v.length)
        return this.v.splice(r, 1)[0]
    }
    rdequeue(pos) {
        for (var i = 0; i < this.v.length; i++) {
            var r = Math.floor(Math.random()*this.v.length)
            var t = this.v[r]
            //console.log(pos, t[1].pos)
            //console.log(r)
            if (Math.abs(t[1].pos[0] - pos[0]) <= 1 && Math.abs(t[1].pos[1] - pos[1]) <= 1) {
                //console.log("========1")
                //console.log("Near")
                return this.v.splice(r, 1)[0]
            }
        }
        //console.log("========2")
        //console.log("Far")
        return this.v.splice(r, 1)[0]
    }
    isEmpty() {
        return (this.v.length == 0)
    }
    size() {
        return this.v.length
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
}

class Tile {
    constructor(pos) {
        // 0 => right; 1 => up; 2 => left; 3 => down
        this.neigh = [null, null, null, null]
        this.pos = pos
    }
    start() {}
    draw(ctx) {
        for (var i = 0; i < 4; i++) {
            if (this.neigh[i] == null) {
                ctx.beginPath()
                let begx = (this.pos[0] + corners[i][0])*pixelSize
                let begy = (this.pos[1] + corners[i][1])*pixelSize
                let endx = (this.pos[0] + corners[(i+1)%4][0])*pixelSize
                let endy = (this.pos[1] + corners[(i+1)%4][1])*pixelSize
                ctx.moveTo(begx, begy)
                ctx.lineTo(endx, endy)
                ctx.lineWidth = 1
                ctx.strokeStyle = Db
                ctx.stroke()
            }
        }
    }
}

var Board = {
    start() {
        this.b = newArray(pheight, (i) => { return newArray(pwidth, (j) => { return new Tile([i, j]) }) })
        this.dfs()
        Game.draw()
        debugger
        this.smooth()
        console.log("ready")
    },
    smooth() {
        for (var i = 0; i < pheight; i++) {
            for (var j = 0; j < pwidth; j++) {
                if (countNeigh([i, j])[0] == 1) {
                    for (var k = 0; k < 4; k++) {
                        var n = [i + dirs[k][0], j + dirs[k][1]]
                        var c = countNeigh(n)
                        if (c[0] == 1) {
                            console.log("Entrou!!")
                            this.b[n[0]][n[1]].neigh[c[1]].neigh[(c[1]+2)%4] = null
                            this.b[n[0]][n[1]].neigh[c[1]] = null
                            this.b[i][j].neigh[k] = this.b[n[0]][n[1]]
                            this.b[n[0]][n[1]].neigh[(k+2)%4] = this.b[i][j]
                            break
                        }
                    }
                }
            }
        }
    },
    dfs() {
        var stack = new Stack()
        var mark = newArray(pheight, (i) => { return newArray(pwidth, (j) => { return false }) })
        stack.push([null, this.b[Math.floor(pwidth/2)][Math.floor(pheight/2)]])
        //mark[0][0] = true
        while(!stack.isEmpty()) {
            var tmp = stack.pop()
            var prev = tmp[0]
            var now = tmp[1]
            if (mark[now.pos[0]][now.pos[1]])
                continue
            if (prev != null) {
                let idx = idn(now.pos, prev.pos)
                now.neigh[idx] = prev
                prev.neigh[(idx+2)%4] = now
            }
            mark[now.pos[0]][now.pos[1]] = true
            tmp = newArray(4, (i) => { return i })
            shuffle(tmp)
            for (let i = 0; i < 4; i++) {
                var next = [dirs[tmp[i]][0] + now.pos[0], dirs[tmp[i]][1] + now.pos[1]]
                if (exists(next) && !mark[next[0]][next[1]]) {
                    stack.push([now ,this.b[next[0]][next[1]]])
                }
            }
            //Game.draw()
            //debugger
        }
    },
    mix() {
        var queue = new RQ()
        var mark = newArray(pheight, (i) => { return newArray(pwidth, (j) => { return false }) })
        queue.enqueue([null, this.b[0][0]])
        mark[0][0] = true
        var now = this.b[0][0]
        var prev = null
        while(!queue.isEmpty()) {
            let tmp = queue.rdequeue(now.pos)
            prev = tmp[0]
            now = tmp[1]
            //if (mark[now.pos[0]][now.pos[1]])
            //    continue
            if (prev != null) {
                let idx = idn(now.pos, prev.pos)
                now.neigh[idx] = prev
                prev.neigh[(idx+2)%4] = now
            }
            //mark[now.pos[0]][now.pos[1]] = true
            for (let i = 0; i < 4; i++) {
                var next = [dirs[i][0]+now.pos[0], dirs[i][1]+now.pos[1]]
                if (exists(next) && !mark[next[0]][next[1]]) {
                    queue.enqueue([now ,this.b[next[0]][next[1]]])
                    mark[next[0]][next[1]] = true
                }
            }
            //Game.draw()
            //debugger
        }
    },
    prim() {
        var queue = new RQ()
        var mark = newArray(pheight, (i) => { return newArray(pwidth, (j) => { return false }) })
        mark[0][0] = true
        queue.enqueue([[0, 0], [0, 1]])
        queue.enqueue([[0, 0], [1, 0]])
        while (!queue.isEmpty()) {
            var tmp = queue.dequeue()
            if (mark[tmp[0][0]][tmp[0][1]] ^ mark[tmp[1][0]][tmp[1][1]]) {
                //console.log("Nice")
                var idx = idn(tmp[0], tmp[1])
                let f = this.b[tmp[0][0]][tmp[0][1]]
                let s = this.b[tmp[1][0]][tmp[1][1]]
                f.neigh[idx] = s
                s.neigh[(idx+2)%4] = f
                idx = Number(mark[tmp[0][0]][tmp[0][1]])
                for (var i = 0; i < 4; i++) {
                    var next = [dirs[i][0] + tmp[idx][0], dirs[i][1] + tmp[idx][1]]
                    if (exists(next) && !mark[next[0]][next[1]])
                        queue.enqueue([tmp[idx], next])
                }
                mark[tmp[0][0]][tmp[0][1]] = true
                mark[tmp[1][0]][tmp[1][1]] = true
            }
        }
    },
    bfs() {
        var queue = new RQ()
        var mark = newArray(pheight, (i) => { return newArray(pwidth, (j) => { return false }) })
        queue.enqueue([null, this.b[0][0]])
        mark[0][0] = true
        while(!queue.isEmpty()) {
            let tmp = queue.dequeue()
            var prev = tmp[0]
            var now = tmp[1]
            if (prev != null) {
                let idx = idn(now.pos, prev.pos)
                now.neigh[idx] = prev
                prev.neigh[(idx+2)%4] = now
            }
            for (let i = 0; i < 4; i++) {
                var next = [dirs[i][0]+now.pos[0], dirs[i][1]+now.pos[1]]
                if (exists(next) && !mark[next[0]][next[1]]) {
                    queue.enqueue([now ,this.b[next[0]][next[1]]])
                    mark[next[0]][next[1]] = true
                }
            }
        }
    },
    draw(ctx) {
        for (var i = 0; i < pheight; i++) {
            for (var j = 0; j < pwidth; j++)
                Board.b[i][j].draw(ctx)
        }
    }
}

var Game = new Canvas("game", rwidth, rheight)

var Background = new Rectangle(0, 0, rwidth, rheight, Wh)

var TestTile = new Tile([5, 5])

function createMaze() {
    Game.reset()
    Game.add(Background, "Background")
    Game.add(Board, "Board")
    //Game.add(TestTile, "Tile")
}

function main() {
    Game.setInputInterval(10)
    Game.setDrawInterval(50)
    Game.bind(90, () => { createMaze() }, KEY_DOWN)
    Game.bind(37, function() { TestTile.neigh[2] = 1 }, KEY_PRESS)
    Game.bind(38, function() { TestTile.neigh[3] = 1 }, KEY_PRESS)
    Game.bind(39, function() { TestTile.neigh[0] = 1 }, KEY_PRESS)
    Game.bind(40, function() { TestTile.neigh[1] = 1 }, KEY_PRESS)
    Game.bind(37, function() { TestTile.neigh[2] = null }, KEY_UP)
    Game.bind(38, function() { TestTile.neigh[3] = null }, KEY_UP)
    Game.bind(39, function() { TestTile.neigh[0] = null }, KEY_UP)
    Game.bind(40, function() { TestTile.neigh[1] = null }, KEY_UP)
    createMaze()
}

window.onload = main;
