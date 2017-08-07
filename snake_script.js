const Wh = "rgb(255, 255, 255)"; // White
const Me = "rgb(130, 130, 130)"; // Metal grey
const Bl = "rgb(0, 0, 0)";       // Black
const Op = "rgba(0, 0, 0, 0.5)"; // Opaque
const Gd = "rgb(255, 215, 0)";   // Gold
const Lg = "rgb(50, 205, 50)";   // Lime green
const Ag = "rgb(100, 240, 110)"  // Apple green
const Mb = "rgb(0, 0, 205)";     // Middle blue
const Db = "rgb(30, 144, 255)";  // Dodger blue
const Do = "rgb(153, 50, 204)";  // Dark orchid
const Rd = "rgb(255, 0, 0)";     // Red
const Or = "rgb(255, 165, 0)";   // Orange

var dirs = [[-1, 0], [0, -1], [1, 0], [0, 1]];
var pixelSize = 16;
var pheight = 32;
var pwidth = 32;
var rheight = pheight*pixelSize;
var rwidth = pwidth*pixelSize;
var pixelBorder = 1;

function wall(x, y) {
    return x < 0 || y < 0 || x >= pwidth || y >= pheight;
}

function mouseInRect(x, y, width, height) {
    var mp = MyIH.mousePos;
    return mp[0] >= x && mp[0] <= x + width && mp[1] >= y && mp[1] <= y + height;
}

function Queue() {
    this.size = 0;
    this.vect = [];
    this.enqueue = function(element) {
        this.vect.push(element);
        this.size++;
    }
    this.dequeue = function(element) {
        this.size--;
        return this.vect.splice(0, 1)[0];
    }
    this.isEmpty = function() {
        return this.size == 0;
    }
    this.getEnd = function() {
        return this.vect[this.size-1];
    }
    this.toString = function() {
        return ArraytoString(this.vect);
    }
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

var MyIH = {
    /* 37 => left
    |  38 => up
    |  39 => right
    |  40 => down
    */
    dir : 2,
    mousePos : [0, 0],
    keysDown : {},
    PPressed : false,
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
        setInterval(MyIH.update, 10);
    },
    update : function () {
        if (37 in MyIH.keysDown)
            MyIH.dir = 0;
        else if (38 in MyIH.keysDown)
            MyIH.dir = 1;
        else if (39 in MyIH.keysDown)
            MyIH.dir = 2;
        else if (40 in MyIH.keysDown)
            MyIH.dir = 3;
        if (Game.ingame) {
            if (80 in MyIH.keysDown && !this.PPressed) {
                pause();
                this.PPressed = true;
            }
            else if (!(80 in MyIH.keysDown) && this.PPressed)
                this.PPressed = false;
        }
    }
}

var Game = {
    canvas : document.getElementById("game"),
    ctx : null,
    objs : {},
    interval : null,
    difs : [150, 100, 50],
    dif : -1,
    ingame : false,
    paused : false,
    start : function(num) {
        this.canvas.width = rwidth;
        this.canvas.height = rheight;
        this.ctx = this.canvas.getContext("2d");
    },
    setDif : function(num) {
        this.dif = num;
        this.interval = setInterval(this.update, this.difs[num]);
    },
    reset : function() {
        this.objs = {};
        this.ctx.clearRect(0, 0, rwidth, rheight);
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
        Game.ctx.clearRect(0, 0, rwidth, rheight);
        for (var k in Game.objs)
            await Game.objs[k].draw();
    },
    click : function() {
        for (var k in Game.objs) {
            if (k[0] == "B" && k[1] == "_") {
                if (!(k in Game.objs))
                    continue;
                Game.objs[k].push();
            }
        }
    },
    resize : function(num) {
        pixelSize += num;
        rwidth = pwidth*pixelSize;
        rheight = pheight*pixelSize;
        this.canvas.width = rwidth;
        this.canvas.height = rheight;
        this.update();
    }
}

var Snake = {
    body : null,
    dir : 2,
    still : false,
    start : function() {
        this.still = false;
        this.dir = 2;
        this.body = new Queue();
        for (var i = 5; i < 10; i++)
            this.body.enqueue(new Pixel(i, 8, Mb));
    },
    move : function() {
        for (var i = 0; i < 4; i++) {
            if (MyIH.dir == i && this.dir != (i+2)%4)
                this.dir = MyIH.dir;
        }
        var head = this.body.getEnd();
        var next = [head.x + dirs[this.dir][0], head.y + dirs[this.dir][1]];
        if (this.inter(next[0], next[1]) || wall(next[0], next[1])) {
            this.still = true;
            gameover();
        }
        else {
            if (Apple.x == next[0] && Apple.y == next[1])
                Apple.reset();
            else
                this.body.dequeue();
            this.body.enqueue(new Pixel(next[0], next[1], Mb));
        }
    },
    draw : function() {
        if (!this.still)
            this.move();
        for (var i = 0; i < this.body.size; i++)
            this.body.vect[i].draw();
    },
    inter : function(x, y) {
        for (var i = 0; i < this.body.size; i++) {
            if (x == this.body.vect[i].x && y == this.body.vect[i].y)
                return true;
        }
        return false;
    }
}

var Apple = {
    x : 0,
    y : 0,
    sqr : null,
    start : function() {
        this.reset();
    },
    reset : function() {
        do {
            this.x = Math.floor(Math.random()*pwidth);
            this.y = Math.floor(Math.random()*pheight);
            this.sqr = new Pixel(this.x, this.y, Rd);
        } while(Snake.inter(this.x, this.y));
        this.sqr.draw();
    },
    draw : function() {
        this.sqr.draw();
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

var Title = new Text(170, 110, "Snake", Bl, "50px bitOperatorBold");
var Paused = new Text((rwidth-200)/2, 110, "Paused", Bl, "50px bitOperator");
var Score = new Text(30, 50, function() {
    var score = (Snake.body.size - 5)*100;
    return "Score: " + score.toString();
}, Bl, "30px bitOperator");

var Background = new Rectangle(0, 0, rwidth, rheight, Wh);
var Dim = new Rectangle(0, 0, rwidth, rheight, Op);
var MenuBg = new Rectangle(0, 0, rwidth, rheight, Ag);

var Easy = new Button("assets/Easy.png", (rwidth-160)/2, 230, startGame, 0);
var Medium = new Button("assets/Medium.png", (rwidth-160)/2, 300, startGame, 1);
var Hard = new Button("assets/Hard.png", (rwidth-160)/2, 370, startGame, 2);
var Restart = new Button("assets/Restart.png", (rwidth-192)/2, 160, showMenu);


function startGame(dif) {
    MyIH.dir = 2;
    Game.reset();
    Game.setDif(dif);
    Game.ingame = true;
    Game.add(Background, "Background");
    Game.add(Snake, "Snake");
    Game.add(Apple, "Apple");
    Game.add(Score, "Score");
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
        Game.setDif(Game.dif);
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
