#
# Jasy - JavaScript Tooling Refined
# Copyright 2010 Sebastian Werner
#

import logging, os, json, xml.etree.ElementTree
import jasy.core.Info



def getMain(locale):
    print("-- EN")
    MainParser("en_US")
    print("-- DE")
    MainParser("de_DE")
    
    
    
def getSupplemental(locale):
    pass
    
    
    
    
class MainParser():
    def __init__(self, locale):
        cldr = jasy.core.Info.cldr()
        main = os.path.join(cldr, "main")
        
        self.__data = {}

        # Fallback chain
        while True:
            path = "%s.xml" % os.path.join(main, locale)

            logging.info("Reading %s" % path)
            tree = xml.etree.ElementTree.parse(path)

            self.__addDisplayNames(tree)
            self.__addDelimiters(tree)
            self.__addCalendars(tree)
            self.__addNumbers(tree)            
            
            if "_" in locale:
                locale = locale[:locale.rindex("_")]
            else:
                break
                
                
        print(json.dumps(self.__data, sort_keys=True, indent=2))


    def __getStore(self, parent, name):
        """ Manages data fields """
        
        if not name in parent:
            store = {}
            parent[name] = store
        else:
            store = parent[name]

        return store
        
        
    def __addDisplayNames(self, tree):
        """ Adds CLDR display names section """
        
        display = self.__getStore(self.__data, "display")
        
        for key in ["languages", "scripts", "territories", "variants", "measurementSystemNames"]:
            # make it a little bit shorter, there is not really any conflict potential
            if key == "measurementSystemNames":
                store = self.__getStore(display, "measurement")
            else:
                store = self.__getStore(display, key)
                
            for element in tree.findall("/localeDisplayNames/%s/*" % key):
                if not element.get("draft"):
                    field = element.get("type")
                    if not field in store:
                        store[field] = element.text
                    
                    
    def __addDelimiters(self, tree):
        """ Adds CLDR delimiters """
        
        delimiters = self.__getStore(self.__data, "delimiters")
        
        for element in tree.findall("/delimiters/*"):
            if not element.get("draft"):
                field = element.tag
                if not field in delimiters:
                    delimiters[field] = element.text
        
        
    def __addCalendars(self, tree, key="dates/calendars"):
        """ Loops through all CLDR calendars and adds them """
        
        calendars = self.__getStore(self.__data, "calendars")
            
        for element in tree.findall("/%s/*" % key):
            if not element.get("draft"):
                self.__addCalendar(calendars, element)


    def __addCalendar(self, store, element):
        calendar = self.__getStore(store, element.get("type"))

        # Months Widths
        monthsWidths = self.__getStore(calendar, "months")
        for child in element.findall("months/monthContext/monthWidth"):
            if not child.get("draft"):
                format = child.get("type")
                if not format in monthsWidths:
                    monthsWidths[format] = {}
                
                for month in child.findall("month"):
                    if not month.get("draft"):
                        name = month.get("type")
                        if not name in monthsWidths[format]:
                            monthsWidths[format][name] = month.text


        # Day Widths
        dayWidths = self.__getStore(calendar, "days")
        for child in element.findall("days/dayContext/dayWidth"):
            if not child.get("draft"):
                format = child.get("type")
                if not format in dayWidths:
                    dayWidths[format] = {}

                for day in child.findall("day"):
                    if not day.get("draft"):
                        name = day.get("type")
                        if not name in dayWidths[format]:
                            dayWidths[format][name] = day.text


        # Quarter Widths
        quarterWidths = self.__getStore(calendar, "quarters")
        for child in element.findall("quarters/quarterContext/quarterWidth"):
            if not child.get("draft"):
                format = child.get("type")
                if not format in quarterWidths:
                    quarterWidths[format] = {}

                for quarter in child.findall("quarter"):
                    if not quarter.get("draft"):
                        name = quarter.get("type")
                        if not name in quarterWidths[format]:
                            quarterWidths[format][name] = quarter.text
                        
                        
        # Date Formats
        dateFormats = self.__getStore(calendar, "dateFormats")
        for child in element.findall("dateFormats/dateFormatLength"):
            if not child.get("draft"):
                format = child.get("type")
                text = child.find("dateFormat/pattern").text
                if not format in dateFormats:
                    dateFormats[format] = text


        # Time Formats
        timeFormats = self.__getStore(calendar, "timeFormats")
        for child in element.findall("timeFormats/timeFormatLength"):
            if not child.get("draft"):
                format = child.get("type")
                text = child.find("timeFormat/pattern").text
                if not format in timeFormats:
                    timeFormats[format] = text
        
        
        # Fields
        fields = self.__getStore(calendar, "fields")
        for child in element.findall("fields/field"):
            if not child.get("draft"):
                format = child.get("type")
                for nameChild in child.findall("displayName"):
                    if not nameChild.get("draft"):
                        text = nameChild.text
                        if not format in fields:
                            fields[format] = text
                        break
                        
                        
        # Relative
        relative = self.__getStore(calendar, "relative")
        for child in element.findall("fields/field"):
            if not child.get("draft"):
                format = child.get("type")
                relativeField = self.__getStore(relative, format)
                for relChild in child.findall("relative"):
                    if not relChild.get("draft"):
                        pos = relChild.get("type")
                        text = relChild.text
                        if not pos in relativeField:
                            relativeField[pos] = text
                        
                        
    def __addNumbers(self, tree):
        store = self.__getStore(self.__data, "numbers")
                        
        # Symbols
        symbols = self.__getStore(store, "symbols")
        for element in tree.findall("numbers/symbols/*"):
            if not element.get("draft"):
                field = element.tag
                if not field in store:
                    symbols[field] = element.text

        # Formats
        if not "format" in store:
            store["format"] = {}
                    
        for format in ["decimal", "scientific", "percent", "currency"]:
            if not format in store["format"]:
                for element in tree.findall("numbers//%sFormat/pattern" % format):
                    store["format"][format] = element.text
            
        # Currencies
        currencies = self.__getStore(store, "currencies")
        for child in tree.findall("numbers/currencies/currency"):
            if not child.get("draft"):
                short = child.get("type")
                for nameChild in child.findall("displayName"):
                    if not nameChild.get("draft"):
                        text = nameChild.text
                        if not format in currencies:
                            currencies[short] = text
                        break
                