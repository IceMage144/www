function Token (type, value, args) {
    this.type = type;
    this.value = value;
    this.args = args;
}

function funcRes (bool, type, args) {
    this.bool = bool;
    this.type = type;
    this.args = args;
}

function Stack () {
    this.top = 0;
    this.vect = [];
    this.push = function (element) {
        this.vect.push(element);
        this.top += 1;
    }
    this.pop = function (element) {
        this.top -= 1;
        return this.vect.splice(this.top, 1)[0];
    }
}

function isDigit (char) {
    if (char >= "0" && char <= "9") {
        return true;
    }
    return false;
}

function isAlpha (char) {
    if ((char >= "a" && char <= "z") || (char >= "A" && char <= "Z")) {
        return true;
    }
    return false;
}

function isSpace (char) {
    if (char <= " ") {
        return 1;
    }
    return 0;
}

function swap (array, i, j) {
    var aux = array[i];
    array[i] = array[j];
    array[j] = aux;
}

function print (bob) {
    console.log(bob);
}

function log (bob) {
    var nestedDiv = document.getElementById("errorLog");
    nestedDiv.textContent = bob;
}

function isOperator (char) {
    if (char == "-" || char == "+" || char == "~" || char == "*" || char == "/") {
        return true;
    }
    return false;
}

function isFunc (string, beg) {
    if (string.substring(beg, beg+3) == "pow") {
        return new funcRes(true, "pow", 2);
    }
    else if (string.substring(beg, beg+4) == "sinh") {
        return new funcRes(true, "sinh", 1);
    }
    else if (string.substring(beg, beg+4) == "cosh") {
        return new funcRes(true, "cosh", 1);
    }
    else if (string.substring(beg, beg+4) == "tanh") {
        return new funcRes(true, "tanh", 1);
    }
    else if (string.substring(beg, beg+4) == "sech") {
        return new funcRes(true, "sech", 1);
    }
    else if (string.substring(beg, beg+4) == "csch") {
        return new funcRes(true, "csch", 1);
    }
    else if (string.substring(beg, beg+4) == "coth") {
        return new funcRes(true, "coth", 1);
    }
    else if (string.substring(beg, beg+3) == "sin") {
        return new funcRes(true, "sin", 1);
    }
    else if (string.substring(beg, beg+3) == "cos") {
        return new funcRes(true, "cos", 1);
    }
    else if (string.substring(beg, beg+3) == "tan") {
        return new funcRes(true, "tan", 1);
    }
    else if (string.substring(beg, beg+3) == "sec") {
        return new funcRes(true, "sec", 1);
    }
    else if (string.substring(beg, beg+3) == "csc") {
        return new funcRes(true, "csc", 1);
    }
    else if (string.substring(beg, beg+3) == "cot") {
        return new funcRes(true, "cot", 1);
    }
    else if (string.substring(beg, beg+6) == "arcsin") {
        return new funcRes(true, "arcsin", 1);
    }
    else if (string.substring(beg, beg+6) == "arccos") {
        return new funcRes(true, "arccos", 1);
    }
    else if (string.substring(beg, beg+6) == "arctan") {
        return new funcRes(true, "arctan", 1);
    }
    else if (string.substring(beg, beg+6) == "arcsec") {
        return new funcRes(true, "arcsec", 1);
    }
    else if (string.substring(beg, beg+6) == "arccsc") {
        return new funcRes(true, "arccsc", 1);
    }
    else if (string.substring(beg, beg+6) == "arccot") {
        return new funcRes(true, "arccot", 1);
    }
    else if (string.substring(beg, beg+3) == "log") {
        return new funcRes(true, "log", 2);
    }
    else if (string.substring(beg, beg+2) == "ln") {
        return new funcRes(true, "ln", 1);
    }
    else if (string.substring(beg, beg+4) == "fact") {
        return new funcRes(true, "fact", 1);
    }
    else if (string.substring(beg, beg+4) == "sqrt") {
        return new funcRes(true, "sqrt", 1);
    }
    else if (string.substring(beg, beg+3) == "sum") {
        return new funcRes(true, "sum", 3);
    }
    return new funcRes(false, "", 0);
}

function isConst (string, beg) {
    if (string[beg] == "e") {
        return new funcRes(true, "e", 0);
    }
    else if (string.substring(beg, beg+2) == "gr") {
        return new funcRes(true, "gr", 0);
    }
    else if (string.substring(beg, beg+2) == "pi") {
        return new funcRes(true, "pi", 0);
    }
    return new funcRes(false, "", 0);
}

function isVar (string, beg) {
    if (isAlpha(string[beg])) {
        if (string[beg+1] == "_" && isAlpha(string[beg+2])) {
            return new funcRes(true, string.substring(beg, beg+3), 0);
        }
        return new funcRes(true, string[beg], 0);
    }
    return new funcRes(false, "", 0);
}

