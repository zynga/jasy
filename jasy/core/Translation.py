#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

import polib

from jasy.core.Item import Item
from jasy.core.Logging import *

class Translation(Item):
    """
    Internal instances mapping a translation file in different formats
    with a conventient API.
    """

    __table = None

    def __init__(self, project, id=None):
        self.id = id
        self.project = project

        # Extract language from file ID
        # Thinking of that all files are named like de.po, de.txt, de.properties, etc.
        lang = self.id
        if "." in lang:
            lang = lang[lang.rfind(".")+1:]

        self.language = lang


    def getLanguage(self):
        """
        Returns the language of the translation file
        """

        return self.language        


    def getFormat(self):
        """
        Returns the file format of the translation. One of: gettext, xlf, properties and txt
        """

        path = self.getPath()
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


    def getTable(self):
        if self.__table is not None:
            return self.__table

        # Flat data strucuture where the keys are unique
        table = {}
        path = self.getPath()
        format = self.getFormat()

        # Decide infrastructure/parser to use based on file name
        if format is "gettext":
            po = polib.pofile(path)

            info("Percent of translated messages: %s", po.percent_translated())

            for entry in po.translated_entries():
                entryId = entry.msgid
                if entry.msgctxt is not None:
                    entryId += "[C:%s]" % entry.msgctxt
                elif entry.msgid_plural != "":
                    entryId += "[N:%s]" % entry.msgid_plural

                if not entryId in table:
                    # TODO: Change to respect context correctly
                    if entry.msgstr != "":
                        table[entryId] = entry.msgstr
                    elif entry.msgstr_plural:
                        table[entryId] = entry.msgstr_plural

        elif format is "xlf":
            raise JasyError("Parsing ICU/XLF files is currently not supported!")

        elif format is "properties":
            raise JasyError("Parsing ICU/Property files is currently not supported!")

        elif format is "txt":
            raise JasyError("Parsing ICU/text files is currently not supported!")
                        
        info("Translation of %s entries ready" % len(table))

        self.__table = table
        return table


