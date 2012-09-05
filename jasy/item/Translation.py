#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

import polib

from jasy.item.Item import Item
from jasy.core.Logging import *


__all__ = ["getFormat", "generateId", "Translation"]


def getFormat(path):
    """
    Returns the file format of the translation. One of: gettext, xlf, properties and txt
    """

    if path:
        if path.endswith(".po"):
            return "gettext"
        elif path.endswith(".xlf"):
            return "xlf"
        elif path.endswith(".properties"):
            return "property"
        elif path.endswith(".txt"):
            return "txt"

    return None


def generateId(basic, plural=None, context=None):
    """
    Returns a unique message ID based on info typically stored in the code: id, plural, context
    """

    result = basic

    if context is not None:
        result += "[C:%s]" % context
    elif plural is not "":
        result += "[N:%s]" % plural

    return result


class Translation(Item):
    """
    Internal instances mapping a translation file in different formats
    with a conventient API.
    """

    def __add__(self, other):
        self.table.update(other.getTable())
        return self


    def __init__(self, project, id=None, table=None):
        self.id = id
        self.project = project
        self.table = table or {}

        # Extract language from file ID
        # Thinking of that all files are named like de.po, de.txt, de.properties, etc.
        lang = self.id
        if "." in lang:
            lang = lang[lang.rfind(".")+1:]

        self.language = lang


    def attach(self, path):
        # Call Item's attach method first
        super().attach(path)

        # Flat data strucuture where the keys are unique
        table = {}
        path = self.getPath()
        format = self.getFormat()

        # Decide infrastructure/parser to use based on file name
        if format is "gettext":
            po = polib.pofile(path)
            info("Translated messages: %s=%s%%", self.language, po.percent_translated())

            for entry in po.translated_entries():
                entryId = generateId(entry.msgid, entry.msgid_plural, entry.msgctxt)
                if not entryId in table:
                    if entry.msgstr != "":
                        table[entryId] = entry.msgstr
                    elif entry.msgstr_plural:
                        # This field contains all different plural cases (type=dict)
                        table[entryId] = entry.msgstr_plural

        elif format is "xlf":
            raise JasyError("Parsing ICU/XLF files is currently not supported!")

        elif format is "properties":
            raise JasyError("Parsing ICU/Property files is currently not supported!")

        elif format is "txt":
            raise JasyError("Parsing ICU/text files is currently not supported!")
                        
        info("Translation of %s entries ready" % len(table))        
        self.table = table

        return self


    def getTable(self):
        """Returns the translation table"""
        return self.table

    def getLanguage(self):
        """Returns the language of the translation file"""
        return self.language        

    def getFormat(self):
        """Returns the format of the localization file"""
        return getFormat(self.getPath())