function parse (string, den) {
    var i = 0;
    var total = 0;
    var array = [];
    while (i < string.length) {
        var results = [isDigit(string[i]), isOperator(string[i]), isAlpha(string[i])];
        //print(results[0]);
        //print(results[1]);
        //print(results[2]);
        //print(string[i] == "(" || string[i] == ")" || string[i] == ",");
        if (results[0]) {
            while (isDigit(string[i]) && i < string.length) {
               i += 1;
            }
            //print("number");
            array.push(new Token("Number", parseInt(string.substring(total, i)), 0));
        }
        else if (results[1]) {
            //print("operator");
            if (string[i] == "~") {
                array.push(new Token("Operator", string[i], 1));
            }
            else {
                array.push(new Token("Operator", string[i], 2));
            }
            i += 1;
        }
        else if (results[2]) {
            var local = [isFunc(string, i), isConst(string, i), isVar(string, i)];
            if (local[0].bool) {
                //print("function");
                array.push(new Token("Function", local[0].type, local[0].args));
                i += local[0].type.length;
            }
            else if (local[1].bool) {
                //print("constant");
                array.push(new Token("Constant", local[1].type, local[1].args));
                i += local[1].type.length;
            }
            else if (local[2].bool) {
                if (local[2].type == den) {
                    //print("variable");
                    array.push(new Token("Variable", local[2].type, local[2].args));
                    i += local[2].type.length;
                }
                else {
                    //print("constant");
                    array.push(new Token("Constant", local[2].type, local[1].args));
                    i += local[2].type.length;
                }
            }
        }
        else if (string[i] == "(" || string[i] == ")" || string[i] == ",") {
            //print("punctuation");
            array.push(new Token("Punctuation", string[i], 0));
            i += 1;
        }
        else if (isSpace(string[i])) {
            i += 1;
        }
        else {
            log("Some error ocurred on parsing");
            break;
        }
        //print(array[array.length-1].value);
        total = i;
    }
    return array;
}

function verifySintax (array) {
    var par = 0;
    var i = 0;
    while (i < array.length && par >= 0) {
        if (array[i].value == "(") {
            par += 1;
        }
        if (array[i].value == ")") {
            par -= 1;
        }
        i += 1;
    }
    if (par != 0) {
        log("Invalid parenthesis configuration");
        return 0;
    }
    i = 0;
    while (i < array.length) {
        par = 0;
        var commas = 0;
        if (array[i].type == "Function") {
            commas += array[i].args - 1;
            var j = i;
            if (i + 1 >= array.length || array[i+1].value != "(") {
                log("Expected parenthesis");
                return 0;
            }
            par = 1;
            while (j < array.length && par != 0) {
                if (array[j].value == "(") {
                    par += 1;
                }
                if (array[j].value == ")") {
                    par -= 1;
                }
                if (array[j].value == ",") {
                    array[j].value = ".";
                    commas -= 1;
                }
                j += 1;
            }
            i += 1;
        }
        else {
            i += 1;
        }
    }
    //print(commas);
    //print(ArraytoString(array));
    i = 0;
    if (commas != 0) {
        log("too many/few commas");
        return 0;
    }
    while (i < array.length) {
        if (array[i].value == ",") {
            log("Comma out of function");
            return 0;
        }
        else if (array[i].value == ".") {
            array[i].value = ",";
        }
        i += 1;
    }
    i = 0;
    while (i < array.length) {
        //console.log(array[i].value);
        if (i < array.length - 1  && i > 0 && array[i].type == "Operator" && array[i].value != "~") {
            if (array[i+1].value == "Operator" || array[i+1].value == ")" || array[i+1].value == "," || array[i-1].type == "Operator" || array[i-1].value == "(" || array[i-1].value == ",") {
                log("Operator without operands");
                return 0;
            }
        }
        if (i < array.length - 1  && i > 0 && array[i].value == "~") {
            if (array[i+1].value == "Operator" || array[i+1].value == ")" || array[i+1].value == ",") {
                log("Operator without operands");
                return 0;
            }
        }
        if ((i == array.length - 1 || i == 0) && array[i].type == "Operator" && array[i].value != "~") {
            log("Operator without operands");
            return 0;
        }
        if (i == array.length - 1 && array[i].value == "~") {
            log("Operator without operands");
            return 0;
        }
        if (i < array.length - 1 && i > 0 && (array[i].type == "Variable" || array[i].type == "Constant" || array[i].type == "Number")) {
            if (array[i+1].type == "Constant" || array[i+1].type == "Number" || array[i+1].type == "Number" || array[i-1].type == "Constant" || array[i-1].type == "Variable" || array[i-1].type == "Number") {
                log("Numbers without operator");
                return 0;
            }
        }
        if (i == 0 && (array[i].type == "Variable" || array[i].type == "Constant" || array[i].type == "Number")) {
            if (i + 1 < array.length && (array[i+1].type == "Variable" || array[i+1].type == "Constant" || array[i+1].type == "Number" || array[i+1].type == "Function")) {
                log("Numbers without operator");
                return 0;
            }
        }
        if (i == array.length - 1 && (array[i].type == "Variable" || array[i].type == "Constant" || array[i].type == "Number")) {
            if (i - 1 > 0 && (array[i-1].type == "Variable" || array[i-1].type == "Constant" || array[i-1].type == "Number")) {
                log("Numbers without operator");
                return 0;
            }
        }
        i += 1;
    }
    return 1;
}

function toPrefix (array) {
    var i = array.length - 1;
    var par = 0;
    while (i >= 0) {
        while (i >= 0 && array[i].value != "*" && array[i].value != "/") {
            i -= 1;
        }
        while (i > 0 && array[i-1].type != "Operator" && array[i-1].value != "(" && array[i-1].value != ",") {
            if (array[i-1].value == ")") {
                par = -1;
                swap(array, i, i-1);
                i -= 1;
                while (par != 0 && i > 0) {
                    if (array[i-1].value == ")") {
                        par -= 1;
                    }
                    else if (array[i-1].value == "(") {
                        par += 1;
                    }
                    swap(array, i, i-1);
                    i -= 1;
                }
            }
            else {
              swap(array, i, i-1);
              i -= 1;
            }
        }
        i -= 1;
    }
    i = array.length - 1;
    while (i >= 0) {
        while (i >= 0 && array[i].value != "+" && array[i].value != "-") {
            i -= 1;
        }
        while (i > 0 && array[i-1].value != "+" && array[i-1].value != "-" && array[i-1].value != "(" && array[i-1].value != ",") {
            if (array[i-1].value == ")") {
                par = -1;
                swap(array, i, i-1);
                i -= 1;
                while (par != 0 && i > 0) {
                    if (array[i-1].value == ")") {
                        par -= 1;
                    }
                    else if (array[i-1].value == "(") {
                        par += 1;
                    }
                    swap(array, i, i-1);
                    i -= 1;
                }
            }
            else {
                swap(array, i, i-1);
                i -= 1;
            }
        }
        i -= 1;
    }
    //print(ArraytoString(array));
    array = takeOffPar(array);
}

