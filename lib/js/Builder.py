#
# JavaScript Tools - Parser Module
# License: MPL 1.1/GPL 2.0/LGPL 2.1
# Authors: 
#   - Brendan Eich <brendan@mozilla.org> (Original JavaScript) (2004-2010)
#   - Sebastian Werner <info@sebastian-werner.net> (Python Port) (2010)
#

from Node import Node


function VanillaBuilder() {
}

VanillaBuilder.prototype = {
    IF$build: function(t) {
        return new Node(t, IF);
    },

    IF$setCondition: function(n, e) {
        n.condition = e;
    },

    IF$setThenPart: function(n, s) {
        n.thenPart = s;
    },

    IF$setElsePart: function(n, s) {
        n.elsePart = s;
    },

    IF$finish: function(n) {
    },

    SWITCH$build: function(t) {
        var n = new Node(t, SWITCH);
        n.cases = [];
        n.defaultIndex = -1;
        return n;
    },

    SWITCH$setDiscriminant: function(n, e) {
        n.discriminant = e;
    },

    SWITCH$setDefaultIndex: function(n, i) {
        n.defaultIndex = i;
    },

    SWITCH$addCase: function(n, n2) {
        n.cases.push(n2);
    },

    SWITCH$finish: function(n) {
    },

    CASE$build: function(t) {
        return new Node(t, CASE);
    },

    CASE$setLabel: function(n, e) {
        n.caseLabel = e;
    },

    CASE$initializeStatements: function(n, t) {
        n.statements = new Node(t, BLOCK);
    },

    CASE$addStatement: function(n, s) {
        n.statements.push(s);
    },

    CASE$finish: function(n) {
    },

    DEFAULT$build: function(t, p) {
        return new Node(t, DEFAULT);
    },

    DEFAULT$initializeStatements: function(n, t) {
        n.statements = new Node(t, BLOCK);
    },

    DEFAULT$addStatement: function(n, s) {
        n.statements.push(s);
    },

    DEFAULT$finish: function(n) {
    },

    FOR$build: function(t) {
        var n = new Node(t, FOR);
        n.isLoop = true;
        n.isEach = false;
        return n;
    },

    FOR$rebuildForEach: function(n) {
        n.isEach = true;
    },

    # NB. This function is called after rebuildForEach, if that's called
    # at all.
    FOR$rebuildForIn: function(n) {
        n.type = FOR_IN;
    },

    FOR$setCondition: function(n, e) {
        n.condition = e;
    },

    FOR$setSetup: function(n, e) {
        n.setup = e || null;
    },

    FOR$setUpdate: function(n, e) {
        n.update = e;
    },

    FOR$setObject: function(n, e) {
        n.object = e;
    },

    FOR$setIterator: function(n, e, e2) {
        n.iterator = e;
        n.varDecl = e2;
    },

    FOR$setBody: function(n, s) {
        n.body = s;
    },

    FOR$finish: function(n) {
    },

    WHILE$build: function(t) {
        var n = new Node(t, WHILE);
        n.isLoop = true;
        return n;
    },

    WHILE$setCondition: function(n, e) {
        n.condition = e;
    },

    WHILE$setBody: function(n, s) {
        n.body = s;
    },

    WHILE$finish: function(n) {
    },

    DO$build: function(t) {
        var n = new Node(t, DO);
        n.isLoop = true;
        return n;
    },

    DO$setCondition: function(n, e) {
        n.condition = e;
    },

    DO$setBody: function(n, s) {
        n.body = s;
    },

    DO$finish: function(n) {
    },

    BREAK$build: function(t) {
        return new Node(t, BREAK);
    },

    BREAK$setLabel: function(n, v) {
        n.label = v;
    },

    BREAK$setTarget: function(n, n2) {
        n.target = n2;
    },

    BREAK$finish: function(n) {
    },

    CONTINUE$build: function(t) {
        return new Node(t, CONTINUE);
    },

    CONTINUE$setLabel: function(n, v) {
        n.label = v;
    },

    CONTINUE$setTarget: function(n, n2) {
        n.target = n2;
    },

    CONTINUE$finish: function(n) {
    },

    TRY$build: function(t) {
        var n = new Node(t, TRY);
        n.catchClauses = [];
        return n;
    },

    TRY$setTryBlock: function(n, s) {
        n.tryBlock = s;
    },

    TRY$addCatch: function(n, n2) {
        n.catchClauses.push(n2);
    },

    TRY$finishCatches: function(n) {
    },

    TRY$setFinallyBlock: function(n, s) {
        n.finallyBlock = s;
    },

    TRY$finish: function(n) {
    },

    CATCH$build: function(t) {
        var n = new Node(t, CATCH);
        n.guard = null;
        return n;
    },

    CATCH$setVarName: function(n, v) {
        n.varName = v;
    },

    CATCH$setGuard: function(n, e) {
        n.guard = e;
    },

    CATCH$setBlock: function(n, s) {
        n.block = s;
    },

    CATCH$finish: function(n) {
    },

    THROW$build: function(t) {
        return new Node(t, THROW);
    },

    THROW$setException: function(n, e) {
        n.exception = e;
    },

    THROW$finish: function(n) {
    },

    RETURN$build: function(t) {
        return new Node(t, RETURN);
    },

    RETURN$setValue: function(n, e) {
        n.value = e;
    },

    RETURN$finish: function(n) {
    },

    YIELD$build: function(t) {
        return new Node(t, YIELD);
    },

    YIELD$setValue: function(n, e) {
        n.value = e;
    },

    YIELD$finish: function(n) {
    },

    GENERATOR$build: function(t) {
        return new Node(t, GENERATOR);
    },

    GENERATOR$setExpression: function(n, e) {
        n.expression = e;
    },

    GENERATOR$setTail: function(n, n2) {
        n.tail = n2;
    },

    GENERATOR$finish: function(n) {
    },

    WITH$build: function(t) {
        return new Node(t, WITH);
    },

    WITH$setObject: function(n, e) {
        n.object = e;
    },

    WITH$setBody: function(n, s) {
        n.body = s;
    },

    WITH$finish: function(n) {
    },

    DEBUGGER$build: function(t) {
        return new Node(t, DEBUGGER);
    },

    SEMICOLON$build: function(t) {
        return new Node(t, SEMICOLON);
    },

    SEMICOLON$setExpression: function(n, e) {
        n.expression = e;
    },

    SEMICOLON$finish: function(n) {
    },

    LABEL$build: function(t) {
        return new Node(t, LABEL);
    },

    LABEL$setLabel: function(n, e) {
        n.label = e;
    },

    LABEL$setStatement: function(n, s) {
        n.statement = s;
    },

    LABEL$finish: function(n) {
    },

    FUNCTION$build: function(t) {
        var n = new Node(t);
        if (n.type != FUNCTION)
            n.type = (n.value == "get") ? GETTER : SETTER;
        n.params = [];
        return n;
    },

    FUNCTION$setName: function(n, v) {
        n.name = v;
    },

    FUNCTION$addParam: function(n, v) {
        n.params.push(v);
    },

    FUNCTION$setBody: function(n, s) {
        n.body = s;
    },

    FUNCTION$hoistVars: function(x) {
    },

    FUNCTION$finish: function(n, x) {
    },

    VAR$build: function(t) {
        return new Node(t, VAR);
    },

    VAR$addDecl: function(n, n2, x) {
        n.push(n2);
    },

    VAR$finish: function(n) {
    },

    CONST$build: function(t) {
        return new Node(t, VAR);
    },

    CONST$addDecl: function(n, n2, x) {
        n.push(n2);
    },

    CONST$finish: function(n) {
    },

    LET$build: function(t) {
        return new Node(t, LET);
    },

    LET$addDecl: function(n, n2, x) {
        n.push(n2);
    },

    LET$finish: function(n) {
    },

    DECL$build: function(t) {
        return new Node(t, IDENTIFIER);
    },

    DECL$setName: function(n, v) {
        n.name = v;
    },

    DECL$setInitializer: function(n, e) {
        n.initializer = e;
    },

    DECL$setReadOnly: function(n, b) {
        n.readOnly = b;
    },

    DECL$finish: function(n) {
    },

    LET_BLOCK$build: function(t) {
        var n = Node(t, LET_BLOCK);
        n.varDecls = [];
        return n;
    },

    LET_BLOCK$setVariables: function(n, n2) {
        n.variables = n2;
    },

    LET_BLOCK$setExpression: function(n, e) {
        n.expression = e;
    },

    LET_BLOCK$setBlock: function(n, s) {
        n.block = s;
    },

    LET_BLOCK$finish: function(n) {
    },

    BLOCK$build: function(t, id) {
        var n = new Node(t, BLOCK);
        n.varDecls = [];
        n.id = id;
        return n;
    },

    BLOCK$hoistLets: function(n) {
    },

    BLOCK$addStatement: function(n, n2) {
        n.push(n2);
    },

    BLOCK$finish: function(n) {
    },

    EXPRESSION$build: function(t, tt) {
        return new Node(t, tt);
    },

    EXPRESSION$addOperand: function(n, n2) {
        n.push(n2);
    },

    EXPRESSION$finish: function(n) {
    },

    ASSIGN$build: function(t) {
        return new Node(t, ASSIGN);
    },

    ASSIGN$addOperand: function(n, n2) {
        n.push(n2);
    },

    ASSIGN$setAssignOp: function(n, o) {
        n.assignOp = o;
    },

    ASSIGN$finish: function(n) {
    },

    HOOK$build: function(t) {
        return new Node(t, HOOK);
    },

    HOOK$setCondition: function(n, e) {
        n[0] = e;
    },

    HOOK$setThenPart: function(n, n2) {
        n[1] = n2;
    },

    HOOK$setElsePart: function(n, n2) {
        n[2] = n2;
    },

    HOOK$finish: function(n) {
    },

    OR$build: function(t) {
        return new Node(t, OR);
    },

    OR$addOperand: function(n, n2) {
        n.push(n2);
    },

    OR$finish: function(n) {
    },

    AND$build: function(t) {
        return new Node(t, AND);
    },

    AND$addOperand: function(n, n2) {
        n.push(n2);
    },

    AND$finish: function(n) {
    },

    BITWISE_OR$build: function(t) {
        return new Node(t, BITWISE_OR);
    },

    BITWISE_OR$addOperand: function(n, n2) {
        n.push(n2);
    },

    BITWISE_OR$finish: function(n) {
    },

    BITWISE_XOR$build: function(t) {
        return new Node(t, BITWISE_XOR);
    },

    BITWISE_XOR$addOperand: function(n, n2) {
        n.push(n2);
    },

    BITWISE_XOR$finish: function(n) {
    },

    BITWISE_AND$build: function(t) {
        return new Node(t, BITWISE_AND);
    },

    BITWISE_AND$addOperand: function(n, n2) {
        n.push(n2);
    },

    BITWISE_AND$finish: function(n) {
    },

    EQUALITY$build: function(t) {
        # NB t.token.type must be EQ, NE, STRICT_EQ, or STRICT_NE.
        return new Node(t);
    },

    EQUALITY$addOperand: function(n, n2) {
        n.push(n2);
    },

    EQUALITY$finish: function(n) {
    },

    RELATIONAL$build: function(t) {
        # NB t.token.type must be LT, LE, GE, or GT.
        return new Node(t);
    },

    RELATIONAL$addOperand: function(n, n2) {
        n.push(n2);
    },

    RELATIONAL$finish: function(n) {
    },

    SHIFT$build: function(t) {
        # NB t.token.type must be LSH, RSH, or URSH.
        return new Node(t);
    },

    SHIFT$addOperand: function(n, n2) {
        n.push(n2);
    },

    SHIFT$finish: function(n) {
    },

    ADD$build: function(t) {
        # NB t.token.type must be PLUS or MINUS.
        return new Node(t);
    },

    ADD$addOperand: function(n, n2) {
        n.push(n2);
    },

    ADD$finish: function(n) {
    },

    MULTIPLY$build: function(t) {
        # NB t.token.type must be MUL, DIV, or MOD.
        return new Node(t);
    },

    MULTIPLY$addOperand: function(n, n2) {
        n.push(n2);
    },

    MULTIPLY$finish: function(n) {
    },

    UNARY$build: function(t) {
        # NB t.token.type must be DELETE, VOID, TYPEOF, NOT, BITWISE_NOT,
        # UNARY_PLUS, UNARY_MINUS, INCREMENT, or DECREMENT.
        if (t.token.type == PLUS)
            t.token.type = UNARY_PLUS;
        else if (t.token.type == MINUS)
            t.token.type = UNARY_MINUS;
        return new Node(t);
    },

    UNARY$addOperand: function(n, n2) {
        n.push(n2);
    },

    UNARY$setPostfix: function(n) {
        n.postfix = true;
    },

    UNARY$finish: function(n) {
    },

    MEMBER$build: function(t, tt) {
        # NB t.token.type must be NEW, DOT, or INDEX.
        return new Node(t, tt);
    },

    MEMBER$rebuildNewWithArgs: function(n) {
        n.type = NEW_WITH_ARGS;
    },

    MEMBER$addOperand: function(n, n2) {
        n.push(n2);
    },

    MEMBER$finish: function(n) {
    },

    PRIMARY$build: function(t, tt) {
        # NB t.token.type must be NULL, THIS, TRUIE, FALSE, IDENTIFIER,
        # NUMBER, STRING, or REGEXP.
        return new Node(t, tt);
    },

    PRIMARY$finish: function(n) {
    },

    ARRAY_INIT$build: function(t) {
        return new Node(t, ARRAY_INIT);
    },

    ARRAY_INIT$addElement: function(n, n2) {
        n.push(n2);
    },

    ARRAY_INIT$finish: function(n) {
    },

    ARRAY_COMP: {
        build: function(t) {
            return new Node(t, ARRAY_COMP);
        },

        setExpression: function(n, e) {
            n.expression = e
        },

        setTail: function(n, n2) {
            n.tail = n2;
        },

        finish: function(n) {
        }
    },

    COMP_TAIL$build: function(t) {
        return new Node(t, COMP_TAIL);
    },

    COMP_TAIL$setGuard: function(n, e) {
        n.guard = e;
    },

    COMP_TAIL$addFor: function(n, n2) {
        n.push(n2);
    },

    COMP_TAIL$finish: function(n) {
    },

    OBJECT_INIT$build: function(t) {
        return new Node(t, OBJECT_INIT);
    },

    OBJECT_INIT$addProperty: function(n, n2) {
        n.push(n2);
    },

    OBJECT_INIT$finish: function(n) {
    },

    PROPERTY_INIT$build: function(t) {
        return new Node(t, PROPERTY_INIT);
    },

    PROPERTY_INIT$addOperand: function(n, n2) {
        n.push(n2);
    },

    PROPERTY_INIT$finish: function(n) {
    },

    COMMA$build: function(t) {
        return new Node(t, COMMA);
    },

    COMMA$addOperand: function(n, n2) {
        n.push(n2);
    },

    COMMA$finish: function(n) {
    },

    LIST$build: function(t) {
        return new Node(t, LIST);
    },

    LIST$addOperand: function(n, n2) {
        n.push(n2);
    },

    LIST$finish: function(n) {
    },

    setHoists: function(id, vds) {
    }
};