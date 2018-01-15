const Op5 = "rgba(0, 0, 0, 0.5)"  // Opaque 50%
const Op2 = "rgba(0, 0, 0, 0.2)"  // Opaque 20%
const Wh = "rgb(255, 255, 255)"   // White
const Me = "rgb(130, 130, 130)"   // Metal grey
const Bl = "rgb(0,   0,   0  )"   // Black
const Gd = "rgb(255, 215, 0  )"   // Gold
const Sa = "rgb(255, 222, 82 )"   // Sand
const Pr = "rgb(238, 232, 170)"   // Pale Golden rod
const Lg = "rgb(50,  205, 50 )"   // Lime green
const Ag = "rgb(100, 240, 110)"   // Apple green
const Pg = "rgb(152, 251, 152)"   // Pale Green
const Lb = "rgb(100, 100, 255)"   // Light blue
const Mb = "rgb(0,   0,   205)"   // Middle blue
const Db = "rgb(30,  144, 255)"   // Dodger blue
const Pt = "rgb(175, 238, 238)"   // Pale Turquoise
const Do = "rgb(153, 50,  204)"   // Dark orchid
const Pv = "rgb(219, 112, 147)"   // Pale Violet red
const Rd = "rgb(255, 0,   0  )"   // Red
const Cr = "rgb(220, 20,  60 )"   // Crimson
const Fb = "rgb(178, 34,  34 )"   // Fire brick
const Or = "rgb(255, 165, 0  )"   // Orange

const KEY_UP = 0;
const KEY_DOWN = 1;
const KEY_PRESS = 2;

const STILL = 0
const BEGTOBEG = -1
const BEGTOEND = 1

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
    update(dt) {}
    draw(ctx) {
        ctx.fillStyle = this.col;
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }
    drawAt(ctx, x, y) {
        ctx.fillStyle = this.col;
        ctx.fillRect(x, y, this.w, this.h);
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
    update(dt) {}
    push(canvas) {
        if (mouseInRect(this.x, this.y, this.img.naturalWidth, this.img.naturalHeight, canvas)) {
            this.call.apply(this, this.args);
            return true
        }
        return false
    }
}

class Text {
    constructor(x, y, text, col, font, sizeMult=[1, 1]) {
        this.x = x;
        this.y = y;
        this.text = text;
        this.col = col;
        this.font = font;
        this.sizeMult = sizeMult
    }
    start() {}
    update(dt) {}
    draw(ctx) {
        ctx.font = this.font;
        ctx.fillStyle = this.col;
        if (this.sizeMult[0] != 1 && this.sizeMult[1] != 1) {
            ctx.save()
            ctx.translate(this.x, this.y)
            ctx.scale(this.sizeMult[0], this.sizeMult[1])
            if (typeof this.text == "string")
                ctx.fillText(this.text, 0, 0);
            else
                ctx.fillText(this.text(), 0, 0);
            ctx.restore()
        }
        else {
            if (typeof this.text == "string")
            ctx.fillText(this.text, this.x, this.y);
            else
            ctx.fillText(this.text(), this.x, this.y);
        }
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
    update(dt) {}
    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y);
    }
    drawSpriteAt(ctx, x, y) {
        ctx.drawImage(this.img, x, y);
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
        this.quad.frame = this.frames[0]
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

class Layer {
    constructor() {
        this.objs = {}
        this.sort = false
        this.sortedKeys = []
    }
}

class Canvas {
    /* 37 => left
    |  38 => up
    |  39 => right
    |  40 => down
    */
    constructor(id, width, height, onlyInput=false) {
        this.canvas = document.getElementById(id);
        this.canvas.width = width;
        this.canvas.height = height;
        if (!onlyInput) {
            let div = document.getElementById("gamediv");
            div.width = width;
            div.height = height;
            this.ctx = this.canvas.getContext("2d");
        }
        this.width = width;
        this.height = height;
        this.layers = [new Layer()];
        this.numLayers = 1
        this.ingame = false;
        this.paused = false;
        this.mousePos = [0, 0];
        this.keysDown = {};
        this.keysHold = {};
        this.keyPressFuncs = {};
        this.keyUpFuncs = {};
        this.keyDownFuncs = {};
        this.clickFuncs = {}
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
        if (this.dInterval)
            this.stopDraw()
        this.dInterval = setInterval(function(t) { t.draw(); }, num, this);
    }
    setInputInterval(num) {
        if (this.iInterval)
            this.stopInput()
        this.iInterval = setInterval(function(t) { t.updateInput(); }, num, this);
    }
    setUpdateInterval(num) {
        if (this.uInterval)
            this.stopUpdate()
        this.uInterval = setInterval(function(t) { t.update(); }, num, this);
        this.dt = num
    }
    reset() {
        this.layers = [new Layer()]
        this.numLayers = 1
        this.ctx.clearRect(0, 0, this.width, this.height);
    }
    stopDraw() {
        clearInterval(this.dInterval);
        this.dInterval = false;
    }
    stopInput() {
        clearInterval(this.iInterval);
        this.iInterval = false;
    }
    stopUpdate() {
        clearInterval(this.uInterval);
        this.uInterval = false;
    }
    add(e, name, layer=0) {
        if (layer >= this.numLayers || layer < 0)
            throw new RangeError("Layer " + layer + " doesn't exists")
        this.layers[layer].objs[name] = e;
        this.layers[layer].sortedKeys.push(name)
        e.start();
        e.draw(this.ctx);
    }
    del(name, layer=0) {
        var index = this.layers[layer].sortedKeys.indexOf(name)
        if (index != -1)
            this.layers[layer].sortedKeys.splice(index, 1)
        delete this.layers[layer].objs[name];
    }
    get(name, layer=0) {
        return this.layers[layer].objs[name];
    }
    addLayer(num=1) {
        for (let i = 0; i < num; i++) {
            this.layers[this.numLayers] = new Layer()
            this.numLayers++
        }
    }
    setLayerProp(layer, prop, val) {
        console.log(layer)
        this.layers[layer][prop] = val
    }
    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        for (let l = 0; l < this.numLayers; l++) {
            if (this.layers[l].sort)
                this.layers[l].sortedKeys.sort(((l, a, b) => { return l.objs[a].y - l.objs[b].y }).bind(null, this.layers[l]))
            for (let k = 0; k < this.layers[l].sortedKeys.length; k++)
                this.layers[l].objs[this.layers[l].sortedKeys[k]].draw(this.ctx);
        }
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
    update() {
        for (let l = 0; l < this.numLayers; l++) {
            for (let k in this.layers[l].objs)
                this.layers[l].objs[k].update(this.dt);
        }
    }
    click() {
        if (!this.paused) {
            for (let l = 0; l < this.numLayers; l++) {
                for (let k in this.layers[l].objs) {
                    if (k.indexOf("B_") != -1) {
                        if (!(k in this.layers[l].objs))
                            continue;
                        if (this.layers[l].objs[k].push(this))
                            return;
                    }
                }
            }
            for (let k in this.clickFuncs)
                this.clickFuncs[k]()
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
    scale(x, y) {
        this.ctx.scale(x, y)
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
    bindClick(key, func) {
        this.clickFuncs[key] = func
    }
}