function takeOffPar (array) {
    var i = 0;
    var j = 0;
    var par = 0;
    while (i < array.length) {
        if (array[i].type == "Function") {
            i += 1;
            array[i].value = "[";
            j = i + 1;
            par = 1;
            while (par != 0 && i > 0) {
                if (array[j].value == ")") {
                    par -= 1;
                }
                else if (array[j].value == "(") {
                    par += 1;
                }
                j += 1;
            }
            array[j-1].value = "]";
        }
        i += 1;
    }
    i = 0;
    //print(ArraytoString(array));
    while (i < array.length) {
        if (array[i].value == "[") {
            array[i].value = "(";
            i += 1;
        }
        else if (array[i].value == "]") {
            array[i].value = ")";
            i += 1;
        }
        else if (array[i].value == "(" || array[i].value == ")") {
            array.splice(i, 1);
        }
        else {
            i += 1;
        }
    }
    //print(ArraytoString(array));
}

function ArraytoString (array) {
    var i = 0;
    var string = "";
    while (i < array.length) {
        if (array[i].type == "Number") {
            string = string + array[i].value.toString();
        }
        else {
            string = string + array[i].value;
        }
        i += 1;
    }
    return string;
}

function derivate (array) {
    //print(ArraytoString(array));
    //print(array);
    if (array[0].value == "*") {
        return derivateProduct(array);
    }
    if (array[0].value == "/") {
        return derivateQuocient(array);
    }
    if (array[0].value == "+" || array[0].value == "-") {
        return derivateSum(array);
    }
    if (array[0].value == "~") {
        var ret = [array[0]];
        ret.push.apply(ret, derivate(array.splice(1, array.length - 1)));
        return ret;
    }
    if (array[0].type == "Function") {
        return derivateFunct(array);
    }
    if (array[0].type == "Punctuation") {
        return derivate(array.splice(1, array.length - 2));
    }
    if (array[0].type == "Number" || array[0].type == "Constant") {
        //print("Derivated " + array[0].value + " to zero");
        return [new Token("Number", 0, 0)];
    }
    if (array[0].type == "Variable") {
      //print("Derivated " + array[0].value + " to one");
        return [new Token("Number", 1, 0)];
    }
    return array;
}

function getFactor (array, i) {
    //print(ArraytoString(array) + "   " + i);
    if (array[i].type == "Number" || array[i].type == "Constant" || array[i].type == "Variable") {
        //print("Factor is a number, cons or var");
        return 1;
    }
    else if (array[i].type == "Operator") {
        //print("Factor is operator");
        var j = getFactor(array, i + 1);
        //print("Successfuly got an " + j.toString() + " length string");
        if (array[i].value == "~") {
            //print("Negative return");
            return j + 1;
        }
        else {
            //print("Other operator");
            return getFactor(array, i + j + 1) + j + 1;
        }
    }
    else if (array[i].type == "Function" || array[i].type == "Punctuation") {
        //print("Factor is a function or a punct");
        var res = 0;
        var par = 1;
        if (array[i].type == "Function") {
            //print("Added one more for a function");
            i += 1;
            res += 1;
        }
        i += 1;
        res += 1;
        //print("Jumping parenthesis");
        while (par != 0) {
            //print("Jumped " + array[i].value);
            if (array[i].value == ")") {
                par -= 1;
            }
            else if (array[i].value == "(") {
                par += 1;
            }
            res += 1;
            i += 1;
        }
        //print("Returning " + res.toString() + " characters")
        return res;
    }
}

function derivateProduct (array) {
    var i = 1;
    var factors = [[], []];
    var par;
    var num = 0;
    var ret = [];
    //print("Entering at a derivateProduct");
    //print("Divided " + ArraytoString(array) + " into");
    while (num < 2) {
        if (array[i].type == "Function") {
            //print("1");
            //print(array[i]);
            factors[num].push(array[i]);
            i += 1
            par = 1;
            //print(array[i]);
            factors[num].push(array[i]);
            i += 1;
            while (par != 0) {
                if (array[i+1].value == ")") {
                    par -= 1;
                }
                else if (array[i+1].value == "(") {
                    par += 1;
                }
                //print(array[i]);
                factors[num].push(array[i]);
                i += 1;
            }
            //print(array[i]);
            factors[num].push(array[i]);
            i += 1;
        }
        else if (array[i].type == "Number" || array[i].type == "Variable" || array[i].type == "Constant") {
            //print("2");
            factors[num].push(array[i]);
            i += 1;
        }
        else {
            //print("3");
            var fact = getFactor(array, i) + i;
            while (i < fact) {
                factors[num].push(array[i]);
                i += 1;
            }
        }
        num += 1;
    }
    //print(ArraytoString(factors[0]) + " and");
    //print(ArraytoString(factors[1]));
    var aux = factors[0].slice();
    ret.push(new Token("Punctuation", "(", 0));
    ret.push(new Token("Operator", "+", 2));
    ret.push(new Token("Operator", "*", 2));
    ret.push.apply(ret, derivate(factors[0]));
    ret.push.apply(ret, factors[1]);
    ret.push(new Token("Operator", "*", 2));
    ret.push.apply(ret, aux);
    ret.push.apply(ret, derivate(factors[1]));
    ret.push(new Token("Punctuation", ")", 0));
    //print(ArraytoString(ret));
    return ret;
}

