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

var radius = 15
var mradius = 7
var visionTheta = Math.PI/4
var vsin = Math.sin(visionTheta)
var vcos = Math.cos(visionTheta)

var changeFactor = 0.2 // How much the camera will walk on the surface of the sphere
var changeAngle = changeFactor/radius
var csin = Math.sin(changeAngle)
var ccos = Math.cos(changeAngle)

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

function sign(num) {
    return (num >= 0)? 1 : -1
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
        this.walls = [null, null, null, null]
        this.pos = pos
        this.coord = new THREE.Vector2(pos[1]*pixelSize - rwidth/2 + 0.5, - pos[0]*pixelSize + rheight/2 - 0.5)
    }
}

class Wall {
    constructor(x, y, ry, plane) {
        var geometry = new THREE.BoxBufferGeometry(1, 1, 0.1)
        var material = new THREE.MeshToonMaterial({ color : "rgb(220, 30, 30)" })
        this.obj = new THREE.Mesh(geometry, material)
        this.obj.rotation.x = Math.PI/2
        this.obj.rotation.y = ry
        this.obj.position.set(x, y, 0)
        scene.add(this.obj)
        this.plane = plane
        this.box = new THREE.Box3()
        this.box.setFromObject(this.obj)
    }
}

var IH = new Canvas("gamediv", rheight, rwidth, true)

var scene = new THREE.Scene()
scene.background = new THREE.Color(Wh)

var renderer = new THREE.WebGLRenderer()
renderer.setSize(512, 512)
var div = document.getElementById("gamediv")
div.appendChild( renderer.domElement )
renderer.domElement.setAttribute("id", "view")

var light = new THREE.PointLight(0xffffff, 1, 100)
light.position.z = radius
scene.add(light)

var Camera = {
    start() {
        this.obj = new THREE.PerspectiveCamera(50, 1, 0.1, 1000)
        this.memPos = new THREE.Vector3()
        this.adjust()
    },
    adjust() {
        this.memPos.z = Math.sqrt(radius*radius - Math.pow(this.memPos.x, 2) - Math.pow(this.memPos.y, 2))
        this.obj.position.x = this.memPos.x
        this.obj.position.y = this.memPos.y*vcos - this.memPos.z*vsin
        this.obj.position.z = this.memPos.y*vsin + this.memPos.z*vcos
        this.obj.lookAt(new THREE.Vector3())
    },
    tryMoveRight() {
        if (Math.sqrt(Math.pow(this.memPos.x*ccos + this.memPos.z*csin, 2) + Math.pow(this.memPos.y, 2)) <= mradius) {
            this.memPos.x = this.memPos.x*ccos + this.memPos.z*csin
            this.adjust()
            return true
        }
        return false
    },
    tryMoveUp() {
        if (Math.sqrt(Math.pow(this.memPos.x, 2) + Math.pow(this.memPos.y*ccos + this.memPos.z*csin, 2)) <= mradius) {
            this.memPos.y = this.memPos.y*ccos + this.memPos.z*csin
            this.adjust()
            return true
        }
        return false
    },
    tryMoveLeft() {
        if (Math.sqrt(Math.pow(this.memPos.x*ccos - this.memPos.z*csin, 2) + Math.pow(this.memPos.y, 2)) <= mradius) {
            this.memPos.x = this.memPos.x*ccos - this.memPos.z*csin
            this.adjust()
            return true
        }
        return false
    },
    tryMoveDown() {
        if (Math.sqrt(Math.pow(this.memPos.x, 2) + Math.pow(this.memPos.y*ccos - this.memPos.z*csin, 2)) <= mradius) {
            this.memPos.y = this.memPos.y*ccos - this.memPos.z*csin
            this.adjust()
            return true
        }
        return false
    }
}

var Board = {
    start() {
        var geometry = new THREE.BoxBufferGeometry(pwidth, pheight, 0.05)
        var material = new THREE.MeshLambertMaterial({ color: Me })
        this.floor = new THREE.Mesh(geometry, material)
        this.floor.position.set(0, 0, -0.5)
        scene.add(this.floor)
        this.mainPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)
        this.b = newArray(pheight, (i) => { return newArray(pwidth, (j) => { return new Tile([i, j]) }) })
        this.dfs()
        this.createMaze()
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
    createMaze() {
        var wall;
        var usedv = newArray(pheight, (i) => { return newArray(pwidth+1, (j) => { return null }) })
        var usedh = newArray(pheight+1, (i) => { return newArray(pwidth, (j) => { return null }) })
        var vplanes = newArray(pwidth+1, (i) => { return new THREE.Plane(new THREE.Vector3(1, 0, 0), rwidth/2 - i*pixelSize) })
        var hplanes = newArray(pheight+1, (i) => { return new THREE.Plane(new THREE.Vector3(0, 1, 0), i*pixelSize - rheight/2) })
        var count = 0
        for (var i = 0; i < pheight; i++) {
            for (var j = 0; j < pwidth; j++) {
                for (var k = 0; k < 4; k++) {
                    var modif = (k == 0 || k == 3)? 1 : 0
                    var condv = (k%2 == 0 && !usedv[i][j+modif])
                    var condh = (k%2 != 0 && !usedh[i+modif][j])
                    if (this.b[i][j].neigh[k] == null && (condv || condh)) {
                        let x = j*pixelSize - rwidth/2 + (k%2)*0.5 + ((k+1)%2)*modif
                        let y = i*pixelSize - rheight/2 + ((k+1)%2)*0.5 + (k%2)*modif
                        wall = new Wall(x, -y, ((k+1)%2)*Math.PI/2, (condv)? vplanes[j+modif] : hplanes[i+modif])
                        if (k%2 != 0)
                            usedh[i+modif][j] = wall
                        else
                            usedv[i][j+modif] = wall
                    }
                    if (k%2 == 0 && usedv[i][j+modif])
                        this.b[i][j].walls[k] = usedv[i][j+modif]
                    else if (k%2 != 0 && usedh[i+modif][j])
                        this.b[i][j].walls[k] = usedh[i+modif][j]
                }
            }
        }
        var geometry = new THREE.BoxBufferGeometry(1, 1, 0.1)
        var material = new THREE.MeshToonMaterial({ color : Lg })
        var end = new THREE.Mesh(geometry, material)
        end.position.set(rwidth/2-0.5, -rheight/2+0.5, -0.5)
        scene.add(end)
    }
}

