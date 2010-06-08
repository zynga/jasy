from next.Node import Node
from next.Tokenizer import *
from next.CompilerContext import CompilerContext
from next.Expression import Expression

DECLARED_FORM = 0
EXPRESSED_FORM = 1
STATEMENT_FORM = 2

def Script(t, x):
    n = Statements(t, x)
    n.type_ = SCRIPT
    n.funDecls = x.funDecls
    n.varDecls = x.varDecls
    return n
    
def Statements(t, x):
    n = Node(t, BLOCK)
    x.stmtStack.append(n)
    while not t.done and t.peek() != RIGHT_CURLY:
        n.append(Statement(t, x))
    x.stmtStack.pop()
    return n

def Block(t, x):
    t.mustMatch(LEFT_CURLY)
    n = Statements(t, x)
    t.mustMatch(RIGHT_CURLY)
    return n

def Statement(t, x):
    tt = t.get()

    # Cases for statements ending in a right curly return early, avoiding the
    # common semicolon insertion magic after this switch.
    if tt == FUNCTION:
        if len(x.stmtStack) > 1:
            type_ = STATEMENT_FORM
        else:
            type_ = DECLARED_FORM
        return FunctionDefinition(t, x, True, type_)

    elif tt == LEFT_CURLY:
        n = Statements(t, x)
        t.mustMatch(RIGHT_CURLY)
        return n

    elif tt == IF:
        n = Node(t)
        n.condition = ParenExpression(t, x)
        x.stmtStack.append(n)
        n.thenPart = Statement(t, x)
        if t.match(ELSE):
            n.elsePart = Statement(t, x)
        else:
            n.elsePart = None
        x.stmtStack.pop()
        return n

    elif tt == SWITCH:
        n = Node(t)
        t.mustMatch(LEFT_PAREN)
        n.discriminant = Expression(t, x)
        t.mustMatch(RIGHT_PAREN)
        n.cases = []
        n.defaultIndex = -1
        x.stmtStack.append(n)
        t.mustMatch(LEFT_CURLY)
        while True:
            tt = t.get()
            if tt == RIGHT_CURLY: break

            if tt in (DEFAULT, CASE):
                if tt == DEFAULT and n.defaultIndex >= 0:
                    raise t.newSyntaxError("More than one switch default")
                n2 = Node(t)
                if tt == DEFAULT:
                    n.defaultIndex = len(n.cases)
                else:
                    n2.caseLabel = Expression(t, x, COLON)
            else:
                raise t.newSyntaxError("Invalid switch case")
            t.mustMatch(COLON)
            n2.statements = Node(t, BLOCK)
            while True:
                tt = t.peek()
                if(tt == CASE or tt == DEFAULT or tt == RIGHT_CURLY): break
                n2.statements.append(Statement(t, x))
            n.cases.append(n2)
        x.stmtStack.pop()
        return n

    elif tt == FOR:
        n = Node(t)
        n2 = None
        n.isLoop = True
        t.mustMatch(LEFT_PAREN)
        tt = t.peek()
        if tt != SEMICOLON:
            x.inForLoopInit = True
            if tt == VAR or tt == CONST:
                t.get()
                n2 = Variables(t, x)
            else:
                n2 = Expression(t, x)
            x.inForLoopInit = False

        if n2 and t.match(IN):
            n.type_ = FOR_IN
            if n2.type_ == VAR:
                if len(n2) != 1:
                    raise SyntaxError("Invalid for..in left-hand side",
                            t.filename, n2.lineno)

                # NB: n2[0].type_ == INDENTIFIER and n2[0].value == n2[0].name
                n.iterator = n2[0]
                n.varDecl = n2
            else:
                n.iterator = n2
                n.varDecl = None
            n.object = Expression(t, x)
        else:
            if n2:
                n.setup = n2
            else:
                n.setup = None
            t.mustMatch(SEMICOLON)
            if t.peek() == SEMICOLON:
                n.condition = None
            else:
                n.condition = Expression(t, x)
            t.mustMatch(SEMICOLON)
            if t.peek() == RIGHT_PAREN:
                n.update = None
            else:
                n.update = Expression(t, x)
        t.mustMatch(RIGHT_PAREN)
        n.body = nest(t, x, n, Statement)
        return n

    elif tt == WHILE:
        n = Node(t)
        n.isLoop = True
        n.condition = ParenExpression(t, x)
        n.body = nest(t, x, n, Statement)
        return n

    elif tt == DO:
        n = Node(t)
        n.isLoop = True
        n.body = nest(t, x, n, Statement, WHILE)
        n.condition = ParenExpression(t, x)
        if not x.ecmaStrictMode:
            # <script language="JavaScript"> (without version hints) may need
            # automatic semicolon insertion without a newline after do-while.
            # See http://bugzilla.mozilla.org/show_bug.cgi?id=238945.
            t.match(SEMICOLON)
            return n

    elif tt in (BREAK, CONTINUE):
        n = Node(t)
        if t.peekOnSameLine() == IDENTIFIER:
            t.get()
            n.label = t.token.value
        ss = x.stmtStack
        i = len(ss)
        label = getattr(n, "label", None)
        if label:
            while True:
                i -= 1
                if i < 0:
                    raise t.newSyntaxError("Label not found")
                if getattr(ss[i], "label", None) == label: break
        else:
            while True:
                i -= 1
                if i < 0:
                    if tt == BREAK:
                        raise t.newSyntaxError("Invalid break")
                    else:
                        raise t.newSyntaxError("Invalid continue")
                if (getattr(ss[i], "isLoop", None) or (tt == BREAK and
                        ss[i].type_ == SWITCH)):
                    break
        n.target = ss[i]

    elif tt == TRY:
        n = Node(t)
        n.tryBlock = Block(t, x)
        n.catchClauses = []
        while t.match(CATCH):
            n2 = Node(t)
            t.mustMatch(LEFT_PAREN)
            n2.varName = t.mustMatch(IDENTIFIER).value
            if t.match(IF):
                if x.ecmaStrictMode:
                    raise t.newSyntaxError("Illegal catch guard")
                if n.catchClauses and not n.catchClauses[-1].guard:
                    raise t.newSyntaxError("Gaurded catch after unguarded")
                n2.guard = Expression(t, x)
            else:
                n2.guard = None
            t.mustMatch(RIGHT_PAREN)
            n2.block = Block(t, x)
            n.catchClauses.append(n2)
        if t.match(FINALLY):
            n.finallyBlock = Block(t, x)
        if not n.catchClauses and not getattr(n, "finallyBlock", None):
            raise t.newSyntaxError("Invalid try statement")
        return n

    elif tt in (CATCH, FINALLY):
        raise t.newSyntaxError(tokens[tt] + " without preceding try")

    elif tt == THROW:
        n = Node(t)
        n.exception = Expression(t, x)

    elif tt == RETURN:
        if not x.inFunction:
            raise t.newSyntaxError("Invalid return")
        n = Node(t)
        tt = t.peekOnSameLine()
        if tt not in (END, NEWLINE, SEMICOLON, RIGHT_CURLY):
            n.value = Expression(t, x)

    elif tt == WITH:
        n = Node(t)
        n.object = ParenExpression(t, x)
        n.body = nest(t, x, n, Statement)
        return n

    elif tt in (VAR, CONST):
        n = Variables(t, x)

    elif tt == DEBUGGER:
        n = Node(t)

    elif tt in (NEWLINE, SEMICOLON):
        n = Node(t, SEMICOLON)
        n.expression = None
        return n

    else:
        if tt == IDENTIFIER:
            t.scanOperand = False
            tt = t.peek()
            t.scanOperand = True
            if tt == COLON:
                label = t.token.value
                ss = x.stmtStack
                i = len(ss) - 1
                while i >= 0:
                    if getattr(ss[i], "label", None) == label:
                        raise t.newSyntaxError("Duplicate label")
                    i -= 1
                t.get()
                n = Node(t, LABEL)
                n.label = label
                n.statement = nest(t, x, n, Statement)
                return n

        n = Node(t, SEMICOLON)
        t.unget()
        n.expression = Expression(t, x)
        n.end = n.expression.end

    if t.lineno == t.token.lineno:
        tt = t.peekOnSameLine()
        if tt not in (END, NEWLINE, SEMICOLON, RIGHT_CURLY):
            raise t.newSyntaxError("Missing ; before statement")
    t.match(SEMICOLON)
    return n

