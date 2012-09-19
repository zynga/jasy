#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

import re, copy, polib

import jasy.js.parse.Node as Node
import jasy.item.Translation as Translation

from jasy import UserError
import jasy.core.Console as Console


#
# Public API
#

__all__ = ["hasText", "optimize", "collectTranslations"]

translationFunctions = ("tr", "trc", "trn", "marktr")


def hasText(node):
    if node.type == "call":
        funcName = None
        
        if node[0].type == "identifier":
            funcName = node[0].value
        elif node[0].type == "dot" and node[0][1].type == "identifier":
            funcName = node[0][1].value
        
        if funcName in translationFunctions:
            return True
            
    # Process children
    for child in node:
        if child != None:
            ret = hasText(child)
            if ret:
                return True
    
    return False


def parseParams(params, funcName):

    basic = None
    plural = None
    context = None

    if funcName == "tr" or funcName == "trn" or funcName == "marktr":
        basic = params[0].value
    elif funcName == "trc":
        context = params[0].value
        basic = params[1].value
    
    if funcName == "trn":
        plural = params[1].value

    return basic, plural, context



def __collectionRecurser(node, collection):
    if node.type == "call":
        funcName = None
        
        if node[0].type == "identifier":
            funcName = node[0].value
        elif node[0].type == "dot" and node[0][1].type == "identifier":
            funcName = node[0][1].value
        
        if funcName in translationFunctions:
            translationId = Translation.generateId(*parseParams(node[1], funcName))
            if translationId:
                if translationId in collection:
                    collection[translationId].append(node.line)
                else:
                    collection[translationId] = [node.line]

    # Process children
    for child in node:
        if child != None:
            __collectionRecurser(child, collection)

    return collection


def collectTranslations(node):
    return __collectionRecurser(node, dict())



def optimize(node, translation):
  return __recurser(node, translation.getTable())
  


#
# Patch :: Implementation
#


__replacer = re.compile("(%[0-9])")


def __splitTemplate(value, valueParams):
    """ 
    Split string into plus-expression(s) 

    - patchParam: string node containing the placeholders
    - valueParams: list of params to inject
    """

    # Convert list with nodes into Python dict
    # [a, b, c] => {0:a, 1:b, 2:c}
    mapper = { pos: value for pos, value in enumerate(valueParams) }
    
    result = []
    splits = __replacer.split(value)
    if len(splits) == 1:
        return None
    
    pair = Node.Node(None, "plus")

    for entry in splits:
        if entry == "":
            continue
            
        if len(pair) == 2:
            newPair = Node.Node(None, "plus")
            newPair.append(pair)
            pair = newPair

        if __replacer.match(entry):
            pos = int(entry[1]) - 1
            
            # Items might be added multiple times. Copy to protect original.
            try:
                repl = mapper[pos]
            except KeyError:
                raise UserError("Invalid positional value: %s in %s" % (entry, value))
            
            copied = copy.deepcopy(mapper[pos])
            if copied.type not in ("identifier", "call"):
                copied.parenthesized = True
            pair.append(copied)
            
        else:
            child = Node.Node(None, "string")
            child.value = entry
            pair.append(child)
            
    return pair


def __recurser(node, table):

    counter = 0

    # Process children
    for child in list(node):
        if child is not None:
            counter += __recurser(child, table)
                    
    # Process all method calls
    if node.type == "call":
        funcName = None
        funcNameNode = None
        
        # Uses global translation method (not typical)
        if node[0].type == "identifier":
            funcNameNode = node[0]

        # Uses namespaced translation method.
        # Typically core.locale.Translation.tr() or Translation.tr()
        elif node[0].type == "dot" and node[0][1].type == "identifier":
            funcNameNode = node[0][1]

        # Gettext methods only at the moment
        funcName = funcNameNode and funcNameNode.value
        if funcName in translationFunctions:
            Console.debug("Found translation method %s in %s", funcName, node.line)
            Console.indent()

            params = node[1]
            
            # Remove marktr() calls
            if funcName == "marktr":
                node.parent.remove(node)

            # Verify param types
            elif params[0].type is not "string":
                # maybe something marktr() relevant being used, in this case we need to keep the call and inline the data
                pass
                
            # Error handling
            elif (funcName == "trn" or funcName == "trc") and params[1].type != "string":
                Console.warn("Expecting translation string to be type string: %s at line %s" % (params[1].type, params[1].line))

            # Signature tr(msg, arg1, ...)
            elif funcName == "tr":
                key = params[0].value
                if key in table:
                    params[0].value = table[key]
                
                counter += 1

                if len(params) == 1:
                    node.parent.replace(node, params[0])
                else:
                    replacement = __splitTemplate(params[0].value, params[1:])
                    if replacement:
                        node.parent.replace(node, replacement)

                    
            # Signature trc(context, msg, arg1, ...)
            elif funcName == "trc":
                key = "%s[C:%s]" % (params[1].value, params[0].value)
                if key in table:
                    params[1].value = table[key]

                counter += 1

                if len(params) == 2:
                    node.parent.replace(node, params[1])
                else:
                    replacement = __splitTemplate(params[1].value, params[2:])
                    if replacement:
                        node.parent.replace(node, replacement)


            # Signature trn(msgSingular, msgPlural, int, arg1, ...)
            elif funcName == "trn":
                key = "%s[N:%s]" % (params[0].value, params[1].value)
                if not key in table:
                    Console.outdent()
                    return counter

                counter += 1

                # Use optimized trnc() method instead of trn()
                funcNameNode.value = "trnc"
                
                # Remove first two string parameters
                params.remove(params[0])
                params.remove(params[0])

                # Inject new object into params
                container = Node.Node(None, "object_init")
                params.insert(0, container)

                # Create new construction with all properties generated from the translation table
                for plural in table[key]:
                    pluralEntry = Node.Node(None, "property_init")
                    pluralEntryIdentifier = Node.Node(None, "identifier")
                    pluralEntryIdentifier.value = plural
                    pluralEntryValue = Node.Node(None, "string")
                    pluralEntryValue.value = table[key][plural]
                    pluralEntry.append(pluralEntryIdentifier)
                    pluralEntry.append(pluralEntryValue)
                    container.append(pluralEntry)

                # Replace strings with plus operations to omit complex client side string operation
                if len(params) > 2:
                    for pluralEntry in container:
                        replacement = __splitTemplate(pluralEntry[1].value, params[2:])
                        if replacement:
                            pluralEntry.replace(pluralEntry[1], replacement)

                    # When all variables have been patched in all string with placeholder
                    # we are able to remove the whole list of placeholder values afterwards
                    while len(params) > 2:
                        params.pop()

            Console.outdent()

    return counter