var Ball = {
    start() {
        this.rad = 0.3
        let geometry = new THREE.SphereBufferGeometry(this.rad, 16, 16)
        let material = new THREE.MeshToonMaterial({color: Db})
        this.obj = new THREE.Mesh(geometry, material)
        this.obj.position.set(-rwidth/2+0.5, rheight/2-0.5, 0)
        scene.add(this.obj)
        this.pos = this.obj.position
        this.vel = new THREE.Vector3(0, 0, 0)
        this.sphere = new THREE.Sphere(this.pos, this.rad)
        this.sphere.center = this.pos
        this.mem = true
        this.act = Board.b[0][0]
        this.vision = [[0, 0]]
        for (var i = 0; i < 4; i++) {
            if (Board.b[0][0].neigh[i] != null)
                this.vision.push(Board.b[0][0].neigh[i].pos)
        }
    },
    update() {
        this.vel.add(Board.mainPlane.projectPoint(Camera.memPos.clone().negate().setLength(0.01)))
        this.vel.setLength(Math.min(this.vel.length(), 0.055)) // 0.055
        this.pos.add(this.vel)
        var newVel = this.vel.clone()
        var enter = false
        var vect
        for (vis of this.vision) {
            var t = Board.b[vis[0]][vis[1]]
            for (wall of t.walls) {
                if (wall != null && wall.box.intersectsSphere(this.sphere)) {
                    newVel.reflect(wall.plane.normal)
                    vect = wall.plane.normal.clone().setLength(this.rad + 0.055)
                    if (wall.plane.normal.dot(this.pos.clone().sub(wall.obj.position)) < 0)
                        vect.negate()
                    vect.add(wall.plane.projectPoint(this.pos))
                    enter = true
                }
            }
        }
        if (enter) {
            this.vel.copy(newVel.multiplyScalar(0.7))
            this.pos.copy(vect)
        }
        for (val of this.vision) {
            var t = Board.b[val[0]][val[1]]
            if (t.coord.distanceToSquared(this.pos) < this.act.coord.distanceToSquared(this.pos)) {
                this.act = t
                this.vision = [val]
                for (n of Board.b[val[0]][val[1]].neigh) {
                    if (n != null)
                        this.vision.push(n.pos)
                }
                break
            }
        }
    }
}

/*
| 37 => left
| 38 => up
| 39 => right
| 40 => down
| 90 => Z
| 65 => A
| 83 => S
| 68 => D
| 87 => W
*/
function main() {
    IH.setInputInterval(10)

    Board.start()
    Ball.start()
    Camera.start()

    IH.bind(37, () => { Camera.tryMoveLeft() || Camera.tryMoveUp() || Camera.tryMoveDown() }, KEY_PRESS)
    IH.bind(38, () => { Camera.tryMoveUp() || Camera.tryMoveRight() || Camera.tryMoveLeft() }, KEY_PRESS)
    IH.bind(39, () => { Camera.tryMoveRight() || Camera.tryMoveDown() || Camera.tryMoveUp() }, KEY_PRESS)
    IH.bind(40, () => { Camera.tryMoveDown() || Camera.tryMoveLeft() || Camera.tryMoveRight() }, KEY_PRESS)
    /*IH.bind(65, () => { Ball.pos.x -= 0.01 }, KEY_PRESS)
    IH.bind(83, () => { Ball.pos.y -= 0.01 }, KEY_PRESS)
    IH.bind(68, () => { Ball.pos.x += 0.01 }, KEY_PRESS)
    IH.bind(87, () => { Ball.pos.y += 0.01 }, KEY_PRESS)*/

    var animate = () => {
        requestAnimationFrame(animate);
        Ball.update()
        renderer.render(scene, Camera.obj);
    }

    animate()
}

window.onload = main;