function derivateQuocient (array) {
    var i = 1;
    var factors = [[], []];
    var par;
    var num = 0;
    var ret = [];
    //print("Entering at a derivateQuocient");
    //print("Divided " + ArraytoString(array) + " into");
    while (num < 2) {
        if (array[i].value == "(" || array[i].type == "Function") {
            //print("1");
            if (array[i].type == "Function") {
                //print(array[i]);
                factors[num].push(array[i]);
                i += 1
            }
            par = 1;
            //print(array[i]);
            factors[num].push(array[i]);
            i += 1;
            while (par != 0) {
                if (array[i].value == ")") {
                    par -= 1;
                }
                else if (array[i].value == "(") {
                    par += 1;
                }
                //print(array[i]);
                factors[num].push(array[i]);
                i += 1;
            }
            //print(array[i]);
        }
        else if (array[i].type == "Number" || array[i].type == "Variable" || array[i].type == "Constant") {
            //print("2");
            factors[num].push(array[i]);
            i += 1;
        }
        else {
            //print("3");
            var fact = getFactor(array, i + 1);
            while (i < fact) {
                factors[num].push(array[i]);
                i += 1;
            }
        }
        num += 1;
    }
    //print(ArraytoString(factors[0]) + " and");
    //print(ArraytoString(factors[1]));
    var aux = factors[0].slice();
    var aux2 = factors[1].slice();
    ret.push(new Token("Operator", "/", 2))
    ret.push(new Token("Operator", "-", 2));
    ret.push(new Token("Operator", "*", 2));
    ret.push.apply(ret, derivate(factors[0]));
    ret.push.apply(ret, factors[1]);
    ret.push(new Token("Operator", "*", 2));
    ret.push.apply(ret, aux);
    ret.push.apply(ret, derivate(factors[1]));
    ret.push(new Token("Function", "pow", 2), new Token("Punctuation", "(", 0));
    ret.push.apply(ret, aux2);
    ret.push(new Token("Punctuation", ",", 0), new Token("Number", "2", 0), new Token("Punctuation", ")", 0));
    //print(ArraytoString(ret));
    return ret;
}

function derivateSum (array) {
    var factors = [[], []];
    var i = 1;
    var num = 0;
    var ret = [];
    //print("Entering at a derivateSum");
    //print("Divided " + ArraytoString(array) + " into");
    while (num < 2) {
        var fact = getFactor(array, i) + i;
        while (i < fact) {
            factors[num].push(array[i]);
            i += 1;
        }
        num += 1;
    }
    //print(ArraytoString(factors[0]) + " and");
    //print(ArraytoString(factors[1]));
    ret.push(array[0]);
    ret.push.apply(ret, derivate(factors[0]));
    ret.push.apply(ret, derivate(factors[1]));
    return ret;
}

