function Token (type, value, args) {
    this.type = type;
    this.value = value;
    this.args = args;
}

function Node (type, value, args) {
    this.type = type;
    this.value = value;
    this.args = [];
    for (var i = 0; i < args; i++)
        this.args.push(null);
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
    this.isEmpty = function () {
        return this.top == 0;
    }
    this.getTop = function () {
        return this.vect[this.top-1];
    }
    this.toString = function () {
        return ArraytoString(this.vect);
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
    if (char == "-" || char == "+" || char == "~" || char == "*" || char == "/" || char == "^")
        return true;
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
        if (string[beg+1] == "_" && isAlpha(string[beg+2]))
            return new funcRes(true, string.substring(beg, beg+3), 0);
        return new funcRes(true, string[beg], 0);
    }
    return new funcRes(false, "", 0);
}

function isTerminal (root) {
    return root.type == "Number" || root.type == "Variable" || root.type == "Constant";
}

function isConstant (root) {
    return root.type == "Number" || root.type == "Constant";
}

function prec (operator) {
    if (operator == "(")
        return 0;
    if (operator == "-" || operator == "+")
        return 1;
    else if (operator == "*" || operator == "/")
        return 2;
    else if (operator == "^")
        return 3;
    if (operator == "~")
        return 4;
    return 5;
}

function parse (string, den) {
    var stack = new Stack();
    var array = [];
    var i = 0;
    while (i < string.length) {
        if (isDigit(string[i])) {
            var mem = i;
            while (isDigit(string[i]) && i < string.length)
                i++;
            array.push(new Token("Number", parseInt(string.substring(mem, i)), 0));
            print("number");
        }
        else if (isOperator(string[i])) {
            if (stack.isEmpty() || prec(string[i]) > prec(stack.getTop().value))
                stack.push(new Token("Operator", string[i], (string[i] == "~")? 1 : 2));
            else {
                while (!stack.isEmpty() && prec(string[i]) <= prec(stack.getTop().value))
                    array.push(stack.pop());
                stack.push(new Token("Operator", string[i], (string[i] == "~")? 1 : 2));
            }
            i++;
            print("operator");
        }
        else if (string[i] == "(") {
            stack.push(new Token("Punctuation", string[i], 0));
            i++;
            print("open par");
        }
        else if (string[i] == ",") {
            while (!stack.isEmpty() && stack.getTop().value != "(" && stack.getTop().value != ",")
                array.push(stack.pop());
            i++;
            print("comma");
        }
        else if (string[i] == ")") {
            while (!stack.isEmpty() && stack.getTop().value != "(") {
                var mem = stack.pop();
                if (stack.getTop().value != ",")
                    array.push(mem);
                print("popped " + mem.value);
            }
            if (stack.isEmpty()) {
                print("parsing error");
                return null;
            }
            stack.pop();
            if (!stack.isEmpty() && stack.getTop().type == "Function") {
                var mem = stack.pop()
                array.push(mem);
                print("popped " + mem.value);
            }
            i++;
            print("close par");
        }
        else if (isAlpha(string[i])) {
            var res = [isFunc(string, i), isConst(string, i), isVar(string, i)];
            if (res[0].bool) {
                stack.push(new Token("Function", res[0].type, res[0].args));
                i += res[0].type.length;
                print("function");
            }
            else if (res[1].bool) {
                array.push(new Token("Constant", res[1].type, 0));
                i += res[1].type.length;
                print("constant");
            }
            else if (res[2].bool) {
                array.push(new Token((res[2].type == den)? "Variable" : "Constant", res[2].type, 0));
                i += res[2].type.length;
                print((res[2].type == den)? "variable" : "constant");
            }
        }
        else if (isSpace(string[i]))
            i++;
        else
            throw "Unexpected character";
        print("Stack: " + stack.toString());
    }
    while (!stack.isEmpty())
        array.push(stack.pop());
    print(ArraytoString(array));
    var siz = arrayTrueSize(array);
    var root = toTree(array);
    if (siz != treeSize(root)) {
        print("Array: " + siz.toString());
        print("Tree: " + treeSize(root).toString())
        throw "Parsing error";
    }
    return root;
}

function arrayTrueSize (array) {
    var res = 0;
    for (var i = 0; i < array.length; i++) {
        if (array[i].value != ")" && array[i].value != "(" && array[i].value != ",")
            res++;
    }
    return res;
}

