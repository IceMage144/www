const Wh = "rgb(255, 255, 255)"; // White
const Bl = "rgb(0, 0, 0)";       // Black
const Op = "rgba(0, 0, 0, 0.5)"; // Opaque
const Gd = "rgb(255, 215, 0)";   // Gold
const Lg = "rgb(50, 205, 50)";   // Lime green
const Mb = "rgb(0, 0, 205)";     // Middle blue
const Rd = "rgb(255, 0, 0)";     // Red
const Db = "rgb(30, 144, 255)";  // Dodger blue
const Or = "rgb(255, 165, 0)";   // Orange
const Do = "rgb(153, 50, 204)";  // Dark orchid
const Me = "rgb(130, 130, 130)"; // Metal grey

var dirs = [[1, 0], [0, -1], [-1, 0], [0, 1]];
var height = 448;
var width = 416;
var pixelSize = 16;
var pixelBorder = 1;

function wall(x, y) {
    return !pointInRect(x, y, 0, 0, width/pixelSize, height/pixelSize);
}

function mouseInRect(x, y, width, height) {
    var mp = MyIH.mousePos;
    return pointInRect(mp[0], mp[1], x, y, width, height);
}

function pointInRect(px, py, rx, ry, width, height) {
    return px >= rx && px <= rx + width && py >= ry && py <= ry + height;
}

function msign(num) {
    if (num <= 0)
        return -1;
    return 1;
}

function newArray(size, fill) {
    var arr = [];
    for (var i = 0; i < size; i++)
        arr.push(fill);
    return arr;
}

function Pixel(x, y, col) {
    this.x = x;
    this.y = y;
    this.col = col;
    this.draw = function() {
        //Game.ctx.fillStyle = "black";
        //Game.ctx.fillRect(this.x*pixelSize, this.y*pixelSize, pixelSize, pixelSize);
        Game.ctx.fillStyle = this.col;
        Game.ctx.fillRect(this.x*pixelSize+pixelBorder, this.y*pixelSize+pixelBorder, pixelSize-2*pixelBorder, pixelSize-2*pixelBorder);
    }
}

function Rectangle(x, y, w, h, col) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.col = col;
    this.start = function() {
        this.draw();
    }
    this.draw = function() {
        Game.ctx.fillStyle = this.col;
        Game.ctx.fillRect(this.x, this.y, this.w, this.h);
    }
}

function Button(src, x, y, call) {
    this.img = new Image();
    this.img.src = src;
    this.x = x;
    this.y = y;
    this.call = call;
    this.args = Array.prototype.slice.call(arguments);
    this.args.splice(0, 4);
    this.start = function() {
        this.draw();
    }
    this.draw = function() {
        Game.ctx.drawImage(this.img, this.x, this.y);
    }
    this.push = function() {
        if (mouseInRect(this.x, this.y, this.img.naturalWidth, this.img.naturalHeight))
            this.call.apply(this, this.args);
    }
}

function Text(x, y, text, col, font) {
    this.x = x;
    this.y = y;
    this.text = text;
    this.col = col;
    this.font = font;
    this.start = function() {
        this.draw();
    }
    this.draw = function() {
        Game.ctx.font = this.font;
        Game.ctx.fillStyle = this.col;
        if (typeof this.text == "string")
            Game.ctx.fillText(this.text, this.x, this.y);
        else
            Game.ctx.fillText(this.text(), this.x, this.y);
    }
}

