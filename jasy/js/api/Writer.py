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
        
        index, classes = self.collect()
        
        logging.info("Saving Files...")
        
        for className in classes:
            writeFile(os.path.join(distFolder, "%s.%s" % (className, format)), encode(classes[className].export()))
        
        writeFile(os.path.join(distFolder, "index.%s" % format), encode(index))
        
        
        

    def collect(self):
        
        #
        # Collecting Original Data
        #
        
        logging.info("- Collecting Data...")
        apiData = {}
        
        for project in self.session.getProjects():
            classes = project.getClasses()
            
            for className in classes:
                apiData[className] = classes[className].getApi()



        #
        # Accessor methods
        #

        mergedClasses = set()

        def mergeApi(dest, mixin):
            print("Merging: %s into %s" % (mixin.main["name"], dest.main["name"]))


        def getApi(className):
            classApi = apiData[className]

            if className in mergedClasses:
                return classApi

            classIncludes = getattr(classApi, "include", None)
            if classIncludes:
                for includeClassName in classIncludes:
                    mergeApi(classApi, getApi(includeClassName))

            mergedClasses.add(className)

            return classApi



        #
        # Connection API Data
        #
        
        logging.info("- Connecting Interfaces...")
        
        for className in apiData:
            classApi = getApi(className)
            classType = classApi.main["type"]
            
            if classType == "core.Class":
                
                classImplements = getattr(classApi, "implement", None)
                if classImplements:
                    
                    for interfaceName in classImplements:
                        if not hasattr(apiData[interfaceName], "implementedBy"):
                            apiData[interfaceName].implementedBy = []
                            
                        apiData[interfaceName].implementedBy.append(className)
        
        
        
        #
        # Writing API Index
        #
        
        logging.info("- Building Index...")
        index = {}
        
        for className in apiData:
            
            current = index
            for split in className.split("."):
                if not split in current:
                    current[split] = {}

                current = current[split]
                
            classApi = apiData[className]
            if "type" in classApi.main:
                current["type"] = classApi.main["type"]
                
                if classApi.main["name"] != className:
                    current["name"] = classApi.main["name"]
                    
            else:
                current["type"] = "None"

        
        
        #
        # Return
        #
        
        return index, apiData
        
        
        