function treeSize (root) {
    if (root.args.length == 0)
        return 1;
    var res = 0;
    for (var i = 0; i < root.args.length; i++)
        res += treeSize(root.args[i]);
    return res+1;
}

function treeToString (root) {
    var string = "";
	for (var i = root.args.length-1; i >= 0; i--)
		string += treeToString(root.args[i]);
	string += root.value;
    return string;
}

function toTree (array) {
    if (array.length == 0)
        throw "Parsing error";
    var token = array.splice(array.length-1, 1)[0];
    var x = new Node(token.type, token.value, token.args);
    for (var i = 0; i < token.args; i++)
        x.args[i] = toTree(array);
    return x;
}

function verifyParenthesis (string) {
    var par = 0;
    var i = 0;
    while (i < string.length) {
        if (string[i] == "(")
            par += 1;
        if (string[i] == ")")
            par -= 1;
        i += 1;
    }
    if (par != 0)
        throw "Invalid parenthesis configuration";
}

function ArraytoString (array) {
    var i = 0;
    var string = "";
    while (i < array.length) {
        if (array[i].type == "Number")
            string = string + array[i].value.toString();
        else
            string = string + array[i].value;
        i += 1;
    }
    return string;
}

function copyTree (root) {
    var ret = new Node(root.type, root.value, root.args.length);
    for (var i = 0; i < root.args.length; i++)
        ret.args[i] = copyTree(root.args[i]);
    return ret;
}

function derivate (root) {
    if (root.value == "*")
        return derivateProduct(root);
    else if (root.value == "/")
        return derivateQuocient(root);
    else if (root.value == "+" || root.value == "-")
        return derivateSum(root);
    else if (root.value == "~") {
        root.args[0] = derivate(root.args[0]);
        return root;
    }
    else if (root.value == "^")
        return derivatePower(root);
    else if (root.type == "Function")
        return derivateFunct(root);
    else if (isConstant(root))
        return new Node("Number", 0, 0);
    else if (root.type == "Variable")
        return new Node("Number", 1, 0);
    throw "Some error occured while derivating";
}

function derivateProduct (root) {
    var cp = copyTree(root);
    var ret = null;
    if (isConstant(root.args[0])) {
        ret = cp;
        ret.args[1] = derivate(ret.args[1]);
    }
    else if (isConstant(root.args[1])) {
        ret = cp;
        ret.args[0] = derivate(root.args[0]);
    }
    else {
        var ret = new Node("Operator", "+", 2);
        ret.args[0] = new Node("Operator", "*", 2);
        ret.args[1] = new Node("Operator", "*", 2);
        ret.args[1].args[1] = derivate(cp.args[1]);
        ret.args[1].args[0] = root.args[0];
        ret.args[0].args[1] = root.args[1];
        ret.args[0].args[0] = derivate(cp.args[0]);
    }
    return ret;
}

function derivateQuocient (root) {
    var cp = copyTree(root);
    var ret = new Node("Operator", "/", 2);
    ret.args[1] = new Node("Operator", "-", 2);
    ret.args[0] = new Node("Operator", "^", 2);
    ret.args[1].args[1] = new Node("Operator", "*", 2);
    ret.args[1].args[0] = new Node("Operator", "*", 2);
    ret.args[1].args[1].args[1] = derivate(cp.args[1]);
    ret.args[1].args[1].args[0] = root.args[0];
    ret.args[1].args[0].args[1] = root.args[1];
    ret.args[1].args[0].args[0] = derivate(cp.args[0]);
    ret.args[0].args[1] = root.args[0];
    ret.args[0].args[0] = new Node("Number", 2, 0);
    return ret;
}

function derivateSum (root) {
    root.args[0] = derivate(root.args[0]);
    root.args[1] = derivate(root.args[1]);
    return root;
}

function derivatePower (root) {
    var cp = copyTree(root);
    var ret = new Node("Operator", "*", 2);
    ret.args[1] = new Node("Operator", "^", 2);
    ret.args[0] = new Node("Operator", "*", 2);
    ret.args[1].args = root.args;
    ret.args[0].args[1] = cp.args[0];
    ret.args[0].args[0] = new Node("Function", "ln", 1);
    ret.args[0].args[0].args[0] = cp.args[1];
    ret.args[0] = derivateProduct(ret.args[0]);
    return ret;
}

