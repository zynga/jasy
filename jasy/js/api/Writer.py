#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Sebastian Werner
#

import logging
from jasy.util.File import *

__all__ = ["ApiWriter"]

class ApiWriter():
    
    def __init__(self, session):
        self.session = session

        
    def write(self, distFolder, format="json"):
        logging.info("Writing API data to: %s" % distFolder)
        
        if not format in ("json", "msgpack"):
            logging.warn("Invalid output format: %s. Falling back to json." % format)
            format = "json"
         
        makeDir(distFolder)
    
        for project in self.session.getProjects():
            classes = project.getClasses()
            
            for className in classes:
                apidata = classes[className].getApi()
                
                if format == "json":
                    content = apidata.toJSON(True)
                elif format == "msgpack":
                    content = apidata.toMsgpack()
                    
                writeFile("%s.%s" % (os.path.join(distFolder, className), format), content)
                