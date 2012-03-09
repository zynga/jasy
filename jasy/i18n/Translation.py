#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

import logging, re, copy, json

try:
    import polib
    hasPoLib = True
except ImportError:
    hasPoLib = False

from jasy.js.parse.Node import Node

__all__ = ["TranslationError", "Translation", "hasText"]


def hasText(node):
    if node.type == "call":
        funcName = None
        
        if node[0].type == "identifier":
            funcName = node[0].value
        elif node[0].type == "dot" and node[0][1].type == "identifier":
            funcName = node[0][1].value
        
        if funcName in ("tr", "trc", "trn"):
            return True
            
    # Process children
    for child in node:
        if child != None:
            ret = hasText(child)
            if ret:
                return True
    
    return False


class TranslationError(Exception):
    pass


class Translation:
    def __init__(self, locale, files=None, table=None):
        self.__locale = locale

        logging.debug("Initialize translation: %s" % locale)
        self.__table = {}

        if table:
            self.__table.update(table)
        
        if files:
            logging.debug("Load %s translation files..." % len(files))
            for path in files:
                if hasPoLib:
                    pofile = polib.pofile(path)
                    # print("Process: %s" % path)
                    for entry in pofile:
                        if not entry.msgid in self.__table:
                            if entry.msgstr != "":
                                self.__table[entry.msgid] = entry.msgstr
                            elif entry.msgstr_plural:
                                self.__table[entry.msgid] = entry.msgstr_plural
                        
        logging.debug("Translation of %s entries ready" % len(self.__table))
        
        
        
    #
    # Public API
    #

    def generate(self):
        return "this.$$translation=%s;" % json.dumps(self.__generate({}), separators=(',',':'), ensure_ascii=False)

    def patch(self, node):
        self.__recurser(node)
        
    def load(self, pofile):
        pass
        # TODO
        
        
    def __str__(self):
        return "Translation(%s)" % self.__locale
    


    #
    # Generate :: Implementation
    #
    
    def __generate(self, data):
        for msgid in self.__table:
            data[msgid] = self.__table[msgid]
            
        return data



    #
    # Patch :: Implementation
    #
    

    __replacer = re.compile("(%[0-9])")
    

    def __rebuildAsSplitted(self, value, mapper):
        """ The real splitter engine. Creates plus Node instances and cascade them automatically """
        
        result = []
        splits = self.__replacer.split(value)
        if len(splits) == 1:
            return None
        
        pair = Node(None, "plus")

        for entry in splits:
            if entry == "":
                continue
                
            if len(pair) == 2:
                newPair = Node(None, "plus")
                newPair.append(pair)
                pair = newPair

            if self.__replacer.match(entry):
                pos = int(entry[1]) - 1
                
                # Items might be added multiple times. Copy to protect original.
                try:
                    repl = mapper[pos]
                except KeyError:
                    raise TranslationError("Invalid positional value: %s in %s" % (entry, value))
                
                copied = copy.deepcopy(mapper[pos])
                if copied.type not in ("identifier", "call"):
                    copied.parenthesized = True
                pair.append(copied)
                
            else:
                child = Node(None, "string")
                child.value = entry
                pair.append(child)
                
        return pair

    
    def __splitTemplate(self, replaceNode, patchParam, valueParams):
        """ Split string into plus-expression(s) """
        
        mapper = { pos: value for pos, value in enumerate(valueParams) }
        
        try:
            pair = self.__rebuildAsSplitted(patchParam.value, mapper)
        except TranslationError as ex:
            raise TranslationError("Invalid translation usage in line %s. %s" % (replaceNode.line, ex))
            
        if pair:
            replaceNode.parent.replace(replaceNode, pair)
    
    
    def __recurser(self, node):

        # Process children
        for child in list(node):
            if child != None:
                self.__recurser(child)
                        
        
        if node.type == "call":
            funcName = None
            
            if node[0].type == "identifier":
                funcName = node[0].value
            elif node[0].type == "dot" and node[0][1].type == "identifier":
                funcName = node[0][1].value
            
            if funcName in ("tr", "trc", "trn", "marktr"):
                params = node[1]
                table = self.__table
                
                # Remove marktr() calls
                if funcName == "marktr":
                    node.parent.remove(node)

                # Verify param types
                elif params[0].type is not "string":
                    # maybe something marktr() relevant being used, in this case we need to keep the call and inline the data
                    pass
                    
                # Error handling
                elif (funcName == "trn" or funcName == "trc") and params[1].type != "string":
                    logging.warn("Expecting translation string to be type string: %s at line %s" % (params[1].type, params[1].line))

                # Signature tr(msg, arg1, arg2, ...)
                elif funcName == "tr":
                    key = params[0].value
                    if key in table:
                        params[0].value = table[key]
                        
                    if len(params) == 1:
                        node.parent.replace(node, params[0])
                    else:
                        self.__splitTemplate(node, params[0], params[1:])
                        
                        
                # Signature trc(hint, msg, arg1, arg2, ...)
                elif funcName == "trc":
                    key = params[0].value
                    if key in table:
                        params[1].value = table[key]

                    if len(params) == 2:
                        node.parent.replace(node, params[1])
                    else:
                        self.__splitTemplate(node, params[1], params[2:])
                        
                        
                # Signature trn(msg, msg2, [...], int, arg1, arg2, ...)
                elif funcName == "trn":
                    keySingular = params[0].value
                    if keySingular in table:
                        params[0].value = table[keySingular]

                    keyPlural = params[1].value
                    if keyPlural in table:
                        params[1].value = table[keyPlural]
                        
                    # TODO: Multi plural support
                    
                    # Patch strings with dynamic values
                    if len(params) >= 3:
                        self.__splitTemplate(params[0], params[0], params[3:])
                        self.__splitTemplate(params[1], params[1], params[3:])
                    
                    
                    # Replace the whole call with: int < 2 ? singularMessage : pluralMessage
                    hook = Node(None, "hook")
                    hook.parenthesized = True
                    condition = Node(None, "le")
                    condition.append(params[2])
                    number = Node(None, "number")
                    number.value = 1
                    condition.append(number)
                    
                    hook.append(condition, "condition")
                    hook.append(params[1], "elsePart")
                    hook.append(params[0], "thenPart")
                    
                    node.parent.replace(node, hook)


                