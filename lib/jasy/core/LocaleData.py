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
        
        # print(self.__data["calendars"]["gregorian"]["months"]["wide"]["11"])



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
        calendar = self.__getStore(store, element.get("type"))

        # Date Formats
        dateFormats = self.__getStore(calendar, "formats")
        for child in element.findall("dateFormats/dateFormatLength"):
            if not child.get("draft"):
                format = child.get("type")
                text = child.find("dateFormat/pattern").text
                if not format in dateFormats:
                    dateFormats[format] = text


        # Months Widths
        monthsWidths = self.__getStore(calendar, "months")
        for child in element.findall("months/monthContext/monthWidth"):
            if not child.get("draft"):
                format = child.get("type")
                if not format in monthsWidths:
                    monthsWidths[format] = {}
                
                for month in child.findall("month"):
                    if not month.get("draft"):
                        monthsWidths[format][month.get("type")] = month.text


        # Day Widths
        dayWidths = self.__getStore(calendar, "days")
        for child in element.findall("days/dayContext/dayWidth"):
            if not child.get("draft"):
                format = child.get("type")
                if not format in dayWidths:
                    dayWidths[format] = {}

                for day in child.findall("day"):
                    if not day.get("draft"):
                        dayWidths[format][day.get("type")] = day.text


        # Quarter Widths
        quarterWidths = self.__getStore(calendar, "quarters")
        for child in element.findall("quarters/quarterContext/quarterWidth"):
            if not child.get("draft"):
                format = child.get("type")
                if not format in quarterWidths:
                    quarterWidths[format] = {}

                for quarter in child.findall("quarter"):
                    if not quarter.get("draft"):
                        quarterWidths[format][quarter.get("type")] = quarter.text