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

const KEY_UP = 0;
const KEY_DOWN = 1;
const KEY_PRESS = 2;

function mouseInRect(x, y, width, height, canvas) {
    let mp = canvas.mousePos;
    return mp[0] >= x && mp[0] <= x + width && mp[1] >= y && mp[1] <= y + height;
}

function sq(x) {
    return x*x;
}

class Rectangle {
    constructor(x, y, w, h, col) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.col = col;
    }
    start() {}
    draw(ctx) {
        ctx.fillStyle = this.col;
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }
}

class Button {
    constructor(src, x, y, call) {
        this.img = new Image();
        this.img.src = src;
        this.x = x;
        this.y = y;
        this.call = call;
        this.args = Array.prototype.slice.call(arguments);
        this.args.splice(0, 4);
    }
    start() {}
    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y);
    }
    push(canvas) {
        if (mouseInRect(this.x, this.y, this.img.naturalWidth, this.img.naturalHeight, canvas))
            this.call.apply(this, this.args);
    }
}

class Text {
    constructor(x, y, text, col, font) {
        this.x = x;
        this.y = y;
        this.text = text;
        this.col = col;
        this.font = font;
    }
    start() {}
    draw(ctx) {
        ctx.font = this.font;
        ctx.fillStyle = this.col;
        if (typeof this.text == "string")
            ctx.fillText(this.text, this.x, this.y);
        else
            ctx.fillText(this.text(), this.x, this.y);
    }
}

class Sprite {
    constructor(src, x, y) {
        this.x = x;
        this.y = y;
        this.img = new Image();
        this.img.src = src;
    }
    start() {}
    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y);
    }
}

class Canvas {
    /* 37 => left
    |  38 => up
    |  39 => right
    |  40 => down
    */
    constructor(id, width, height) {
        let div = document.getElementById("gamediv");
        div.width = width;
        div.height = height;
        this.width = width;
        this.height = height;
        this.canvas = document.getElementById(id);
        this.canvas.width = width;
        this.canvas.height = height;
        this.ctx = this.canvas.getContext("2d");
        this.objs = {};
        this.interval = null;
        this.ingame = false;
        this.paused = false;
        this.mousePos = [0, 0];
        this.keysDown = {};
        this.keysHold = {};
        this.keyPressFuncs = {};
        this.keyUpFuncs = {};
        this.keyDownFuncs = {};
        var bindClick = (function(e) { this.click(); }).bind(this);
        var bindKeyDown = (function(e) {
            e.preventDefault();
            if (e.keyCode in this.keysDown)
                this.keysDown[e.keyCode] = true;
        }).bind(this);
        var bindKeyUp = (function(e) {
            e.preventDefault();
            if (e.keyCode in this.keysDown)
                this.keysDown[e.keyCode] = false;
        }).bind(this);
        var bindMouseMove = (function(e) {
            let rect = this.canvas.getBoundingClientRect();
            this.mousePos = [e.clientX - rect.left, e.clientY - rect.top];
        }).bind(this);
        addEventListener("keydown", bindKeyDown, false);
        addEventListener("keyup", bindKeyUp, false);
        addEventListener('mousemove', bindMouseMove, false);
        addEventListener("click", bindClick, false);
    }
    setDrawInterval(num) {
        this.dInterval = setInterval(function(t) { t.draw(); }, num, this);
    }
    setInputInterval(num) {
        this.iInterval = setInterval(function(t) { t.updateInput(); }, num, this);
    }
    reset() {
        this.objs = {};
        this.ctx.clearRect(0, 0, this.width, this.height);
    }
    stopDraw() {
        clearInterval(this.dInterval);
    }
    stopInput() {
        clearInterval(this.iInterval);
    }
    add(e, name) {
        this.objs[name] = e;
        e.start();
        e.draw(this.ctx);
    }
    del(name) {
        delete this.objs[name];
    }
    get(name) {
        return this.objs[name];
    }
    async draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        for (let k in this.objs)
            await this.objs[k].draw(this.ctx);
    }
    updateInput() {
        for (let k in this.keysDown) {
            if (this.keysDown[k] && !this.keysHold[k]) {
                if (k in this.keyDownFuncs)
                    this.keyDownFuncs[k]();
                this.keysHold[k] = true;
            }
            if (!this.keysDown[k] && this.keysHold[k]) {
                if (k in this.keyUpFuncs)
                    this.keyUpFuncs[k]();
                this.keysHold[k] = false;
            }
            if (this.keysDown[k] && k in this.keyPressFuncs) {
                this.keyPressFuncs[k]();
            }
        }
    }
    click() {
        for (let k in this.objs) {
            if (k.indexOf("B_") != -1) {
                if (!(k in this.objs))
                    continue;
                this.objs[k].push(this);
            }
        }
    }
    resize(num) {
        pixelSize += num;
        rwidth = pwidth*pixelSize;
        rheight = pheight*pixelSize;
        this.canvas.width = rwidth;
        this.canvas.height = rheight;
        this.draw();
    }
    bind(key, func, e) {
        this.keysDown[key] = false;
        this.keysHold[key] = false;
        switch (e) {
            case KEY_DOWN:
                this.keyDownFuncs[key] = func;
                break;
            case KEY_UP:
                this.keyUpFuncs[key] = func;
                break;
            case KEY_PRESS:
                this.keyPressFuncs[key] = func;
                break;
        }
    }
}