function Piece(num) {
    this.pixels = null;
    this.rot = 0;
    this.rotMat = null;
    this.num = num;
    this.start = function() {
        this.pixels = [];
        this.rot = 0;
        switch (this.num) {
            case 0: // T
                this.pixels.push(new Pixel(18, 6, Lg));
                this.pixels.push(new Pixel(19, 6, Lg));
                this.pixels.push(new Pixel(19, 7, Lg));
                this.pixels.push(new Pixel(20, 6, Lg));
                this.rotMat = [[[1,  1], [0, 0], [ 1, -1], [-1, -1]],
                               [[1, -1], [0, 0], [-1, -1], [-1,  1]]];
                break;
            case 1: // O
                this.pixels.push(new Pixel(18, 6, Mb));
                this.pixels.push(new Pixel(18, 7, Mb));
                this.pixels.push(new Pixel(19, 6, Mb));
                this.pixels.push(new Pixel(19, 7, Mb));
                this.rotMat = [[[0, 0], [0, 0], [0, 0], [0, 0]],
                               [[0, 0], [0, 0], [0, 0], [0, 0]]];
                break;
            case 2: // I
                this.pixels.push(new Pixel(19, 5, Rd));
                this.pixels.push(new Pixel(19, 6, Rd));
                this.pixels.push(new Pixel(19, 7, Rd));
                this.pixels.push(new Pixel(19, 8, Rd));
                this.rotMat = [[[ 1, 1], [ 0, 0], [-1, -1], [-2, -2]],
                               [[-2, 2], [-1, 1], [ 0,  0], [ 1, -1]]];
                break;
            case 3: // S
                this.pixels.push(new Pixel(18, 7, Db));
                this.pixels.push(new Pixel(19, 7, Db));
                this.pixels.push(new Pixel(19, 6, Db));
                this.pixels.push(new Pixel(20, 6, Db));
                this.rotMat = [[[1,  1], [0, 0], [-1, 1], [-2, 0]],
                               [[1, -1], [0, 0], [ 1, 1], [ 0, 2]]];
                break;
            case 4: // Z
                this.pixels.push(new Pixel(18, 6, Or));
                this.pixels.push(new Pixel(19, 6, Or));
                this.pixels.push(new Pixel(19, 7, Or));
                this.pixels.push(new Pixel(20, 7, Or));
                this.rotMat = [[[0, 2], [-1, 1], [0, 0], [-1, -1]],
                               [[2, 0], [ 1, 1], [0, 0], [-1,  1]]];
                break;
            case 5: // L
                this.pixels.push(new Pixel(19, 6, Do));
                this.pixels.push(new Pixel(19, 7, Do));
                this.pixels.push(new Pixel(19, 8, Do));
                this.pixels.push(new Pixel(20, 8, Do));
                this.rotMat = [[[-1, 1], [0, 0], [ 1, -1], [ 0, -2]],
                               [[ 1, 1], [0, 0], [-1, -1], [-2,  0]]];
                break;
            case 6: // J
                this.pixels.push(new Pixel(19, 6, Gd));
                this.pixels.push(new Pixel(19, 7, Gd));
                this.pixels.push(new Pixel(19, 8, Gd));
                this.pixels.push(new Pixel(18, 8, Gd));
                this.rotMat = [[[-1, 1], [0, 0], [ 1, -1], [2,  0]],
                               [[ 1, 1], [0, 0], [-1, -1], [0, -2]]];
                break;
        }
    }
    this.rotateR = function() {
        var sig = msign(Math.abs(this.rot-1.5)-0.5);
        var par = 1 - this.rot%2;
        for (var i = 0; i < 4; i++) {
            this.pixels[i].x += sig*this.rotMat[par][i][0];
            this.pixels[i].y += sig*this.rotMat[par][i][1];
        }
        this.rot = (this.rot + 3)%4;
        var i = 0;
        for (i = 0; i < 4; i++) {
            if (Grid.collision(this.pixels[i].x, this.pixels[i].y))
                break;
        }
        if (i != 4)
            this.rotateL();
    }
    this.rotateL = function() {
        var sig = msign(2 - this.rot);
        var par = this.rot%2;
        for (var i = 0; i < 4; i++) {
            this.pixels[i].x += sig*this.rotMat[par][i][0];
            this.pixels[i].y += sig*this.rotMat[par][i][1];
        }
        this.rot = (this.rot + 1)%4;
        var i = 0;
        for (i = 0; i < 4; i++) {
            if (Grid.collision(this.pixels[i].x, this.pixels[i].y))
                break;
        }
        if (i != 4)
            this.rotateR();
    }
    this.draw = function() {
        for (var i = 0; i < 4; i++)
            this.pixels[i].draw();
    }
    this.move = function(dx, dy) {
        for (var i = 0; i < 4; i++) {
            if (pointInRect(this.pixels[i].x, this.pixels[i].y, Grid.x, Grid.y, Grid.width, Grid.height)) {
                if (Grid.collision(this.pixels[i].x, this.pixels[i].y + dy)) {
                    for (var i = 0; i < 4; i++)
                        Grid.add(this.pixels[i]);
                    Cursor.start();
                    return;
                }
                if (Grid.collision(this.pixels[i].x + dx, this.pixels[i].y))
                    dx = 0;
            }
        }
        for (var i = 0; i < 4; i++) {
            this.pixels[i].x += dx;
            this.pixels[i].y += dy;
        }
    }
}


