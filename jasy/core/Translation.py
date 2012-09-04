#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

from jasy.core.Item import Item

class Translation(Item):

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
        """Returns the language of the translation file"""
        
        return self.language

