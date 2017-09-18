//
// Cube geometry
//
//   4+--------+7
//   /|       /|
// 5+--------+6|
//  | |      | |
//  |0+------|-+3
//  |/       |/
// 1+--------+2
//

var dirs = [[1, 0], [0, -1], [-1, 0], [0, 1]]
var pixelSize = 1
var corners = [[1, 1], [0, 1], [0, 0], [1, 0]]
var pheight = 8
var pwidth = 10
var rheight = pheight*pixelSize
var rwidth = pwidth*pixelSize
var pixelSize2 = 32
var rheight2 = pheight*pixelSize2
var rwidth2 = pwidth*pixelSize2
var limit = 30

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
            if (Math.abs(t[1].pos[0] - pos[0]) <= 1 && Math.abs(t[1].pos[1] - pos[1]) <= 1)
                return this.v.splice(r, 1)[0]
        }
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
                let begx = (this.pos[1] + corners[i][1])*pixelSize2
                let begy = (this.pos[0] + corners[i][0])*pixelSize2
                let endx = (this.pos[1] + corners[(i+1)%4][1])*pixelSize2
                let endy = (this.pos[0] + corners[(i+1)%4][0])*pixelSize2
                ctx.moveTo(begx, begy)
                ctx.lineTo(endx, endy)
                ctx.lineWidth = 1
                ctx.strokeStyle = Db
                ctx.stroke()
            }
        }
    }
}

var Game = new Canvas("testDiv", rheight, rwidth, true)
var Game2 = new Canvas("game", rwidth2, rheight2)
var Background = new Rectangle(0, 0, rwidth2, rheight2, Wh)

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 35, 1, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( 512, 512 );
var div = document.getElementById("testDiv");
div.appendChild( renderer.domElement );
renderer.domElement.setAttribute("id", "view");

//camera.position.z = 25
camera.position.y = -25
//camera.position.z = 7
camera.rotation.x = 6*Math.PI/12


var Board = {
    start() {
        this.b = newArray(pheight, (i) => { return newArray(pwidth, (j) => { return new Tile([i, j]) }) })
        this.dfs()
        console.log("ready")
    },
    dfs() {
        var stack = new Stack()
        var mark = newArray(pheight, (i) => { return newArray(pwidth, (j) => { return false }) })
        stack.push([null, this.b[Math.floor(pheight/2)][Math.floor(pwidth/2)]])
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
        }
    },
    draw(ctx) {
        for (var i = 0; i < pheight; i++) {
            for (var j = 0; j < pwidth; j++)
                Board.b[i][j].draw(ctx)
        }
    }
}

var Ball = {
    start() {
        let geometry = new THREE.SphereBufferGeometry(0.5, 16, 16)
        let material = new THREE.MeshLambertMaterial({color: 0xff0000})
        this.obj = new THREE.Mesh(geometry, material)
        this.obj.position.set(1, 1, 5)
        scene.add(this.obj)
        this.pos = this.obj.position
        this.vel = new THREE.Vector3(0, 0, 0)
        this.sphere = new THREE.Sphere(this.pos, 0.5)
        this.mem = true
    },
    update() {
        //this.accel.z -= (this.mem)? 0.00001 : 0
        this.vel.z -= (this.mem)? 0.001 : 0
        this.pos.add(this.vel)
        this.sphere.center.copy(this.pos)
        if (this.sphere.intersectsBox(bb)) {
            console.log("Gotcha")
            this.vel.reflect(mainPlane.normal)
            this.vel.multiplyScalar(0.7)
            //this.vel.negate()
            let vect = mainPlane.normal.clone()
            vect.setLength(0.6)
            vect.negate()
            vect.add(mainPlane.projectPoint(this.pos))
            this.pos.copy(vect)
        }
    }
}

var cube = new THREE.Group()

var geometry = new THREE.BoxBufferGeometry(pwidth, pheight, 0.05);
var material = new THREE.MeshLambertMaterial({ color: 0xffffff });
var floor = new THREE.Mesh(geometry, material);
geometry.computeBoundingBox()
var bb = geometry.boundingBox
bb.min.z = -1.025
bb.max.z = -0.975
//cube2.visible = false
var mainPlane = new THREE.Plane(new THREE.Vector3(0, 0, -1), -1)

cube.add(floor)
cube.add(bb)
cube.add(mainPlane);

