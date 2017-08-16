var dirs = [[1, 0], [0, -1], [-1, 0], [0, 1]];
var pixelSize = 16;
var pixelBorder = 1;
var pheight = 28;
var pwidth = 26;
var rheight = pheight*pixelSize;
var rwidth = pwidth*pixelSize;

function wall(x, y) {
    return !pointInRect(x, y, 0, 0, pwidth, pheight);
}

function mouseInRect(x, y, width, height) {
    let mp = Game.mousePos;
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
    let arr = [];
    for (let i = 0; i < size; i++)
        arr.push(fill);
    return arr;
}

class Pixel {
    constructor(x, y, col, back) {
        this.x = x;
        this.y = y;
        this.col = col;
        this.back = back;
    }
    start() {}
    draw(ctx) {
        if (this.back !== undefined) {
            ctx.fillStyle = this.back;
            ctx.fillRect(this.x*pixelSize, this.y*pixelSize, pixelSize, pixelSize);
        }
        ctx.fillStyle = this.col;
        ctx.fillRect(this.x*pixelSize+pixelBorder, this.y*pixelSize+pixelBorder, pixelSize-2*pixelBorder, pixelSize-2*pixelBorder);
    }
}

class Piece {
    constructor(num) {
        this.pixels = null;
        this.rot = 0;
        this.rotMat = null;
        this.num = num;
    }
    start() {
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
            default:
                this.pixels.push(new Pixel(0, 0, Wh, Bl));
                this.pixels.push(new Pixel(0, 0, Wh, Bl));
                this.pixels.push(new Pixel(0, 0, Wh, Bl));
                this.pixels.push(new Pixel(0, 0, Wh, Bl));
                this.rotMat = [[[0, 0], [0, 0], [0, 0], [0, 0]],
                               [[0, 0], [0, 0], [0, 0], [0, 0]]];
        }
    }
    rotateR() {
        let sig = msign(Math.abs(this.rot-1.5)-0.5);
        let par = 1 - this.rot%2;
        for (let i = 0; i < 4; i++) {
            this.pixels[i].x += sig*this.rotMat[par][i][0];
            this.pixels[i].y += sig*this.rotMat[par][i][1];
        }
        this.rot = (this.rot + 3)%4;
        for (var i = 0; i < 4; i++) {
            if (Grid.collision(this.pixels[i].x, this.pixels[i].y))
                break;
        }
        if (i != 4)
            this.rotateL();
    }
    rotateL() {
        let sig = msign(2 - this.rot);
        let par = this.rot%2;
        for (let i = 0; i < 4; i++) {
            this.pixels[i].x += sig*this.rotMat[par][i][0];
            this.pixels[i].y += sig*this.rotMat[par][i][1];
        }
        this.rot = (this.rot + 1)%4;
        for (var i = 0; i < 4; i++) {
            if (Grid.collision(this.pixels[i].x, this.pixels[i].y))
                break;
        }
        if (i != 4)
            this.rotateR();
    }
    draw(ctx) {
        for (let i = 0; i < 4; i++)
            this.pixels[i].draw(ctx);
    }
    move(dx, dy) {
        for (let i = 0; i < 4; i++) {
            if (pointInRect(this.pixels[i].x, this.pixels[i].y, Grid.x, Grid.y, Grid.width, Grid.height)) {
                if (Grid.collision(this.pixels[i].x, this.pixels[i].y + dy)) {
                    for (let j = 0; j < 4; j++)
                        Grid.add(this.pixels[j]);
                    Cursor.start();
                    return;
                }
                if (Grid.collision(this.pixels[i].x + dx, this.pixels[i].y))
                    dx = 0;
            }
        }
        for (let i = 0; i < 4; i++) {
            this.pixels[i].x += dx;
            this.pixels[i].y += dy;
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
    start() {
        this.matrix = [];
        for (let i = 0; i < this.height; i++)
            this.matrix.push(newArray(this.width, null));
        this.bg = new Rectangle(this.x*pixelSize, this.y*pixelSize, this.width*pixelSize, this.height*pixelSize, Wh);
    },
    add(pixel) {
        this.matrix[pixel.y - this.y][pixel.x - this.x] = pixel;
    },
    draw(ctx) {
        this.deleteFullRows();
        this.bg.draw(ctx);
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                if (this.matrix[i][j] != null)
                    this.matrix[i][j].draw(ctx);
            }
        }
    },
    deleteFullRows() {
        let del = 0;
        for (let i = 0; i < this.height; i++) {
            for (var j = 0; j < this.width; j++) {
                if (this.matrix[i][j] == null)
                    break;
            }
            if (j == this.width) {
                this.matrix.splice(i, 1);
                this.matrix.unshift(newArray(this.width, null));
                for (let k = 0; k <= i; k++) {
                    for (let l = 0; l < this.width; l++) {
                        if (this.matrix[k][l] != null)
                            this.matrix[k][l].y += 1;
                    }
                }
                del++;
            }
        }
        Gui.score += (del + del*del) * 10;
    },
    collision(x, y) {
        return !pointInRect(x, y, this.x, this.y, this.width-1, this.height-1) || this.matrix[y - this.y][x - this.x] != null;
    }
}

