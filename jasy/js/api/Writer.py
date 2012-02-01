#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Sebastian Werner
#

import logging, json, msgpack
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
         
        def encode(content):
            if format == "json":
                return json.dumps(content, sort_keys=True, indent=2)
            elif format == "msgpack":
                return "%s" % msgpack.packb(content)
                
        index = {}
        
        for project in self.session.getProjects():
            classes = project.getClasses()
            
            for className in classes:
                
                current = index
                for split in className.split("."):
                    if not split in current:
                        current[split] = {}

                    current = current[split]
                    
                apidata = classes[className].getApi()

                if "type" in apidata.main:
                    current["type"] = apidata.main["type"]
                    
                    if apidata.main["name"] != className:
                        current["name"] = apidata.main["name"]
                        
                else:
                    current["type"] = "None"
                    
                    
                
                writeFile(os.path.join(distFolder, "%s.%s" % (className, format)), encode(apidata.export()))
                
        writeFile(os.path.join(distFolder, "index.%s" % format), encode(index))