def FunctionDefinition(t, x, requireName, functionForm):
    f = Node(t)
    if f.type_ != FUNCTION:
        if f.value == "get":
            f.type_ = GETTER
        else:
            f.type_ = SETTER
    if t.match(IDENTIFIER):
        f.name = t.token.value
    elif requireName:
        raise t.newSyntaxError("Missing function identifier")

    t.mustMatch(LEFT_PAREN)
    f.params = []
    while True:
        tt = t.get()
        if tt == RIGHT_PAREN: break
        if tt != IDENTIFIER:
            raise t.newSyntaxError("Missing formal parameter")
        f.params.append(t.token.value)
        if t.peek() != RIGHT_PAREN:
            t.mustMatch(COMMA)

    t.mustMatch(LEFT_CURLY)
    x2 = CompilerContext(True)
    f.body = Script(t, x2)
    t.mustMatch(RIGHT_CURLY)
    f.end = t.token.end

    f.functionForm = functionForm
    if functionForm == DECLARED_FORM:
        x.funDecls.append(f)
    return f

def Variables(t, x):
    n = Node(t)
    while True:
        t.mustMatch(IDENTIFIER)
        n2 = Node(t)
        n2.name = n2.value
        if t.match(ASSIGN):
            if t.token.assignOp:
                raise t.newSyntaxError("Invalid variable initialization")
            n2.initializer = Expression(t, x, COMMA)
        n2.readOnly = not not (n.type_ == CONST)
        n.append(n2)
        x.varDecls.append(n2)
        if not t.match(COMMA): break
    return n

def ParenExpression(t, x):
    t.mustMatch(LEFT_PAREN)
    n = Expression(t, x)
    t.mustMatch(RIGHT_PAREN)
    return n