var Cursor = {
    piece : null,
    shadow : new Piece(-1),
    par : false,
    still : false,
    nextDir : -1,
    start() {
        this.still = false;
        this.piece = Gui.getNext();
        this.shadow.start();
        for (var i = 0; i < 4; i++) {
            if (Grid.collision(this.piece.pixels[i].x, this.piece.pixels[i].y))
                break;
        }
        if (i != 4) {
            this.still = true;
            gameover();
        }
        this.calc_shadow();
    },
    draw(ctx) {
        if (this.par)
            this.piece.move(0, 1);
        if (this.nextDir != -1) {
            this.piece.move(dirs[this.nextDir][0], dirs[this.nextDir][1]);
            this.nextDir = -1;
        }
        this.calc_shadow();
        this.par = !this.par;
        this.shadow.draw(ctx);
        this.piece.draw(ctx);
    },
    calc_shadow() {
        for (var i = 1; i < 100; i++) {
            let brk = false;
            for (let j = 0; j < 4; j++) {
                let px = this.piece.pixels[j];
                brk |= Grid.collision(px.x, px.y + i);
            }
            if (brk)
                break;
        }
        for (let j = 0; j < 4; j++) {
            this.shadow.pixels[j].x = this.piece.pixels[j].x;
            this.shadow.pixels[j].y = this.piece.pixels[j].y + i - 1;
        }
    },
    rotateL() {
        if (!this.still)
            this.piece.rotateL();
    },
    rotateR() {
        if (!this.still)
            this.piece.rotateR();
    },
    move(dx, dy) {
        if (!this.still)
            this.piece.move(dx, dy);
    }
}

var Gui = {
    score : 0,
    text : null,
    next : null,
    bg : null,
    start() {
        this.score = 0;
        this.next = new Piece(Math.floor(Math.random()*7));
        this.next.start();
        this.text = new Text(224, 256, function() {
            return "Score: " + Gui.score;
        }, Bl, "30px bitOperator");
        this.bg = new Rectangle(256, 64, 96, 96, Wh);
    },
    getNext() {
        let ret = this.next;
        this.next = new Piece(Math.floor(Math.random()*7));
        this.next.start();
        ret.move(-12, -3);
        return ret;
    },
    draw(ctx) {
        this.text.draw(ctx);
        this.bg.draw(ctx);
        this.next.draw(ctx);
    }
}

var Game = new Canvas("game", rwidth, rheight);

var Title = new Text((rwidth-200)/2, 110, "Tetris", Bl, "50px bitOperatorBold");
var Paused = new Text((rwidth-200)/2, 110, "Paused", Bl, "50px bitOperator");

var Background = new Rectangle(0, 0, rwidth, rheight, Me);
var Dim = new Rectangle(0, 0, rwidth, rheight, Op);
var MenuBg = new Rectangle(0, 0, rwidth, rheight, Me);

var Play = new Button("assets/Play.png", (rwidth-160)/2, 230, startGame);
var Restart = new Button("assets/Restart.png", (rwidth-192)/2, 160, showMenu);


function startGame() {
    Game.reset();
    Game.setDrawInterval(100);
    Game.ingame = true;
    Game.add(Background, "Background");
    Game.add(Gui, "GUI");
    Game.add(Grid, "Grid");
    Game.add(Cursor, "Cursor");
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