function derivateFunct (array) {
    var i = 2;
    var factors = [[], [], []];
    var par = 0;
    var num = 0;
    var args = array[0].args;
    var ret = [];
    //print("Entering at a derivateFunct");
    //print("Divided " + ArraytoString(array) + " into");
    //Não da certo em função dentro de função (vírgula)
    while (num < args) {
        while (array[i].value != "," && array[i].value != ")") {
            if (array[i].value == "(") {
                par = 1;
                factors[num].push(array[i]);
                i += 1;
                while (par != 0) {
                    if (array[i+1].value == ")") {
                        par -= 1;
                    }
                    else if (array[i+1].value == "(") {
                        par += 1;
                    }
                    factors[num].push(array[i]);
                    i += 1;
                }
            }
            factors[num].push(array[i]);
            i += 1;
        }
        i += 1;
        num += 1;
    }
    if (array[0].value == "pow") {
        //print(ArraytoString(factors[0]) + " and");
        //print(ArraytoString(factors[1]));
        ret.push(new Token("Operator", "*", 2));
        ret.push.apply(ret, array);
        var aux = [new Token("Operator", "*", 2)];
        aux.push.apply(aux, factors[1]);
        aux.push(new Token("Function", "ln", 1), new Token("Punctuation", "(", 0));
        aux.push.apply(aux, factors[0]);
        aux.push(new Token("Punctuation", ")", 0));
        ret.push.apply(ret, derivate(aux));
    }
    else if (array[0].value == "sin") {
        //print(ArraytoString(factors[0]));
        ret.push(new Token("Operator", "*", 2), new Token("Function", "cos", 1), new Token("Punctuation", "(", 0));
        ret.push.apply(ret, factors[0]);
        ret.push(new Token("Punctuation", ")", 0));
        ret.push.apply(ret, derivate(factors[0]));
    }
    else if (array[0].value == "cos") {
        //print(ArraytoString(factors[0]));
        ret.push(new Token("Operator", "*", 2), new Token("Operator", "~", 1), new Token("Function", "sen", 1), new Token("Punctuation", "(", 0));
        ret.push.apply(ret, factors[0]);
        ret.push(new Token("Punctuation", ")", 0));
        ret.push.apply(ret, derivate(factors[0]));
    }
    else if (array[0].value == "tan") {
        //print(ArraytoString(factors[0]));
        ret.push(new Token("Operator", "*", 2), new Token("Function", "pow", 2), new Token("Punctuation", "(", 0), new Token("Function", "sec", 1), new Token("Punctuation", "(", 0));
        ret.push.apply(ret, factors[0]);
        ret.push(new Token("Punctuation", ")", 0), new Token("Punctuation", ",", 0), new Token("Number", 2, 0), new Token("Punctuation", ")", 0));
        ret.push.apply(ret, derivate(factors[0]));
    }
    else if (array[0].value == "sec") {
        //print(ArraytoString(factors[0]));
        ret.push(new Token("Operator", "*", 2), new Token("Function", "sec", 1), new Token("Punctuation", "(", 0));
        ret.push.apply(ret, factors[0]);
        ret.push(new Token("Punctuation", ")", 0), new Token("Operator", "*", 2), new Token("Function", "tan", 1), new Token("Punctuation", "(", 0));
        ret.push.apply(ret, factors[0]);
        ret.push(new Token("Punctuation", ")", 0));
        ret.push.apply(ret, derivate(factors[0]));
    }
    else if (array[0].value == "csc") {
        //print(ArraytoString(factors[0]));
        ret.push(new Token("Operator", "*", 2), new Token("Operator", "~", 1), new Token("Function", "csc", 1), new Token("Punctuation", "(", 0));
        ret.push.apply(ret, factors[0]);
        ret.push(new Token("Punctuation", ")", 0), new Token("Operator", "*", 2), new Token("Function", "cot", 1), new Token("Punctuation", "(", 0));
        ret.push.apply(ret, factors[0]);
        ret.push(new Token("Punctuation", ")", 0));
        ret.push.apply(ret, derivate(factors[0]));
    }
    else if (array[0].value == "cot") {
        //print(ArraytoString(factors[0]));
        ret.push(new Token("Operator", "*", 2), new Token("Operator", "~", 1), new Token("Function", "pow", 2), new Token("Punctuation", "(", 0), new Token("Function", "csc", 2), new Token("Punctuation", "(", 0));
        ret.push.apply(ret, factors[0]);
        ret.push(new Token("Punctuation", ")", 0), new Token("Punctuation", ",", 0), new Token("Number", 2, 0), new Token("Punctuation", ")", 0));
        ret.push.apply(ret, derivate(factors[0]));
    }
    else if (array[0].value == "arcsin") {
        //print(ArraytoString(factors[0]));
        ret.push(new Token("Operator", "*", 2))
        ret.push(new Token("Operator", "/", 2), new Token("Number", 1, 0), new Token("Function", "pow", 2), new Token("Punctuation", "(", 0));
        ret.push(new Token("Operator", "-", 2), new Token("Number", 1, 0), new Token("Function", "pow", 2), new Token("Punctuation", "(", 0));
        ret.push.apply(ret, factors[0]);
        ret.push(new Token("Punctuation", ",", 0), new Token("Number", 2, 0), new Token("Punctuation", ")", 0), new Token("Punctuation", ",", 0));
        ret.push(new Token("Operator", "/", 2), new Token("Number", 1, 0), new Token("Number", 2, 0), new Token("Punctuation", ")", 0));
        ret.push.apply(ret, derivate(factors[0]));
    }
    else if (array[0].value == "arccos") {
        //print(ArraytoString(factors[0]));
        ret.push(new Token("Operator", "*", 2))
        ret.push(new Token("Operator", "/", 2), new Token("Operator", "~", 1), new Token("Number", 1, 0), new Token("Function", "pow", 2), new Token("Punctuation", "(", 0));
        ret.push(new Token("Operator", "-", 2), new Token("Number", 1, 0), new Token("Function", "pow", 2), new Token("Punctuation", "(", 0));
        ret.push.apply(ret, factors[0]);
        ret.push(new Token("Punctuation", ",", 0), new Token("Number", 2, 0), new Token("Punctuation", ")", 0), new Token("Punctuation", ",", 0));
        ret.push(new Token("Operator", "/", 2), new Token("Number", 1, 0), new Token("Number", 2, 0), new Token("Punctuation", ")", 0));
        ret.push.apply(ret, derivate(factors[0]));
    }
    else if (array[0].value == "arctan") {
        //print(ArraytoString(factors[0]));
        ret.push(new Token("Operator", "*", 2))
        ret.push(new Token("Operator", "/", 2), new Token("Number", 1, 0));
        ret.push(new Token("Operator", "+", 2), new Token("Number", 1, 0), new Token("Function", "pow", 2), new Token("Punctuation", "(", 0));
        ret.push.apply(ret, factors[0]);
        ret.push(new Token("Punctuation", ",", 0), new Token("Number", 2, 0), new Token("Punctuation", ")", 0));
        ret.push.apply(ret, derivate(factors[0]));
    }
    else if (array[0].value == "arcsec") {
        //print(ArraytoString(factors[0]));
        ret.push(new Token("Operator", "*", 2))
        ret.push(new Token("Operator", "/", 2), new Token("Number", 1, 0), new Token("Function", "pow", 2), new Token("Punctuation", "(", 0));
        ret.push(new Token("Operator", "-", 2), new Token("Function", "pow", 2), new Token("Punctuation", "(", 0));
        ret.push.apply(ret, factors[0]);
        ret.push(new Token("Punctuation", ",", 0), new Token("Number", 4, 0), new Token("Punctuation", ")", 0), new Token("Function", "pow", 2), new Token("Punctuation", "(", 0));
        ret.push.apply(ret, factors[0]);
        ret.push(new Token("Punctuation", ",", 0), new Token("Number", 2, 0), new Token("Punctuation", ")", 0), new Token("Punctuation", ",", 0));
        ret.push(new Token("Operator", "/", 2), new Token("Number", 1, 0), new Token("Number", 2, 0), new Token("Punctuation", ")", 0));
        ret.push.apply(ret, derivate(factors[0]));
    }
    else if (array[0].value == "arccsc") {
        //print(ArraytoString(factors[0]));
        ret.push(new Token("Operator", "*", 2))
        ret.push(new Token("Operator", "/", 2), new Token("Operator", "~", 1), new Token("Number", 1, 0), new Token("Function", "pow", 2), new Token("Punctuation", "(", 0));
        ret.push(new Token("Operator", "-", 2), new Token("Function", "pow", 2), new Token("Punctuation", "(", 0));
        ret.push.apply(ret, factors[0]);
        ret.push(new Token("Punctuation", ",", 0), new Token("Number", 4, 0), new Token("Punctuation", ")", 0), new Token("Function", "pow", 2), new Token("Punctuation", "(", 0));
        ret.push.apply(ret, factors[0]);
        ret.push(new Token("Punctuation", ",", 0), new Token("Number", 2, 0), new Token("Punctuation", ")", 0), new Token("Punctuation", ",", 0));
        ret.push(new Token("Operator", "/", 2), new Token("Number", 1, 0), new Token("Number", 2, 0), new Token("Punctuation", ")", 0));
        ret.push.apply(ret, derivate(factors[0]));
    }
    else if (array[0].value == "arccot") {
        //print(ArraytoString(factors[0]));
        ret.push(new Token("Operator", "*", 2))
        ret.push(new Token("Operator", "/", 2), new Token("Operator", "~", 1), new Token("Number", 1, 0));
        ret.push(new Token("Operator", "+", 2), new Token("Number", 1, 0), new Token("Function", "pow", 2), new Token("Punctuation", "(", 0));
        ret.push.apply(ret, factors[0]);
        ret.push(new Token("Punctuation", ",", 0), new Token("Number", 2, 0), new Token("Punctuation", ")", 0));
        ret.push.apply(ret, derivate(factors[0]));
    }
    else if (array[0].value == "sinh") {
        //print(ArraytoString(factors[0]));
        ret.push(new Token("Operator", "*", 2), new Token("Function", "cosh", 1), new Token("Punctuation", "(", 0));
        ret.push.apply(ret, factors[0]);
        ret.push(new Token("Punctuation", ")", 0));
        ret.push.apply(ret, derivate(factors[0]));
    }
    else if (array[0].value == "cosh") {
        //print(ArraytoString(factors[0]));
        ret.push(new Token("Operator", "*", 2), new Token("Function", "sinh", 1), new Token("Punctuation", "(", 0));
        ret.push.apply(ret, factors[0]);
        ret.push(new Token("Punctuation", ")", 0));
        ret.push.apply(ret, derivate(factors[0]));
    }
    else if (array[0].value == "tanh") {
        //print(ArraytoString(factors[0]));
        ret.push(new Token("Operator", "*", 2), new Token("Operator", "-", 2), new Token("Number", 1, 0), new Token("Function", "pow", 2), new Token("Punctuation", "(", 0));
        ret.push(new Token("Function", "tanh", 1), new Token("Punctuation", "(", 0));
        ret.push.apply(ret, factors[0]);
        ret.push(new Token("Punctuation", ")", 0), new Token("Punctuation", ",", 0), new Token("Number", 2, 0), new Token("Punctuation", ")", 0));
        ret.push.apply(ret, derivate(factors[0]));
    }
    else if (array[0].value == "sech") {
        //print(ArraytoString(factors[0]));
        ret.push(new Token("Operator", "*", 2), new Token("Function", "sech", 1), new Token("Punctuation", "(", 0));
        ret.push.apply(ret, factors[0]);
        ret.push(new Token("Punctuation", ")", 0), new Token("Operator", "*", 2), new Token("Function", "tanh", 1), new Token("Punctuation", "(", 0));
        ret.push.apply(ret, factors[0]);
        ret.push(new Token("Punctuation", ")", 0));
        ret.push.apply(ret, derivate(factors[0]));
    }
    else if (array[0].value == "csch") {
        //print(ArraytoString(factors[0]));
        ret.push(new Token("Operator", "*", 2), new Token("Operator", "~", 1), new Token("Function", "csch", 1), new Token("Punctuation", "(", 0));
        ret.push.apply(ret, factors[0]);
        ret.push(new Token("Punctuation", ")", 0), new Token("Operator", "*", 2), new Token("Function", "coth", 1), new Token("Punctuation", "(", 0));
        ret.push.apply(ret, factors[0]);
        ret.push(new Token("Punctuation", ")", 0));
        ret.push.apply(ret, derivate(factors[0]));
    }
    else if (array[0].value == "coth") {
        //print(ArraytoString(factors[0]));
        ret.push(new Token("Operator", "*", 2), new Token("Operator", "-", 2), new Token("Number", 1, 0), new Token("Function", "pow", 2), new Token("Punctuation", "(", 0));
        ret.push(new Token("Function", "tanh", 1), new Token("Punctuation", "(", 0));
        ret.push.apply(ret, factors[0]);
        ret.push(new Token("Punctuation", ")", 0), new Token("Punctuation", ",", 0), new Token("Number", 2, 0), new Token("Punctuation", ")", 0));
        ret.push.apply(ret, derivate(factors[0]));
    }
    else if (array[0].value == "log") {
        //print(ArraytoString(factors[0]) + " and");
        //print(ArraytoString(factors[1]));
        ret.push(new Token("Operator", "/", 2), new Token("Function", "ln", 1), new Token("Punctuation", "(", 0));
        ret.push.apply(ret, factors[0]);
        ret.push(new Token("Punctuation", ")", 0), new Token("Function", "ln", 1), new Token("Punctuation", "(", 0));
        ret.push.apply(ret, factors[1]);
        ret.push(new Token("Punctuation", ")", 0));
        ret = derivate(ret);
    }
    else if (array[0].value == "ln") {
        //print(ArraytoString(factors[0]));
        ret.push(new Token("Operator", "*", 2), new Token("Operator", "/", 2), new Token("Number", 1, 0))
        ret.push.apply(ret, factors[0]);
        ret.push.apply(ret, derivate(factors[0]));
    }
    else if (array[0].value == "fact") {
        log("Program does not support fact yet");
    }
    else if (array[0].value == "sqrt") {
        log("Program does not support sqrt yet");
    }
    else if (array[0].value == "sum") {
        //print(ArraytoString(factors[0]) + ",");
        //print(ArraytoString(factors[1]) + " and");
        //print(ArraytoString(factors[2]));
        ret.push(new Token("Function", "sum", 3), new Token("Punctuation", "(", 0))
        ret.push.apply(ret, factors[0]);
        ret.push(new Token("Punctuation", ",", 0));
        ret.push.apply(ret, factors[1]);
        ret.push(new Token("Punctuation", ",", 0));
        ret.push.apply(ret, derivate(factors[2]));
        ret.push(new Token("Punctuation", ")", 0));
    }
    return ret;
}

