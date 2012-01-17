#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Sebastian Werner
#

import logging

__all__ = ["ApiWriter"]

class ApiWriter():
    
    def __init__(self, session):
        self.session = session

        
    def write(self, distFolder):
        logging.info("Writing API data to: %s" % distFolder)
        
    
    