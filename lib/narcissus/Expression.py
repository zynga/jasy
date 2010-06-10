from narcissus.Lang import *
from narcissus.Node import Node

opPrecedence = {
    "SEMICOLON": 0,
    "COMMA": 1,
    "ASSIGN": 2, "HOOK": 2, "COLON": 2,
    # The above all have to have the same precedence, see bug 330975.
    "OR": 4,
    "AND": 5,
    "BITWISE_OR": 6,
    "BITWISE_XOR": 7,
    "BITWISE_AND": 8,
    "EQ": 9, "NE": 9, "STRICT_EQ": 9, "STRICT_NE": 9,
    "LT": 10, "LE": 10, "GE": 10, "GT": 10, "IN": 10, "INSTANCEOF": 10,
    "LSH": 11, "RSH": 11, "URSH": 11,
    "PLUS": 12, "MINUS": 12,
    "MUL": 13, "DIV": 13, "MOD": 13,
    "DELETE": 14, "VOID": 14, "TYPEOF": 14,
    # "PRE_INCREMENT": 14, "PRE_DECREMENT": 14,
    "NOT": 14, "BITWISE_NOT": 14, "UNARY_PLUS": 14, "UNARY_MINUS": 14,
    "INCREMENT": 15, "DECREMENT": 15,     # postfix
    "NEW": 16,
    "DOT": 17
}

# Map operator type code to precedence
for i in opPrecedence.copy():
    opPrecedence[globals()[i]] = opPrecedence[i]

opArity = {
    "COMMA": -2,
    "ASSIGN": 2,
    "HOOK": 3,
    "OR": 2,
    "AND": 2,
    "BITWISE_OR": 2,
    "BITWISE_XOR": 2,
    "BITWISE_AND": 2,
    "EQ": 2, "NE": 2, "STRICT_EQ": 2, "STRICT_NE": 2,
    "LT": 2, "LE": 2, "GE": 2, "GT": 2, "IN": 2, "INSTANCEOF": 2,
    "LSH": 2, "RSH": 2, "URSH": 2,
    "PLUS": 2, "MINUS": 2,
    "MUL": 2, "DIV": 2, "MOD": 2,
    "DELETE": 1, "VOID": 1, "TYPEOF": 1,
    # "PRE_INCREMENT": 1, "PRE_DECREMENT": 1,
    "NOT": 1, "BITWISE_NOT": 1, "UNARY_PLUS": 1, "UNARY_MINUS": 1,
    "INCREMENT": 1, "DECREMENT": 1,     # postfix
    "NEW": 1, "NEW_WITH_ARGS": 2, "DOT": 2, "INDEX": 2, "CALL": 2,
    "ARRAY_INIT": 1, "OBJECT_INIT": 1, "GROUP": 1
}

# Map operator type code to arity.
for i in opArity.copy():
    opArity[globals()[i]] = opArity[i]
    