var MyIH = {
    /* 37 => left
    |  38 => up
    |  39 => right
    |  40 => down
    */
    mousePos : [0, 0],
    keysDown : {},
    start : function() {
        this.dir = 2;
        addEventListener("keydown", function (e) {
            e.preventDefault();
        	MyIH.keysDown[e.keyCode] = true;
        }, false);
        addEventListener("keyup", function (e) {
            e.preventDefault();
        	delete MyIH.keysDown[e.keyCode];
        }, false);
        addEventListener('mousemove', function(e) {
            var rect = Game.canvas.getBoundingClientRect();
            MyIH.mousePos = [e.clientX - rect.left, e.clientY - rect.top];
        }, false);
        addEventListener("click", function(e) {
            Game.click();
        }, false);
        setInterval(MyIH.update, 100);
    },
    update : function () {
        if (37 in MyIH.keysDown)
            Cursor.nextDir = 2;
        else if (39 in MyIH.keysDown)
            Cursor.nextDir = 0;
        else if (40 in MyIH.keysDown)
            Cursor.nextDir = 3;
        else if (83 in MyIH.keysDown)
            Game.stop();
        if (80 in MyIH.keysDown) {
            if (Game.ingame)
                pause();
        }
    }
}

var Game = {
    canvas : document.getElementById("game"),
    ctx : null,
    objs : {},
    interval : null,
    paused : false,
    ingame : false,
    start : function(num) {
        this.canvas.width = width;
        this.canvas.height = height;
        this.ctx = this.canvas.getContext("2d");
    },
    setInt : function(num) {
        this.interval = setInterval(this.update, 100);
    },
    reset : function() {
        this.objs = {};
        this.ctx.clearRect(0, 0, width, height);
    },
    stop : function() {
        clearInterval(this.interval);
    },
    add : function(e, name) {
        this.objs[name] = e;
        e.start();
    },
    del : function(name) {
        delete this.objs[name];
    },
    get : function(name) {
        return this.objs[name];
    },
    update : async function() {
        Game.ctx.clearRect(0, 0, width, height);
        if (90 in MyIH.keysDown && "Cursor" in Game.objs)
            Game.objs["Cursor"].rotateL();
        else if (88 in MyIH.keysDown && "Cursor" in Game.objs)
            Game.objs["Cursor"].rotateR();
        for (var k in Game.objs) {
            await Game.objs[k].draw();
        }
    },
    click : function() {
        for (var k in Game.objs) {
            if (k.includes("B_")) {
                if (!(k in Game.objs))
                    continue;
                Game.objs[k].push();
            }
        }
    }
}