function decode (operator) {
    if (operator == -1) {
        return -1;
    }
    if (operator == "-" || operator == "+") {
        return 0;
    }
    if (operator == "*" || operator == "/") {
        return 2;
    }
    return 1;
}

function takeOffZeroes (array) {
    var i = 0;
    var ret = [];
    //print(ArraytoString(array));
    if (array[0].type == "Number" || array[0].type == "Variable" || array[0].type == "Constant") {
        //print(array[0].value);
        return [array[0]];
    }
    else if (array[0].type == "Operator") {
        if (array[0].value == "~") {
            var factor = [];
            var j = getFactor(array, 1) + 1;
            i += 1;
            while (i < j) {
                factor.push(array[i]);
                i += 1;
            }
            factor = takeOffZeroes(factor);
            if (factor == 0) {
                return 0;
            }
            if (factor.length == 1 && factor[0].value == 0) {
                //print("0");
                ret = [new Token("Number", 0, 0)];
            }
            else {
                ret.push(array[0]);
                ret.push.apply(ret, factor);
                //print(ArraytoString(ret));
            }
        }
        else {
            i += 1;
            var j = getFactor(array, i) + i;
            var factors = [[], []];
            var ret2 = []
            while (i < j) {
                factors[0].push(array[i]);
                i += 1;
            }
            j = getFactor(array, i) + i;
            while (i < j) {
                factors[1].push(array[i]);
                i += 1;
            }
            factors[0] = takeOffZeroes(factors[0]);
            factors[1] = takeOffZeroes(factors[1]);
            if (factors[0] == 0 || factors[1] == 0) {
                return 0;
            }
            else if (((factors[0].length == 1 && factors[0][0].value == 0) || (factors[1].length == 1 && factors[1][0].value == 0)) && array[0].value == "*") {
                //print(0);
                ret = [new Token("Number", 0, 0)];
            }
            else if (((factors[0].length == 1 && factors[0][0].value == 1) || (factors[1].length == 1 && factors[1][0].value == 1)) && array[0].value == "*") {
                if (factors[0].length == 1 && factors[0][0].value == 1) {
                    ret = factors[1];
                    //print(ArraytoString(factors[1]));
                }
                else {
                    //print(ArraytoString(factors[0]));
                    ret = factors[0];
                }
            }
            else if (((factors[0].length == 1 && factors[0][0].value == 0) || (factors[1].length == 1 && factors[1][0].value == 0)) && array[0].value == "+") {
                if (factors[0].length == 1 && factors[0][0].value == 0) {
                    ret = factors[1];
                    //print(ArraytoString(factors[1]));
                }
                else {
                    //print(ArraytoString(factors[0]));
                    ret = factors[0];
                }
            }
            else if (factors[1].length == 1 && factors[1][0].value == 0 && array[0].value == "/") {
                ret = 0;
                log("Division by zero");
            }
            else if (factors[0].length == 1 && factors[0][0].value == 0 && array[0].value == "/") {
                //print(0);
                ret = [new Token("Number", 0, 0)];
            }
            else if (factors[1].length == 1 && factors[1][0].value == 1 && array[0].value == "*") {
                //print(ArraytoString(factors[0]));
                ret = factors[0];
            }
            else if (((factors[0].length == 1 && factors[0][0].type == "Number") || (factors[0].length == 2 && factors[0][1].type == "Number" && factors[0][0].value == "~")) && ((factors[1].length == 1 && factors[1][0].type == "Number") || (factors[1].length == 2 && factors[1][1].type == "Number" && factors[1][0].value == "~")) && (array[0].value == "+" || array[0].value == "-")) {
                var aux1;
                var aux2;
                if (factors[0].length == 2 && factors[0][1].type == "Number" && factors[0][0].value == "~") {
                    aux1 = -factors[0][1].value;
                }
                else if (factors[0].length == 1 && factors[0][0].type == "Number"){
                    aux1 = factors[0][0].value;
                }
                if (factors[1].length == 2 && factors[1][1].type == "Number" && factors[1][0].value == "~") {
                    aux2 = -factors[1][1].value;
                }
                else if (factors[1].length == 1 && factors[1][0].type == "Number"){
                    aux2 = factors[1][0].value;
                }
                if (array[0].value == "+") {
                  if (aux1 + aux2 < 0) {
                      ret = [new Token("Operator", "~", 1), new Token("Number", Math.abs(aux1 + aux2), 0)];
                      //print(ArraytoString(ret));
                  }
                  else {
                      ret = [new Token("Number", aux1 + aux2, 0)];
                      //print(ArraytoString(ret));
                  }
                }
                else {
                    if (aux1 - aux2 < 0) {
                        ret = [new Token("Operator", "~", 1), new Token("Number", Math.abs(aux1 - aux2), 0)];
                        //print(ArraytoString(ret));
                    }
                    else {
                        ret = [new Token("Number", aux1 - aux2, 0)];
                        //print(ArraytoString(ret));
                    }
                }
            }
            else {
                ret.push(array[0]);
                ret.push.apply(ret, factors[0]);
                ret.push.apply(ret, factors[1]);
                //print(ArraytoString(ret));
            }
        }
        //print(i);
        return ret;
    }
    else if (array[0].type == "Function") {
        var args = array[0].args;
        //print(array[0].args);
        var count = 0;
        i = 2;
        ret.push(array[0], array[1]);
        while (count < args) {
            var factor = [];
            var j = getFactor(array, i) + i;
            while (i < j) {
                factor.push(array[i]);
                i += 1;
            }
            factor = takeOffZeroes(factor);
            if (array[0].value == "ln" && factor.length == 1 && factor[0].value == "e") {
                ret = [new Token("Number", 1, 0)];
            }
            else if (array[0].value == "pow" && factor.length == 1 && factor[0].value == 0 && count == 0) {
                ret = [new Token("Number", 0, 0)];
                break;
            }
            else if (array[0].value == "pow" && factor.length == 1 && factor[0].value == 1 && count == 0) {
                ret = [new Token("Number", 1, 0)];
                break;
            }
            else {
                ret.push.apply(ret, factor);
                ret.push(array[i]);
            }
            i += 1;
            count += 1;
        }
        //print(i);
        //print(ArraytoString(ret));
        return ret;
    }
    else if (array[0].type == "Punctuation") {
        //print("(Something)");
        return takeOffZeroes(array.splice(1, array.length - 2));
    }
}