function derivateFunct (root) {
    var ret = null;
    var cp = copyTree(root);
    if (root.value == "sin") {
        ret = new Node("Operator", "*", 2);
        ret.args[1] = new Node("Function", "cos", 1);
        ret.args[1].args[0] = root.args[0];
        ret.args[0] = derivate(cp.args[0]);
    }
    else if (root.value == "cos") {
        ret = new Node("Operator", "*", 2);
        ret.args[1] = new Node("Operator", "~", 1);
        ret.args[1].args[0] = new Node("Function", "sin", 1);
        ret.args[1].args[0].args[0] = root.args[0];
        ret.args[0] = derivate(cp.args[0]);
    }
    else if (root.value == "tan") {
        ret = new Node("Operator", "*", 2);
        ret.args[1] = new Node("Operator", "^", 2);
        ret.args[1].args[1] = new Node("Function", "sec", 1);
        ret.args[1].args[1].args[0] = root.args[0];
        ret.args[1].args[0] = new Node("Number", 2, 0);
        ret.args[0] = derivate(cp.args[0]);
    }
    else if (root.value == "sec") {
        ret = new Node("Operator", "*", 2);
        ret.args[1] = new Node("Operator", "*", 2);
        ret.args[1].args[1] = new Node("Function", "tan", 1);
        ret.args[1].args[0] = new Node("Function", "sec", 1);
        ret.args[1].args[1].args[0] = root.args[0];
        ret.args[1].args[0].args[0] = root.args[0];
        ret.args[0] = derivate(cp.args[0]);
    }
    else if (root.value == "csc") {
        ret = new Node("Operator", "*", 2);
        ret.args[1] = new Node("Operator", "~", 1);
        ret.args[1].args[0] = new Node("Operator", "*", 2);
        ret.args[1].args[0].args[1] = new Node("Function", "cot", 1);
        ret.args[1].args[0].args[0] = new Node("Function", "csc", 1);
        ret.args[1].args[0].args[1].args[0] = root.args[0];
        ret.args[1].args[0].args[0].args[0] = root.args[0];
        ret.args[0] = derivate(cp.args[0]);
    }
    else if (root.value == "cot") {
        ret = new Node("Operator", "*", 2);
        ret.args[1] = new Node("Operator", "~", 1);
        ret.args[1].args[0] = new Node("Operator", "^", 2);
        ret.args[1].args[0].args[1] = new Node("Function", "csc", 1);
        ret.args[1].args[0].args[1].args[0] = root.args[0];
        ret.args[1].args[0].args[0] = new Node("Number", 2, 0);
        ret.args[0] = derivate(cp.args[0]);
    }
    else if (root.value == "arcsin") {
        ret = new Node("Operator", "*", 2);
        ret.args[1] = new Node("Operator", "/", 2);
        ret.args[1].args[1] = new Node("Number", 1, 0);
        ret.args[1].args[0] = new Node("Function", "sqrt", 1);
        ret.args[1].args[0].args[0] = new Node("Operator", "-", 2);
        ret.args[1].args[0].args[0].args[1] = new Node("Number", 1, 0);
        ret.args[1].args[0].args[0].args[0] = new Node("Operator", "^", 2);
        ret.args[1].args[0].args[0].args[0].args[1] = root.args[0];
        ret.args[1].args[0].args[0].args[0].args[0] = new Node("Number", 2, 0);
        ret.args[0] = derivate(cp.args[0]);
    }
    else if (root.value == "arccos") {
        ret = new Node("Operator", "*", 2);
        ret.args[1] = new Node("Operator", "~", 1);
        ret.args[1].args[0] = new Node("Operator", "/", 2);
        ret.args[1].args[0].args[1] = new Node("Number", 1, 0);
        ret.args[1].args[0].args[0] = new Node("Function", "sqrt", 1);
        ret.args[1].args[0].args[0].args[0] = new Node("Operator", "-", 2);
        ret.args[1].args[0].args[0].args[0].args[1] = new Node("Number", 1, 0);
        ret.args[1].args[0].args[0].args[0].args[0] = new Node("Operator", "^", 2);
        ret.args[1].args[0].args[0].args[0].args[0].args[1] = root.args[0];
        ret.args[1].args[0].args[0].args[0].args[0].args[0] = new Node("Number", 2, 0);
        ret.args[0] = derivate(cp.args[0]);
    }
    else if (root.value == "arctan") {
        ret = new Node("Operator", "*", 2);
        ret.args[1] = new Node("Operator", "/", 2);
        ret.args[1].args[1] = new Node("Number", 1, 0);
        ret.args[1].args[0] = new Node("Operator", "+", 2);
        ret.args[1].args[0].args[1] = new Node("Number", 1, 0);
        ret.args[1].args[0].args[0] = new Node("Operator", "^", 2);
        ret.args[1].args[0].args[0].args[1] = root.args[0];
        ret.args[1].args[0].args[0].args[0] = new Node("Number", 2, 0);
        ret.args[0] = derivate(cp.args[0]);
    }
    else if (root.value == "arcsec") {
        ret = new Node("Operator", "*", 2);
        ret.args[1] = new Node("Operator", "/", 2);
        ret.args[1].args[1] = new Node("Number", 1, 0);
        ret.args[1].args[0] = new Node("Operator", "-", 2);
        ret.args[1].args[0].args[1] = new Node("Operator", "^", 2);
        ret.args[1].args[0].args[0] = new Node("Operator", "^", 2);
        ret.args[1].args[0].args[1].args[1] = root.args[0];
        ret.args[1].args[0].args[1].args[0] = new Node("Number", 4, 0);
        ret.args[1].args[0].args[0].args[1] = root.args[0];
        ret.args[1].args[0].args[0].args[0] = new Node("Number", 2, 0);
        ret.args[0] = derivate(cp.args[0]);
    }
    else if (root.value == "arccsc") {
        ret = new Node("Operator", "*", 2);
        ret.args[1] = new Node("Operator", "~", 1);
        ret.args[1].args[0] = new Node("Operator", "/", 2);
        ret.args[1].args[0].args[1] = new Node("Number", 1, 0);
        ret.args[1].args[0].args[0] = new Node("Operator", "-", 2);
        ret.args[1].args[0].args[0].args[1] = new Node("Operator", "^", 2);
        ret.args[1].args[0].args[0].args[0] = new Node("Operator", "^", 2);
        ret.args[1].args[0].args[0].args[1].args[1] = root.args[0];
        ret.args[1].args[0].args[0].args[1].args[0] = new Node("Number", 4, 0);
        ret.args[1].args[0].args[0].args[0].args[1] = root.args[0];
        ret.args[1].args[0].args[0].args[0].args[0] = new Node("Number", 2, 0);
        ret.args[0] = derivate(cp.args[0]);
    }
    else if (root.value == "arccot") {
        ret = new Node("Operator", "*", 2);
        ret.args[1] = new Node("Operator", "~", 1);
        ret.args[1].args[0] = new Node("Operator", "/", 2);
        ret.args[1].args[0].args[1] = new Node("Number", 1, 0);
        ret.args[1].args[0].args[0] = new Node("Operator", "+", 2);
        ret.args[1].args[0].args[0].args[1] = new Node("Number", 1, 0);
        ret.args[1].args[0].args[0].args[0] = new Node("Operator", "^", 2);
        ret.args[1].args[0].args[0].args[0].args[1] = root.args[0];
        ret.args[1].args[0].args[0].args[0].args[0] = new Node("Number", 2, 0);
        ret.args[0] = derivate(cp.args[0]);
    }
    else if (root.value == "sinh") {
        ret = new Node("Operator", "*", 2);
        ret.args[1] = new Node("Function", "cosh", 1);
        ret.args[1].args[0] = root.args[0];
        ret.args[0] = derivate(cp.args[0]);
    }
    else if (root.value == "cosh") {
        ret = new Node("Operator", "*", 2);
        ret.args[1] = new Node("Function", "sinh", 1);
        ret.args[1].args[0] = root.args[0];
        ret.args[0] = derivate(cp.args[0]);
    }
    else if (root.value == "tanh") {
        ret = new Node("Operator", "*", 2);
        ret.args[1] = new Node("Operator", "^", 2);
        ret.args[1].args[1] = new Node("Function", "sech", 1);
        ret.args[1].args[1].args[0] = root.args[0];
        ret.args[1].args[0] = new Node("Number", 2, 0);
        ret.args[0] = derivate(cp.args[0]);
    }
    else if (root.value == "sech") {
        ret = new Node("Operator", "*", 2);
        ret.args[1] = new Node("Operator", "~", 1);
        ret.args[1].args[0] = new Node("Operator", "*", 2);
        ret.args[1].args[0].args[1] = new Node("Function", "tanh", 1);
        ret.args[1].args[0].args[0] = new Node("Function", "sech", 1);
        ret.args[1].args[0].args[1].args[0] = root.args[0];
        ret.args[1].args[0].args[0].args[0] = root.args[0];
        ret.args[0] = derivate(cp.args[0]);
    }
    else if (root.value == "csch") {
        ret = new Node("Operator", "*", 2);
        ret.args[1] = new Node("Operator", "~", 1);
        ret.args[1].args[0] = new Node("Operator", "*", 2);
        ret.args[1].args[0].args[1] = new Node("Function", "coth", 1);
        ret.args[1].args[0].args[0] = new Node("Function", "csch", 1);
        ret.args[1].args[0].args[1].args[0] = root.args[0];
        ret.args[1].args[0].args[0].args[0] = root.args[0];
        ret.args[0] = derivate(cp.args[0]);
    }
    else if (root.value == "coth") {
        ret = new Node("Operator", "*", 2);
        ret.args[1] = new Node("Operator", "~", 1);
        ret.args[1].args[0] = new Node("Operator", "^", 2);
        ret.args[1].args[0].args[1] = new Node("Function", "csch", 1);
        ret.args[1].args[0].args[1].args[0] = root.args[0];
        ret.args[1].args[0].args[0] = new Node("Number", 2, 0);
        ret.args[0] = derivate(cp.args[0]);
    }
    else if (root.value == "log") {
        ret = new Node("Operator", "/", 2);
        ret.args[1] = new Node("Function", "ln", 1);
        ret.args[0] = new Node("Function", "ln", 1);
        ret.args[1].args[0] = cp.args[0];
        ret.args[0].args[0] = cp.args[1];
        ret = derivateQuocient(ret);
    }
    else if (root.value == "ln") {
        ret = new Node("Operator", "*", 2);
        ret.args[1] = new Node("Operator", "/", 2);
        ret.args[1].args[1] = new Node("Number", 1, 0);
        ret.args[1].args[0] = root.args[0];
        ret.args[0] = derivate(cp.args[0]);
    }
    else if (root.value == "sqrt") {
        ret = new Node("Operator", "*", 2);
        ret.args[1] = new Node("Operator", "/", 2);
        ret.args[1].args[1] = new Node("Operator", "^", 2);
        ret.args[1].args[0] = new Node("Number", 2, 0);
        ret.args[1].args[1].args[1] = root.args[0];
        ret.args[1].args[1].args[0] = new Node("Operator", "~", 1);
        ret.args[1].args[1].args[0].args[0] = new Node("Operator", "/", 2);
        ret.args[1].args[1].args[0].args[0].args[1] = new Node("Number", 1, 0);
        ret.args[1].args[1].args[0].args[0].args[0] = new Node("Number", 2, 0);
        ret.args[0] = derivate(cp.args[0]);
    }
    else if (root.value == "sum") {
        ret = root;
        ret.args[0] = derivate(cp.args[0]);
    }
    if (ret == null)
        throw "Program does not support " + root.value + " yet";
    return ret;
}