var Grid = {
    x : 2,
    y : 2,
    height : 24,
    width : 10,
    matrix : [],
    bg : null,
    start : function() {
        this.matrix = [];
        for (var i = 0; i < this.height; i++)
            this.matrix.push(newArray(this.width, null));
        this.bg = new Rectangle(this.x*pixelSize, this.y*pixelSize, this.width*pixelSize, this.height*pixelSize, Wh);
    },
    add : function(pixel) {
        this.matrix[pixel.y - this.y][pixel.x - this.x] = pixel;
    },
    draw : function() {
        this.deleteFullRows();
        this.bg.draw();
        for (var i = 0; i < this.height; i++) {
            for (var j = 0; j < this.width; j++) {
                if (this.matrix[i][j] != null)
                    this.matrix[i][j].draw();
            }
        }
    },
    deleteFullRows : function() {
        var j = 0;
        var del = 0;
        for (var i = 0; i < this.height; i++) {
            for (j = 0; j < this.width; j++) {
                if (this.matrix[i][j] == null)
                    break;
            }
            if (j == this.width) {
                this.matrix.splice(i, 1);
                this.matrix.unshift(newArray(this.width, null));
                for (var k = 0; k <= i; k++) {
                    for (var l = 0; l < this.width; l++) {
                        if (this.matrix[k][l] != null)
                            this.matrix[k][l].y += 1;
                    }
                }
                del++;
            }
        }
        Gui.score += (del + del*del) * 10;
    },
    collision : function(x, y) {
        return !pointInRect(x, y, this.x, this.y, this.width-1, this.height-1) || this.matrix[y - this.y][x - this.x] != null;
    }
}

var Cursor = {
    piece : null,
    par : false,
    still : false,
    nextDir : -1,
    start : function() {
        this.still = false;
        this.piece = Gui.getNext();
        var i = 0;
        for (i = 0; i < 4; i++) {
            if (Grid.collision(this.piece.pixels[i].x, this.piece.pixels[i].y))
                break;
        }
        if (i != 4) {
            this.still = true;
            gameover();
        }
    },
    draw : function() {
        if (this.par)
            this.piece.move(0, 1);
        if (this.nextDir != -1) {
            this.piece.move(dirs[this.nextDir][0], dirs[this.nextDir][1]);
            this.nextDir = -1;
        }
        this.par = !this.par;
        this.piece.draw();
    },
    rotateL : function() {
        if (!this.still)
            this.piece.rotateL();
    },
    rotateR : function() {
        if (!this.still)
            this.piece.rotateR();
    },
    move : function(dx, dy) {
        if (!this.still)
            this.piece.move(dx, dy);
    }
}

var Gui = {
    score : 0,
    text : null,
    next : null,
    bg : null,
    start : function() {
        this.score = 0;
        this.next = new Piece(Math.floor(Math.random()*7));
        this.next.start();
        this.text = new Text(224, 256, function() {
            return "Score: " + Gui.score;
        }, Bl, "30px bitOperator");
        this.bg = new Rectangle(256, 64, 96, 96, Wh);
    },
    getNext : function() {
        var ret = this.next;
        this.next = new Piece(Math.floor(Math.random()*7));
        this.next.start();
        ret.move(-12, -3);
        return ret;
    },
    draw : function() {
        this.text.draw();
        this.bg.draw();
        this.next.draw();
    }
}

var Title = new Text((this.width-200)/2, 110, "Tetris", Bl, "50px bitOperatorBold");
var Paused = new Text((this.width-200)/2, 110, "Paused", Bl, "50px bitOperator")

var Background = new Rectangle(0, 0, width, height, Me);
var Dim = new Rectangle(0, 0, width, height, Op);
var MenuBg = new Rectangle(0, 0, width, height, Me);

var Easy = new Button("assets/Play.png", (this.width-160)/2, 230, startGame);
var Restart = new Button("assets/Restart.png", (this.width-192)/2, 160, showMenu);


async function startGame() {
    Game.reset();
    Game.setInt();
    Game.ingame = true;
    Game.add(Background, "Background");
    Game.add(Gui, "GUI");
    Game.add(Grid, "Grid");
    Game.add(Cursor, "Cursor");
}

function gameover() {
    Game.add(Dim, "Dim");
    Game.add(Restart, "B_Restart");
    Game.update();
    Game.stop();
    Game.ingame = false;
}

function pause() {
    if (!Game.paused) {
        Game.add(Dim, "Dim");
        Game.add(Paused, "Paused");
        Game.stop();
        Game.paused = true;
    }
    else {
        Game.del("Dim");
        Game.del("Paused");
        Game.setInt();
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
    MyIH.start();
    Game.start();
    showMenu();
}

window.onload = main;
