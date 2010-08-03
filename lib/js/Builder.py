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
    IF__build: function(t) {
        return new Node(t, IF);
    },

    IF__setCondition: function(n, e) {
        n.condition = e;
    },

    IF__setThenPart: function(n, s) {
        n.thenPart = s;
    },

    IF__setElsePart: function(n, s) {
        n.elsePart = s;
    },

    IF__finish: function(n) {
    },

    SWITCH__build: function(t) {
        var n = new Node(t, SWITCH);
        n.cases = [];
        n.defaultIndex = -1;
        return n;
    },

    SWITCH__setDiscriminant: function(n, e) {
        n.discriminant = e;
    },

    SWITCH__setDefaultIndex: function(n, i) {
        n.defaultIndex = i;
    },

    SWITCH__addCase: function(n, n2) {
        n.cases.push(n2);
    },

    SWITCH__finish: function(n) {
    },

    CASE__build: function(t) {
        return new Node(t, CASE);
    },

    CASE__setLabel: function(n, e) {
        n.caseLabel = e;
    },

    CASE__initializeStatements: function(n, t) {
        n.statements = new Node(t, BLOCK);
    },

    CASE__addStatement: function(n, s) {
        n.statements.push(s);
    },

    CASE__finish: function(n) {
    },

    DEFAULT__build: function(t, p) {
        return new Node(t, DEFAULT);
    },

    DEFAULT__initializeStatements: function(n, t) {
        n.statements = new Node(t, BLOCK);
    },

    DEFAULT__addStatement: function(n, s) {
        n.statements.push(s);
    },

    DEFAULT__finish: function(n) {
    },

    FOR__build: function(t) {
        var n = new Node(t, FOR);
        n.isLoop = true;
        n.isEach = false;
        return n;
    },

    FOR__rebuildForEach: function(n) {
        n.isEach = true;
    },

    # NB. This function is called after rebuildForEach, if that's called
    # at all.
    FOR__rebuildForIn: function(n) {
        n.type = FOR_IN;
    },

    FOR__setCondition: function(n, e) {
        n.condition = e;
    },

    FOR__setSetup: function(n, e) {
        n.setup = e || null;
    },

    FOR__setUpdate: function(n, e) {
        n.update = e;
    },

    FOR__setObject: function(n, e) {
        n.object = e;
    },

    FOR__setIterator: function(n, e, e2) {
        n.iterator = e;
        n.varDecl = e2;
    },

    FOR__setBody: function(n, s) {
        n.body = s;
    },

    FOR__finish: function(n) {
    },

    WHILE__build: function(t) {
        var n = new Node(t, WHILE);
        n.isLoop = true;
        return n;
    },

    WHILE__setCondition: function(n, e) {
        n.condition = e;
    },

    WHILE__setBody: function(n, s) {
        n.body = s;
    },

    WHILE__finish: function(n) {
    },

    DO__build: function(t) {
        var n = new Node(t, DO);
        n.isLoop = true;
        return n;
    },

    DO__setCondition: function(n, e) {
        n.condition = e;
    },

    DO__setBody: function(n, s) {
        n.body = s;
    },

    DO__finish: function(n) {
    },

    BREAK__build: function(t) {
        return new Node(t, BREAK);
    },

    BREAK__setLabel: function(n, v) {
        n.label = v;
    },

    BREAK__setTarget: function(n, n2) {
        n.target = n2;
    },

    BREAK__finish: function(n) {
    },

    CONTINUE__build: function(t) {
        return new Node(t, CONTINUE);
    },

    CONTINUE__setLabel: function(n, v) {
        n.label = v;
    },

    CONTINUE__setTarget: function(n, n2) {
        n.target = n2;
    },

    CONTINUE__finish: function(n) {
    },

    TRY__build: function(t) {
        var n = new Node(t, TRY);
        n.catchClauses = [];
        return n;
    },

    TRY__setTryBlock: function(n, s) {
        n.tryBlock = s;
    },

    TRY__addCatch: function(n, n2) {
        n.catchClauses.push(n2);
    },

    TRY__finishCatches: function(n) {
    },

    TRY__setFinallyBlock: function(n, s) {
        n.finallyBlock = s;
    },

    TRY__finish: function(n) {
    },

    CATCH__build: function(t) {
        var n = new Node(t, CATCH);
        n.guard = null;
        return n;
    },

    CATCH__setVarName: function(n, v) {
        n.varName = v;
    },

    CATCH__setGuard: function(n, e) {
        n.guard = e;
    },

    CATCH__setBlock: function(n, s) {
        n.block = s;
    },

    CATCH__finish: function(n) {
    },

    THROW__build: function(t) {
        return new Node(t, THROW);
    },

    THROW__setException: function(n, e) {
        n.exception = e;
    },

    THROW__finish: function(n) {
    },

    RETURN__build: function(t) {
        return new Node(t, RETURN);
    },

    RETURN__setValue: function(n, e) {
        n.value = e;
    },

    RETURN__finish: function(n) {
    },

    YIELD__build: function(t) {
        return new Node(t, YIELD);
    },

    YIELD__setValue: function(n, e) {
        n.value = e;
    },

    YIELD__finish: function(n) {
    },

    GENERATOR__build: function(t) {
        return new Node(t, GENERATOR);
    },

    GENERATOR__setExpression: function(n, e) {
        n.expression = e;
    },

    GENERATOR__setTail: function(n, n2) {
        n.tail = n2;
    },

    GENERATOR__finish: function(n) {
    },

    WITH__build: function(t) {
        return new Node(t, WITH);
    },

    WITH__setObject: function(n, e) {
        n.object = e;
    },

    WITH__setBody: function(n, s) {
        n.body = s;
    },

    WITH__finish: function(n) {
    },

    DEBUGGER__build: function(t) {
        return new Node(t, DEBUGGER);
    },

    SEMICOLON__build: function(t) {
        return new Node(t, SEMICOLON);
    },

    SEMICOLON__setExpression: function(n, e) {
        n.expression = e;
    },

    SEMICOLON__finish: function(n) {
    },

    LABEL__build: function(t) {
        return new Node(t, LABEL);
    },

    LABEL__setLabel: function(n, e) {
        n.label = e;
    },

    LABEL__setStatement: function(n, s) {
        n.statement = s;
    },

    LABEL__finish: function(n) {
    },

    FUNCTION__build: function(t) {
        var n = new Node(t);
        if (n.type != FUNCTION)
            n.type = (n.value == "get") ? GETTER : SETTER;
        n.params = [];
        return n;
    },

    FUNCTION__setName: function(n, v) {
        n.name = v;
    },

    FUNCTION__addParam: function(n, v) {
        n.params.push(v);
    },

    FUNCTION__setBody: function(n, s) {
        n.body = s;
    },

    FUNCTION__hoistVars: function(x) {
    },

    FUNCTION__finish: function(n, x) {
    },

    VAR__build: function(t) {
        return new Node(t, VAR);
    },

    VAR__addDecl: function(n, n2, x) {
        n.push(n2);
    },

    VAR__finish: function(n) {
    },

    CONST__build: function(t) {
        return new Node(t, VAR);
    },

    CONST__addDecl: function(n, n2, x) {
        n.push(n2);
    },

    CONST__finish: function(n) {
    },

    LET__build: function(t) {
        return new Node(t, LET);
    },

    LET__addDecl: function(n, n2, x) {
        n.push(n2);
    },

    LET__finish: function(n) {
    },

    DECL__build: function(t) {
        return new Node(t, IDENTIFIER);
    },

    DECL__setName: function(n, v) {
        n.name = v;
    },

    DECL__setInitializer: function(n, e) {
        n.initializer = e;
    },

    DECL__setReadOnly: function(n, b) {
        n.readOnly = b;
    },

    DECL__finish: function(n) {
    },

    LET_BLOCK__build: function(t) {
        var n = Node(t, LET_BLOCK);
        n.varDecls = [];
        return n;
    },

    LET_BLOCK__setVariables: function(n, n2) {
        n.variables = n2;
    },

    LET_BLOCK__setExpression: function(n, e) {
        n.expression = e;
    },

    LET_BLOCK__setBlock: function(n, s) {
        n.block = s;
    },

    LET_BLOCK__finish: function(n) {
    },

    BLOCK__build: function(t, id) {
        var n = new Node(t, BLOCK);
        n.varDecls = [];
        n.id = id;
        return n;
    },

    BLOCK__hoistLets: function(n) {
    },

    BLOCK__addStatement: function(n, n2) {
        n.push(n2);
    },

    BLOCK__finish: function(n) {
    },

    EXPRESSION__build: function(t, tt) {
        return new Node(t, tt);
    },

    EXPRESSION__addOperand: function(n, n2) {
        n.push(n2);
    },

    EXPRESSION__finish: function(n) {
    },

    ASSIGN__build: function(t) {
        return new Node(t, ASSIGN);
    },

    ASSIGN__addOperand: function(n, n2) {
        n.push(n2);
    },

    ASSIGN__setAssignOp: function(n, o) {
        n.assignOp = o;
    },

    ASSIGN__finish: function(n) {
    },

    HOOK__build: function(t) {
        return new Node(t, HOOK);
    },

    HOOK__setCondition: function(n, e) {
        n[0] = e;
    },

    HOOK__setThenPart: function(n, n2) {
        n[1] = n2;
    },

    HOOK__setElsePart: function(n, n2) {
        n[2] = n2;
    },

    HOOK__finish: function(n) {
    },

    OR__build: function(t) {
        return new Node(t, OR);
    },

    OR__addOperand: function(n, n2) {
        n.push(n2);
    },

    OR__finish: function(n) {
    },

    AND__build: function(t) {
        return new Node(t, AND);
    },

    AND__addOperand: function(n, n2) {
        n.push(n2);
    },

    AND__finish: function(n) {
    },

    BITWISE_OR__build: function(t) {
        return new Node(t, BITWISE_OR);
    },

    BITWISE_OR__addOperand: function(n, n2) {
        n.push(n2);
    },

    BITWISE_OR__finish: function(n) {
    },

    BITWISE_XOR__build: function(t) {
        return new Node(t, BITWISE_XOR);
    },

    BITWISE_XOR__addOperand: function(n, n2) {
        n.push(n2);
    },

    BITWISE_XOR__finish: function(n) {
    },

    BITWISE_AND__build: function(t) {
        return new Node(t, BITWISE_AND);
    },

    BITWISE_AND__addOperand: function(n, n2) {
        n.push(n2);
    },

    BITWISE_AND__finish: function(n) {
    },

    EQUALITY__build: function(t) {
        # NB t.token.type must be EQ, NE, STRICT_EQ, or STRICT_NE.
        return new Node(t);
    },

    EQUALITY__addOperand: function(n, n2) {
        n.push(n2);
    },

    EQUALITY__finish: function(n) {
    },

    RELATIONAL__build: function(t) {
        # NB t.token.type must be LT, LE, GE, or GT.
        return new Node(t);
    },

    RELATIONAL__addOperand: function(n, n2) {
        n.push(n2);
    },

    RELATIONAL__finish: function(n) {
    },

    SHIFT__build: function(t) {
        # NB t.token.type must be LSH, RSH, or URSH.
        return new Node(t);
    },

    SHIFT__addOperand: function(n, n2) {
        n.push(n2);
    },

    SHIFT__finish: function(n) {
    },

    ADD__build: function(t) {
        # NB t.token.type must be PLUS or MINUS.
        return new Node(t);
    },

    ADD__addOperand: function(n, n2) {
        n.push(n2);
    },

    ADD__finish: function(n) {
    },

    MULTIPLY__build: function(t) {
        # NB t.token.type must be MUL, DIV, or MOD.
        return new Node(t);
    },

    MULTIPLY__addOperand: function(n, n2) {
        n.push(n2);
    },

    MULTIPLY__finish: function(n) {
    },

    UNARY__build: function(t) {
        # NB t.token.type must be DELETE, VOID, TYPEOF, NOT, BITWISE_NOT,
        # UNARY_PLUS, UNARY_MINUS, INCREMENT, or DECREMENT.
        if (t.token.type == PLUS)
            t.token.type = UNARY_PLUS;
        else if (t.token.type == MINUS)
            t.token.type = UNARY_MINUS;
        return new Node(t);
    },

    UNARY__addOperand: function(n, n2) {
        n.push(n2);
    },

    UNARY__setPostfix: function(n) {
        n.postfix = true;
    },

    UNARY__finish: function(n) {
    },

    MEMBER__build: function(t, tt) {
        # NB t.token.type must be NEW, DOT, or INDEX.
        return new Node(t, tt);
    },

    MEMBER__rebuildNewWithArgs: function(n) {
        n.type = NEW_WITH_ARGS;
    },

    MEMBER__addOperand: function(n, n2) {
        n.push(n2);
    },

    MEMBER__finish: function(n) {
    },

    PRIMARY__build: function(t, tt) {
        # NB t.token.type must be NULL, THIS, TRUIE, FALSE, IDENTIFIER,
        # NUMBER, STRING, or REGEXP.
        return new Node(t, tt);
    },

    PRIMARY__finish: function(n) {
    },

    ARRAY_INIT__build: function(t) {
        return new Node(t, ARRAY_INIT);
    },

    ARRAY_INIT__addElement: function(n, n2) {
        n.push(n2);
    },

    ARRAY_INIT__finish: function(n) {
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

    COMP_TAIL__build: function(t) {
        return new Node(t, COMP_TAIL);
    },

    COMP_TAIL__setGuard: function(n, e) {
        n.guard = e;
    },

    COMP_TAIL__addFor: function(n, n2) {
        n.push(n2);
    },

    COMP_TAIL__finish: function(n) {
    },

    OBJECT_INIT__build: function(t) {
        return new Node(t, OBJECT_INIT);
    },

    OBJECT_INIT__addProperty: function(n, n2) {
        n.push(n2);
    },

    OBJECT_INIT__finish: function(n) {
    },

    PROPERTY_INIT__build: function(t) {
        return new Node(t, PROPERTY_INIT);
    },

    PROPERTY_INIT__addOperand: function(n, n2) {
        n.push(n2);
    },

    PROPERTY_INIT__finish: function(n) {
    },

    COMMA__build: function(t) {
        return new Node(t, COMMA);
    },

    COMMA__addOperand: function(n, n2) {
        n.push(n2);
    },

    COMMA__finish: function(n) {
    },

    LIST__build: function(t) {
        return new Node(t, LIST);
    },

    LIST__addOperand: function(n, n2) {
        n.push(n2);
    },

    LIST__finish: function(n) {
    },

    setHoists: function(id, vds) {
    }
};