def Expression(t, x, stop=None):
    operators = []
    operands = []
    bl = x.bracketLevel
    cl = x.curlyLevel
    pl = x.parenLevel
    hl = x.hookLevel

    def reduce_():
        n = operators.pop()
        op = n.type_
        arity = opArity[op]
        if arity == -2:
            # Flatten left-associative trees.
            left = (len(operands) >= 2 and operands[-2])
            if left.type_ == op:
                right = operands.pop()
                left.append(right)
                return left
            arity = 2

        # Always use append to add operands to n, to update start and end.
        a = operands[-arity:]
        del operands[-arity:]
        for operand in a:
            n.append(operand)

        # Include closing bracket or postfix operator in [start,end).
        if n.end < t.token.end:
            n.end = t.token.end

        operands.append(n)
        return n

    class BreakOutOfLoops(Exception): 
        pass
        
    try:
        while True:
            tt = t.get()
            if tt == END: break
            if (tt == stop and x.bracketLevel == bl and x.curlyLevel == cl and
                    x.parenLevel == pl and x.hookLevel == hl):
                # Stop only if tt matches the optional stop parameter, and that
                # token is not quoted by some kind of bracket.
                break
            if tt == SEMICOLON:
                # NB: cannot be empty, Statement handled that.
                raise BreakOutOfLoops

            elif tt in (ASSIGN, HOOK, COLON):
                if t.scanOperand:
                    raise BreakOutOfLoops
                while ((operators and opPrecedence.get(operators[-1].type_, None) > opPrecedence.get(tt)) or (tt == COLON and operators and operators[-1].type_ == ASSIGN)):
                    reduce_()
                if tt == COLON:
                    if operators:
                        n = operators[-1]
                    if not operators or n.type_ != HOOK:
                        raise t.newSyntaxError("Invalid label")
                    x.hookLevel -= 1
                else:
                    operators.append(Node(t))
                    if tt == ASSIGN:
                        operands[-1].assignOp = t.token.assignOp
                    else:
                        x.hookLevel += 1

                t.scanOperand = True

            elif tt in (IN, COMMA, OR, AND, BITWISE_OR, BITWISE_XOR, BITWISE_AND, EQ, NE, 
                STRICT_EQ, STRICT_NE, LT, LE, GE, GT, INSTANCEOF, LSH, RSH, URSH, PLUS, MINUS, MUL, DIV, MOD, DOT):
                
                # We're treating comma as left-associative so reduce can fold
                # left-heavy COMMA trees into a single array.
                if tt == IN:
                    # An in operator should not be parsed if we're parsing the
                    # head of a for (...) loop, unless it is in the then part of
                    # a conditional expression, or parenthesized somehow.
                    if (x.inForLoopInit and not x.hookLevel and not
                            x.bracketLevel and not x.curlyLevel and
                            not x.parenLevel):
                        raise BreakOutOfLoops
                if t.scanOperand:
                    raise BreakOutOfLoops
                while (operators and opPrecedence.get(operators[-1].type_)
                        >= opPrecedence.get(tt)):
                    reduce_()
                if tt == DOT:
                    t.mustMatch(IDENTIFIER)
                    operands.append(Node(t, DOT, [operands.pop(), Node(t)]))
                else:
                    operators.append(Node(t))
                    t.scanOperand = True

            elif tt in (DELETE, VOID, TYPEOF, NOT, BITWISE_NOT, UNARY_PLUS, UNARY_MINUS, NEW):
                if not t.scanOperand:
                    raise BreakOutOfLoops
                operators.append(Node(t))

            elif tt in (INCREMENT, DECREMENT):
                if t.scanOperand:
                    operators.append(Node(t)) # prefix increment or decrement
                else:
                    # Don't cross a line boundary for postfix {in,de}crement.
                    if (t.tokens.get((t.tokenIndex + t.lookahead - 1)
                            & 3).lineno != t.lineno):
                        raise BreakOutOfLoops

                    # Use >, not >=, so postfix has higher precedence than
                    # prefix.
                    while (operators and opPrecedence.get(operators[-1].type_,
                            None) > opPrecedence.get(tt)):
                        reduce_()
                    n = Node(t, tt, [operands.pop()])
                    n.postfix = True
                    operands.append(n)

            elif tt == FUNCTION:
                if not t.scanOperand:
                    raise BreakOutOfLoops
                operands.append(FunctionDefinition(t, x, False, EXPRESSED_FORM))
                t.scanOperand = False

            elif tt in (NULL, THIS, TRUE, FALSE, IDENTIFIER, NUMBER, STRING,
                    REGEXP):
                if not t.scanOperand:
                    raise BreakOutOfLoops
                operands.append(Node(t))
                t.scanOperand = False

            elif tt == LEFT_BRACKET:
                if t.scanOperand:
                    # Array initializer. Parse using recursive descent, as the
                    # sub-grammer here is not an operator grammar.
                    n = Node(t, ARRAY_INIT)
                    while True:
                        tt = t.peek()
                        if tt == RIGHT_BRACKET: break
                        if tt == COMMA:
                            t.get()
                            n.append(None)
                            continue
                        n.append(Expression(t, x, COMMA))
                        if not t.match(COMMA):
                            break
                    t.mustMatch(RIGHT_BRACKET)
                    operands.append(n)
                    t.scanOperand = False
                else:
                    operators.append(Node(t, INDEX))
                    t.scanOperand = True
                    x.bracketLevel += 1

            elif tt == RIGHT_BRACKET:
                if t.scanOperand or x.bracketLevel == bl:
                    raise BreakOutOfLoops
                while reduce_().type_ != INDEX:
                    continue
                x.bracketLevel -= 1

            elif tt == LEFT_CURLY:
                if not t.scanOperand:
                    raise BreakOutOfLoops
                # Object initializer. As for array initializers (see above),
                # parse using recursive descent.
                x.curlyLevel += 1
                n = Node(t, OBJECT_INIT)

                class BreakOutOfObjectInit(Exception): pass
                try:
                    if not t.match(RIGHT_CURLY):
                        while True:
                            tt = t.get()
                            if ((t.token.value == "get" or
                                    t.token.value == "set") and
                                    t.peek == IDENTIFIER):
                                if x.ecmaStrictMode:
                                    raise t.newSyntaxError("Illegal property "
                                            "accessor")
                                n.append(FunctionDefinition(t, x, True,
                                        EXPRESSED_FORM))
                            else:
                                if tt in (IDENTIFIER, NUMBER, STRING):
                                    id_ = Node(t)
                                elif tt == RIGHT_CURLY:
                                    if x.ecmaStrictMode:
                                        raise t.newSyntaxError("Illegal "
                                                "trailing ,")
                                    raise BreakOutOfObjectInit
                                else:
                                    raise t.newSyntaxError("Invalid property "
                                            "name")
                                t.mustMatch(COLON)
                                n.append(Node(t, PROPERTY_INIT, [id_,
                                        Expression(t, x, COMMA)]))
                            if not t.match(COMMA): break
                        t.mustMatch(RIGHT_CURLY)
                except BreakOutOfObjectInit, e: pass
                operands.append(n)
                t.scanOperand = False
                x.curlyLevel -= 1

            elif tt == RIGHT_CURLY:
                if not t.scanOperand and x.curlyLevel != cl:
                    raise ParseError("PANIC: right curly botch")
                raise BreakOutOfLoops

            elif tt == LEFT_PAREN:
                if t.scanOperand:
                    operators.append(Node(t, GROUP))
                    x.parenLevel += 1
                else:
                    while (operators and
                            opPrecedence.get(operators[-1].type_) >
                            opPrecedence[NEW]):
                        reduce_()

                    # Handle () now, to regularize the n-ary case for n > 0.
                    # We must set scanOperand in case there are arguments and
                    # the first one is a regexp or unary+/-.
                    if operators:
                        n = operators[-1]
                    else:
                        n = Object()
                        n.type_ = None
                    t.scanOperand = True
                    if t.match(RIGHT_PAREN):
                        if n.type_ == NEW:
                            operators.pop()
                            n.append(operands.pop())
                        else:
                            n = Node(t, CALL, [operands.pop(), Node(t, LIST)])
                        operands.append(n)
                        t.scanOperand = False
                    else:
                        if n.type_ == NEW:
                            n.type_ = NEW_WITH_ARGS
                        else:
                            operators.append(Node(t, CALL))
                        x.parenLevel += 1

            elif tt == RIGHT_PAREN:
                if t.scanOperand or x.parenLevel == pl:
                    raise BreakOutOfLoops
                while True:
                    tt = reduce_().type_
                    if tt in (GROUP, CALL, NEW_WITH_ARGS):
                        break
                if tt != GROUP:
                    if operands:
                        n = operands[-1]
                        if n[1].type_ != COMMA:
                            n[1] = Node(t, LIST, [n[1]])
                        else:
                            n[1].type_ = LIST
                    else:
                        raise ParseError, "Unexpected amount of operands"
                x.parenLevel -= 1

            # Automatic semicolon insertion means we may scan across a newline
            # and into the beginning of another statement. If so, break out of
            # the while loop and let the t.scanOperand logic handle errors.
            else:
                raise BreakOutOfLoops
    except BreakOutOfLoops, e: pass

    if x.hookLevel != hl:
        raise t.newSyntaxError("Missing : after ?")
    if x.parenLevel != pl:
        raise t.newSyntaxError("Missing ) in parenthetical")
    if x.bracketLevel != bl:
        raise t.newSyntaxError("Missing ] in index expression")
    if t.scanOperand:
        raise t.newSyntaxError("Missing operand")

    t.scanOperand = True
    t.unget()
    while operators:
        reduce_()
    return operands.pop()