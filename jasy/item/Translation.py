#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

import polib, json

import jasy.item.Abstract
import jasy.core.Console as Console


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
    elif plural:
        result += "[N:%s]" % plural

    return result


class TranslationItem(jasy.item.Abstract.AbstractItem):
    """
    Internal instances mapping a translation file in different formats
    with a conventient API.
    """

    def __add__(self, other):
        self.table.update(other.getTable())
        return self


    def __init__(self, project, id=None, table=None):
        # Call Item's init method first
        super().__init__(project, id)

        # Extract language from file ID
        # Thinking of that all files are named like de.po, de.txt, de.properties, etc.
        lang = self.id
        if "." in lang:
            lang = lang[lang.rfind(".")+1:]

        self.language = lang

        # Initialize translation table
        self.table = table or {}


    def attach(self, path):
        # Call Item's attach method first
        super().attach(path)

        Console.debug("Loading translation file: %s", path)
        Console.indent()

        # Flat data strucuture where the keys are unique
        table = {}
        path = self.getPath()
        format = self.getFormat()

        # Decide infrastructure/parser to use based on file name
        if format is "gettext":
            po = polib.pofile(path)
            Console.debug("Translated messages: %s=%s%%", self.language, po.percent_translated())

            for entry in po.translated_entries():
                entryId = generateId(entry.msgid, entry.msgid_plural, entry.msgctxt)
                if not entryId in table:
                    if entry.msgstr != "":
                        table[entryId] = entry.msgstr
                    elif entry.msgstr_plural:
                        # This field contains all different plural cases (type=dict)
                        table[entryId] = entry.msgstr_plural

        elif format is "xlf":
            raise UserError("Parsing ICU/XLF files is currently not supported!")

        elif format is "properties":
            raise UserError("Parsing ICU/Property files is currently not supported!")

        elif format is "txt":
            raise UserError("Parsing ICU/text files is currently not supported!")
                        
        Console.debug("Translation of %s entries ready" % len(table))        
        Console.outdent()
        
        self.table = table

        return self

    def export(self, classes):
        """Exports the translation table as JSON based on the given set of classes"""

        # Based on the given class list figure out which translations are actually used
        relevantTranslations = set()
        for classObj in classes:
            classTranslations = classObj.getTranslations()
            if classTranslations:
                relevantTranslations.update(classTranslations)

        # Produce new table which is filtered by relevant translations
        table = self.table
        result = { translationId: table[translationId] for translationId in relevantTranslations if translationId in table }

        return json.dumps(result or None)

    def getTable(self):
        """Returns the translation table"""
        return self.table

    def getLanguage(self):
        """Returns the language of the translation file"""
        return self.language        

    def getFormat(self):
        """Returns the format of the localization file"""
        return getFormat(self.getPath())
