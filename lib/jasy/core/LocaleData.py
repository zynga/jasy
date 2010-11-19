#
# Jasy - JavaScript Tooling Refined
# Copyright 2010 Sebastian Werner
#

import logging, os, xml.etree.ElementTree
import jasy.core.Info



def getMain(locale):
    
    return MainParser(locale)
    
    
    
def getSupplemental(locale):
    pass
    
    
    
    
class MainParser():
    def __init__(self, locale):
        cldr = jasy.core.Info.cldr()
        main = os.path.join(cldr, "main")
        
        self.__data = {}

        # Fallback chain
        while True:
            self.__add(os.path.join(main, "%s.xml" % locale))
            
            if "_" in locale:
                locale = locale[:locale.rindex("_")]
            else:
                break
                
                
        print(self.__data["codePatterns"])
        print(self.__data["delimiters"])
        print(self.__data["calendars"])



    def __add(self, path):
        logging.info("Reading %s" % path)
        tree = xml.etree.ElementTree.parse(path)
        
        self.__addDisplayNames(tree, "languages")
        self.__addDisplayNames(tree, "scripts")
        self.__addDisplayNames(tree, "territories")
        self.__addDisplayNames(tree, "variants")
        self.__addDisplayNames(tree, "measurementSystemNames")
        self.__addDisplayNames(tree, "codePatterns")

        self.__addDelimiters(tree)
        
        self.__addCalendars(tree)
        


    def __getStore(self, parent, name):
        if not name in parent:
            store = {}
            parent[name] = store
        else:
            store = parent[name]

        return store
        
        
        
    def __addDisplayNames(self, tree, key):
        store = self.__getStore(self.__data, key)
        for element in tree.findall("/localeDisplayNames/%s/*" % key):
            if not element.get("draft"):
                field = element.get("type")
                if not field in store:
                    store[field] = element.text
                    
                    
    def __addDelimiters(self, tree, key="delimiters"):
        store = self.__getStore(self.__data, key)
        for element in tree.findall("/%s/*" % key):
            if not element.get("draft"):
                field = element.tag
                if not field in store:
                    store[field] = element.text
        
        
    def __addCalendars(self, tree, key="dates/calendars"):
        calendars = self.__getStore(self.__data, "calendars")
            
        for element in tree.findall("/%s/*" % key):
            if not element.get("draft"):
                self.__addCalendar(calendars, element)


    def __addCalendar(self, store, element):
        
        print("ADD Calendar %s" % element.get("type"))
        
        calendar = self.__getStore(store, element.get("type"))

        # Date Formats
        dateFormats = self.__getStore(calendar, "dateFormats")
        for child in element.findall("dateFormats/dateFormatLength"):
            if not child.get("draft"):
                format = child.get("type")
                text = child.find("dateFormat/pattern").text
                dateFormats[format] = text
                
        
        
        
        
