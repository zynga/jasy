from jasy.js.tokenize.Tokenizer import Tokenizer
from jasy.js.parse.Parser import parseExpression
from jasy.js.util import *


__all__ = ["patch"]


def __translateToJS(code):
    """ Returns the code equivalent of the stored value for the given key """
    
    if code is None:
        pass
    elif code is True:
        code = "true"
    elif code is False:
        code = "false"
    elif type(code) is str and code.startswith("{") and code.endswith("}"):
        pass
    elif type(code) is str and code.startswith("[") and code.endswith("]"):
        pass
    else:
        code = "\"%s\"" % code
        
    return code
    

def patch(node, permutation):
    """ Replaces all occourences with incoming values """

    modified = False
    
    if node.type == "dot" and node.parent.type == "call":
        assembled = assembleDot(node)
        
        # core.Env.getValue(key)
        if assembled == "core.Env.getValue" and node.parent.type == "call":
            callNode = node.parent
            params = callNode[1]
            replacement = __translateToJS(permutation.get(params[0].value))
            if replacement:
                replacementNode = parseExpression(replacement)
                callNode.parent.replace(callNode, replacementNode)
                modified = True            
        
        # core.Env.isSet(key, expected)
        # also supports boolean like: core.Env.isSet(key)
        elif assembled == "core.Env.isSet" and node.parent.type == "call":
            callNode = node.parent
            params = callNode[1]
            name = params[0].value
            replacement = __translateToJS(permutation.get(name))
            
            if replacement != None:
                # Auto-fill second parameter with boolean "true"
                expected = params[1] if len(params) > 1 else parseExpression("true")

                if expected.type in ("string", "number", "true", "false"):
                    parsedReplacement = parseExpression(replacement)
                    expectedValue = getattr(expected, "value", None)
                    
                    if expectedValue is not None:
                        if getattr(parsedReplacement, "value", None) is not None:
                            replacementResult = parsedReplacement.value in str(expected.value).split("|")
                        else:
                            replacementResult = parsedReplacement.type in str(expected.value).split("|")
                    else:
                        replacementResult = parsedReplacement.type == expected.type

                    # Do actual replacement
                    replacementNode = parseExpression("true" if replacementResult else "false")
                    callNode.parent.replace(callNode, replacementNode)
                    modified = True
        
        # core.Env.select(key, map)
        elif assembled == "core.Env.select" and node.parent.type == "call":
            callNode = node.parent
            params = callNode[1]
            replacement = __translateToJS(permutation.get(params[0].value))
            if replacement:
                parsedReplacement = parseExpression(replacement)
                if parsedReplacement.type != "string":
                    raise Exception("core.Env.select requires that the given replacement is of type string.")

                # Directly try to find matching identifier in second param (map)
                objectInit = params[1]
                if objectInit.type == "object_init":
                    fallbackNode = None
                    for propertyInit in objectInit:
                        if propertyInit[0].value == "default":
                            fallbackNode = propertyInit[1]

                        elif parsedReplacement.value in str(propertyInit[0].value).split("|"):
                            callNode.parent.replace(callNode, propertyInit[1])
                            modified = True
                            break

                    if not modified and fallbackNode is not None:
                        callNode.parent.replace(callNode, fallbackNode)
                        modified = True


    # Process children
    for child in reversed(node):
        if child != None:
            if patch(child, permutation):
                modified = True

    return modified