function toInfix (array, code) {
    var i = 0;
    var ret = [];
    //print("Changing " + ArraytoString(array) + " to Infix");
    if (array[0].type == "Number" || array[0].type == "Variable" || array[0].type == "Constant") {
        //print(i);
        return [array[0]];
    }
    else if (array[0].type == "Operator") {
        if (array[0].value == "~") {
            var factor = [];
            var j = getFactor(array, 1) + 1;
            var ret2 = [];
            i += 1;
            while (i < j) {
                factor.push(array[i]);
                i += 1;
            }
            ret2.push(new Token("Operator", "-", 1));
            ret2.push.apply(ret2, toInfix(factor, array[0].value));
            if (decode(code) > decode("~")) {
                ret.push(new Token("Punctuation", "(", 0));
                ret.push.apply(ret, ret2);
                ret.push(new Token("Punctuation", ")", 0));
            }
            else {
                ret = ret2;
            }
        }
        else {
            i += 1;
            var j = getFactor(array, i) + i;
            var factors = [[], []];
            var ret2 = []
            while (i < j) {
                factors[0].push(array[i]);
                i += 1;
            }
            j = getFactor(array, i) + i;
            while (i < j) {
                factors[1].push(array[i]);
                i += 1;
            }
            //print("Got " + ArraytoString(factors[0]) + " " + array[0].value + " " + ArraytoString(factors[1]))
            ret2.push.apply(ret2, toInfix(factors[0], array[0].value));
            ret2.push(array[0]);
            //if (array[0].value == "-" || array[0].value == "/") {
            //    ret2.push(new Token("Punctuation", "(", 0));
            //    ret2.push.apply(ret2, toInfix(factors[1], decode(array[0].value)));
            //    ret2.push(new Token("Punctuation", ")", 0));
            //}
            //else {
            ret2.push.apply(ret2, toInfix(factors[1], array[0].value));
            //}
            if (decode(code) > decode(array[0].value) || (code == "*" && array[0].value == "/")) {
                ret.push(new Token("Punctuation", "(", 0));
                ret.push.apply(ret, ret2);
                ret.push(new Token("Punctuation", ")", 0));
            }
            else {
                ret = ret2;
            }
        }
        //print(i);
        return ret;
    }
    else if (array[0].type == "Function") {
        var args = array[0].args;
        //print(array[0].args);
        var count = 0;
        i = 2;
        ret.push(array[0], array[1]);
        while (count < args) {
            var factor = [];
            var j = getFactor(array, i) + i;
            while (i < j) {
                factor.push(array[i]);
                i += 1;
            }
            ret.push.apply(ret, toInfix(factor, -1));
            ret.push(array[i]);
            i += 1;
            count += 1;
        }
        //print(i);
        return ret;
    }
    else if (array[0].type == "Punctuation") {
        return toInfix(array.splice(1, array.length - 2));
    }
}

function main () {
    var formInput = document.getElementById("formInput");
    var varInput = document.getElementById("varInput");
    var nestedDiv = document.getElementById("result");
    nestedDiv.textContent = ".";
    var formula = formInput.value;
    var den = varInput.value;
    var res = isVar(den, 0);
    if (res.bool) {
        var array = parse(formula, den);
        if (!verifySintax(array)) {
            log("Invalid sintax");
        }
        else {
            toPrefix(array);
            //print(ArraytoString(array));
            array = derivate(array);
            //print(ArraytoString(array));
            array = takeOffZeroes(array);
            array = toInfix(array);
            //print(ArraytoString(array));
            var string = ArraytoString(array);
            nestedDiv.textContent = string;
            log(" ");
        }
    }
    else {
        log("Invalid variable");
    }
}