function simplify (root) {
    if (isTerminal(root))
        return root;
    for (var i = 0; i < root.args.length; i++)
        root.args[i] = simplify(root.args[i]);
    if (root.value == "+") {
        if (root.args[0].type == "Number" && root.args[1].type == "Number") {
            var sum = root.args[0].value + root.args[1].value;
            return new Node("Number", sum, 0);
        }
        else if (root.args[0].value == 0)
            return root.args[1];
        else if (root.args[1].value == 0)
            return root.args[0];
    }
    else if (root.value == "-") {
        if (root.args[0].type == "Number" && root.args[1].type == "Number") {
            var sub = root.args[1].value - root.args[0].value;
            return new Node("Number", sub, 0);
        }
        else if (root.args[0].value == 0)
            return root.args[1];
        else if (root.args[1].value == 0) {
            var ret = new Node("Operator", "~", 1);
            ret.args[0] = root.args[0];
            return ret;
        }
    }
    else if (root.value == "*") {
        if (root.args[0].value == 0 || root.args[1].value == 0)
            return new Node("Number", 0, 0);
        else if (root.args[0].value == 1)
            return root.args[1];
        else if (root.args[1].value == 1)
            return root.args[0];
        else if (root.args[0].type == "Number" && root.args[1].type == "Number") {
            var mult = root.args[0].value*root.args[1].value;
            return new Node("Number", mult, 0);
        }
        else if (root.args[0].value < 0 && root.args[1].value == "~") {
            if (root.args[0].value == -1)
                root = root.args[1].args[0];
            else {
                root.args[1] = root.args[1].args[0];
                root.args[0].value = -root.args[0].value;
            }
        }
        else if (root.args[1].value < 0 && root.args[0].value == "~") {
            if (root.args[1].value == -1)
                root = root.args[0].args[0];
            else {
                root.args[0] = root.args[0].args[0];
                root.args[1].value = -root.args[1].value;
            }
        }
    }
    else if (root.value == "/") {
        if (root.args[1].value == 0)
            return new Node("Number", 0, 0);
        else if (root.args[0].value == 0)
            throw "What's wrong with that division by zero?";
        else if (root.args[0].value == 1)
            return root.args[1];
        else if (root.args[0].type == "Number" && root.args[1].type == "Number") {
            var div = root.args[1].value/root.args[0].value;
            return new Node("Number", div, 0);
        }
    }
    else if (root.value == "~" && root.args[0].type == "Number")
        return new Node("Number", -root.args[0].value, 0);
    else if (root.value == "^") {
        if (root.args[1] == 0)
            return new Node("Number", 0, 0);
        else if (root.args[0] == 0)
            return new Node("Number", 1, 0);
        else if (root.args[0].type == "Number" && root.args[1].type == "Number") {
            var pow = Math.pow(root.args[1].value, root.args[0].value);
            return new Node("Number", pow, 0);
        }
    }
    else if (root.value == "sin") {
        if (root.args[0].value == 0 || root.args[0].value == "pi")
            return new Node("Number", 0, 0);
    }
    else if (root.value == "cos") {
        if (root.args[0].value == 0)
            return new Node("Number", 1, 0);
        else if (root.args[0].value == "pi")
            return new Node("Number", -1, 0);
    }
    else if (root.value == "ln" && root.args[0].value == "e")
        return new Node("Number", 1, 0);
    else if (root.value == "sum" && root.args[0].value == 0)
        return new Node("Number", 0, 0);
    return root;
}