cube.position.set(0, 0, -1)
mainPlane.set(cube.position, -cube.position.lengthSq())
scene.add(cube)

var light = new THREE.PointLight(0xffffff, 1, 100);
light.position.copy(camera.position);
scene.add(light);

function createMaze() {
    var wall;
    var usedv = newArray(pheight, (i) => { return newArray(pwidth+1, (j) => { return null }) })
    var usedh = newArray(pheight+1, (i) => { return newArray(pwidth, (j) => { return null }) })
    for (var i = 0; i < pheight; i++) {
        for (var j = 0; j < pwidth; j++) {
            for (var k = 0; k < 4; k++) {
                var modif = (k == 0 || k == 3)? 1 : 0
                var condv = ((k%2 != 0 && !usedh[i+modif][j]) || (k%2 == 0 && !usedv[i][j+modif]))
                if (Board.b[i][j].neigh[k] == null && condv) {
                    geometry = new THREE.BoxBufferGeometry(1, 1, 0.1)
                    material = new THREE.MeshLambertMaterial({ color : (k%2 == 0)? 0xffffff : 0xff0000 })
                    wall = new THREE.Mesh(geometry, material)
                    wall.rotation.x = Math.PI/2
                    wall.rotation.y = ((k+1)%2)*Math.PI/2
                    let x = j*pixelSize - rwidth/2 + (k%2)*0.5 + ((k+1)%2)*modif
                    let y = i*pixelSize - rheight/2 + ((k+1)%2)*0.5 + (k%2)*modif
                    wall.position.set(x, -y, 0.5)
                    cube.add(wall)
                    if (k%2 != 0)
                        usedh[i+modif][j] = wall
                    else
                        usedv[i][j+modif] = wall
                }
            }
        }
    }
}

function adjustCube() {
    cube.position.z = -Math.sqrt(1 - Math.pow(cube.position.x, 2) - Math.pow(cube.position.y, 2))
    cube.lookAt(new THREE.Vector3(0, 0, 0))
    mainPlane.set(cube.position, -cube.position.lengthSq())
}

function main() {
    Game.setInputInterval(10)
    Game2.setDrawInterval(50)
    Game2.add(Background, "Bg")
    Game2.add(Board, "Board")
    Ball.start()
    var changeFactor = 0.01
    Game.bind(90, () => { Ball.mem = !Ball.mem; Ball.vel.setScalar(0); /*Ball.accel.setScalar(0)*/}, KEY_DOWN)
    Game.bind(37, () => {
        //if (cube.rotation.y >= Math.PI/4)
        //    cube.rotation.y -= 0.1
        if (Math.sqrt(Math.pow(cube.position.x + changeFactor, 2) + Math.pow(cube.position.y, 2)) <= 1) {
            cube.position.x = Math.max(cube.position.x + changeFactor, -1)
            adjustCube()
        }
    }, KEY_PRESS)
    Game.bind(38, () => {
        //if (cube.rotation.x >= -Math.PI/4)
        //    cube.rotation.x -= 0.1
        if (Math.sqrt(Math.pow(cube.position.x, 2) + Math.pow(cube.position.y - changeFactor, 2)) <= 1) {
            cube.position.y = Math.max(cube.position.y - changeFactor, -1)
            adjustCube()
        }
    }, KEY_PRESS)
    Game.bind(39, () => {
        //if (cube.rotation.y <= 3*Math.PI/4)
        //    cube.rotation.y += 0.1
        if (Math.sqrt(Math.pow(cube.position.x - changeFactor, 2) + Math.pow(cube.position.y, 2)) <= 1) {
            cube.position.x = Math.min(cube.position.x - changeFactor, 1)
            adjustCube()
        }
    }, KEY_PRESS)
    Game.bind(40, () => {
        //if (cube.rotation.x <= Math.PI/4)
        //    cube.rotation.x += 0.1
        if (Math.sqrt(Math.pow(cube.position.x, 2) + Math.pow(cube.position.y + changeFactor, 2)) <= 1) {
            cube.position.y = Math.min(cube.position.y + changeFactor, 1)
            adjustCube()
        }
    }, KEY_PRESS)

    var animate = () => {
        requestAnimationFrame(animate);
        Ball.update()
        renderer.render(scene, camera);
    }

    animate()
    //createMaze()
}

window.onload = main;
