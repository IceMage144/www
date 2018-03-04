var pixelSize = 2;
var pixelBorder = 1;
var pheight = 200;
var pwidth = 200;
var rheight = pheight*pixelSize;
var rwidth = pwidth*pixelSize;
var trigged = true

function newArray(size, fill) {
    let arr = new Array(size);
    for (let i = 0; i < size; i++)
        arr[i] = fill(i);
    return arr;
}


class Grid {
    constructor(mand=true) {
        this.mand = mand
        this.colors = []
        for (var i = 0; i < 255; i += 15)
            this.colors.push("rgb(" + i + "," + i + ",255)")
        for (var i = 255; i > 0; i -= 15)
            this.colors.push("rgb(255,255," + i + ")")
        for (var i = 255; i >= 0; i -= 15)
            this.colors.push("rgb(" + i + "," + i + ",0)")
    }
    start() {
        this.pixels = newArray(pheight, (i) => {
            return newArray(pwidth, (j) => {
                var iterr = 0
                var dist = 0
                var wptrx = 0
                var wptry = 0
                if (this.mand) {
                    wptrx = 2.5*j/pwidth - 2
                    wptry = 2.5*i/pheight - 1.25
                }
                else {
                    wptrx = 4*j/pwidth - 2
                    wptry = 4*i/pheight - 2
                }
                var val = [wptrx, wptry]
                var tmp = 0
                while (dist < 16 && iterr < 51) {
                    if (this.mand) {
                        tmp = val[0]*val[0] - val[1]*val[1] + wptrx;
                        val[1] = 2*val[0]*val[1] + wptry;
                        val[0] = tmp;
                    }
                    else {
                        tmp = val[0]*val[0] - val[1]*val[1];
                        val[1] = 2*val[0]*val[1];
                        val[0] = tmp;
                    }
                    dist = val[0]*val[0] + val[1]*val[1];
                    iterr++;
                }
                return new Rectangle(j*pixelSize, i*pixelSize, pixelSize, pixelSize, this.colors[iterr])
            })
        })
    }
    draw(ctx) {
        for (var i = 0; i < pheight; i++) {
            for (var j = 0; j < pwidth; j++)
                this.pixels[i][j].draw(ctx)
        }
    }
    update(dt) {}
}

var C1 = new Canvas("julia", rheight, rwidth)
var C2 = new Canvas("mand", rheight, rwidth)
var Mand = new Grid()
var Julia = new Grid(false)

function move(x, y) {
    var wptrx = x
    var wptry = y
    for (var i = 0; i < pheight; i++) {
        for (var j = 0; j < pwidth; j++) {
            var iterr = 0
            var dist = 0
            var val = [4*j/pwidth - 2, 4*i/pheight - 2]
            var tmp = 0
            while (dist < 16 && iterr < 51) {
                tmp = val[0]*val[0] - val[1]*val[1] + wptrx;
                val[1] = 2*val[0]*val[1] + wptry;
                val[0] = tmp;
                dist = val[0]*val[0] + val[1]*val[1];
                iterr++;
            }
            Julia.pixels[i][j].col = Julia.colors[iterr]
        }
    }
    document.getElementById("real").value = Math.round(10000*wptrx)/10000
    document.getElementById("imaginary").value = Math.round(10000*wptry)/10000
}

function sub() {
    var real = document.getElementById("real").value;
    var imag = document.getElementById("imaginary").value;
    move(Number(real), Number(imag))
    C1.draw()
}

function increaseResol() {
    if (pixelSize > 1) {
        pixelSize /= 2
        pheight *= 2
        pwidth *= 2
        rheight = pheight*pixelSize
        rwidth = pwidth*pixelSize
        Julia.start()
        Mand.start()
        C1.draw()
        C2.draw()
        document.getElementById("res").textContent = "Resolution: " + pheight
    }
}

function decreaseResol() {
    if (pixelSize < 16) {
        pixelSize *= 2
        pheight /= 2
        pwidth /= 2
        rheight = pheight*pixelSize
        rwidth = pwidth*pixelSize
        Julia.start()
        Mand.start()
        C1.draw()
        C2.draw()
        document.getElementById("res").textContent = "Resolution: " + pheight
    }
}

function main() {
    C2.setInputInterval(10)
    C1.add(Julia, "BG")
    C2.add(Mand, "BG")
    C2.bind(90, () => {
        C2.bindMove("move", () => { move(2.5*C2.mousePos[0]/rwidth - 2, 2.5*C2.mousePos[1]/rheight - 1.25) })
        document.getElementById("real").disabled = true
        document.getElementById("imaginary").disabled = true
        C1.setDrawInterval(100)
        C2.setDrawInterval(100)
    }, KEY_DOWN)
    C2.bind(90, () => {
        C2.bindMove("move", () => { })
        document.getElementById("real").disabled = false
        document.getElementById("imaginary").disabled = false
        C1.stopDraw()
        C2.stopDraw()
    }, KEY_UP)
    move(0, 0)
}

window.onload = main