function toInfix (root) {
    if (isTerminal(root))
        return root.value.toString();
    else if (root.type == "Operator") {
        if (root.value == "~")
            return "~" + toInfix(root.args[0]);
        else {
            var s1 = toInfix(root.args[0]);
            var s2 = toInfix(root.args[1]);
            if (prec(root.value) > prec(root.args[0].value) || root.args[0].value == "~")
                s1 = "(" + s1 + ")";
            else if (root.value == "/" && !isTerminal(root.args[0]))
                s1 = "(" + s1 + ")";
            if (prec(root.value) > prec(root.args[1].value) || root.args[1].value == "~")
                s2 = "(" + s2 + ")";
            else if (root.value == "/" && !isTerminal(root.args[1]))
                s2 = "(" + s2 + ")";
            return s2 + root.value + s1;
        }
    }
    else if (root.value == "sum") {
        var s = "sum_" + root.args[2].value + "^" + root.args[1].value;
        return s + toInfix(root.args[0]);
    }
    else {
        var inner = toInfix(root.args[root.args.length-1]);
        for (var i = root.args.length-2; i >= 0; i--)
            inner += "," + toInfix(root.args[i]);
        return root.value + "(" + inner + ")";
    }
}

function setCharAt (str, index, chr) {
    if (index > str.length-1)
        return str;
    return str.substr(0,index) + chr + str.substr(index+1);
}

function posPreparations (string) {
    for (var i = 0; i < string.length; i++) {
        if (string[i] == "~")
            string = setCharAt(string, i, "-");
    }
    return string;
}

function main () {
    var formInput = document.getElementById("formInput");
    var varInput = document.getElementById("varInput");
    var nestedDiv = document.getElementById("result");
    nestedDiv.textContent = ".";
    log("");
    var formula = formInput.value;
    var den = varInput.value;
    var res = isVar(den, 0);
    if (res.bool) {
        //try {
            verifyParenthesis(formula);
            var root = parse(formula, den);
            var der = derivate(root);
            //print(der);
            der = simplify(der);
            //print("There we go");
            //print(der);
            der = toInfix(der);
            der = posPreparations(der);
            nestedDiv.innerHTML = '`' + der + '`';
            MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
            print(toInfix(der));
        //}
        //catch (err) {
            //log(err);
        //}
    }
    else
        log("Invalid variable");
}
