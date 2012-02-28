#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Sebastian Werner
#

import logging, json, msgpack, copy
from jasy.util.File import *
from jasy.js.api.Data import ApiData

__all__ = ["ApiWriter"]


itemMap = {
    "members": "member",
    "statics": "static",
    "properties": "property",
    "events": "event"
}


def safeUpdate(dest, origin):
    """ Like update() but only never overwrites"""
    
    for key in origin:
        if not key in dest:
            dest[key] = origin[dest]


def isErrornous(data):
    if "errornous" in data:
        return True
        
    if "params" in data:
        for paramName in data["params"]:
            param = data["params"][paramName]
            if "errornous" in param:
                return True
                
    return False


def mergeMixin(className, mixinName, classApi, mixinApi):
    logging.debug("Merging %s into %s", mixinName, className)

    for section in ("members", "properties", "events"):
        mixinMembers = getattr(mixinApi, section, None)
        if mixinMembers:
            classMembers = getattr(classApi, section, {})
            for name in mixinMembers:

                # Overridden Check
                if name in classMembers:
                
                    # If it was included, just store another origin
                    if "origin" in classMembers[name]:
                        classMembers[name]["origin"].append(mixinName)
                
                    # Otherwise add it to the overridden list
                    else:
                        if not "overridden" in classMembers[name]:
                            classMembers[name]["overridden"] = []

                        classMembers[name]["overridden"].append(mixinName)

                # Remember where classes are included from
                else:
                    classMembers[name] = {}
                    classMembers[name].update(mixinMembers[name])
                    if not "origin" in classMembers[name]:
                        classMembers[name]["origin"] = []

                    classMembers[name]["origin"].append(mixinName)



def connectInterface(className, interfaceName, classApi, interfaceApi):
    logging.debug("Connecting %s with %s", className, interfaceName)
    
    #
    # Properties
    #
    interfaceProperties = getattr(interfaceApi, "properties", None)
    if interfaceProperties:
        classProperties = getattr(classApi, "properties", {})
        for name in interfaceProperties:
            if not name in classProperties:
                logging.warn("Class %s is missing implementation for property %s of interface %s!", className, name, interfaceName)

            else:
                # Add reference to interface
                classProperties[name]["interface"] = interfaceName

                # Copy over documentation
                if not "doc" in classProperties[name] and "doc" in interfaceProperties[name]:
                    classProperties[name]["doc"] = interfaceProperties[name]["doc"]
                    
                if "errornous" in classProperties[name] and not "errornous" in interfaceProperties[name]:
                    del classProperties[name]["errornous"]
    
    #
    # Events
    #
    interfaceEvents = getattr(interfaceApi, "events", None)
    if interfaceEvents:
        classEvents = getattr(classApi, "events", {})
        for name in interfaceEvents:
            if not name in classEvents:
                logging.warn("Class %s is missing implementation for event %s of interface %s!", className, name, interfaceName)
            else:
                # Add reference to interface
                classEvents[name]["interface"] = interfaceName
                
                # Copy user event type and documentation from interface
                if not "doc" in classEvents[name] and "doc" in interfaceEvents[name]:
                    classEvents[name]["doc"] = interfaceEvents[name]["doc"]

                if not "type" in classEvents[name] and "type" in interfaceEvents[name]:
                    classEvents[name]["type"] = interfaceEvents[name]["type"]

                if "errornous" in classEvents[name] and not "errornous" in interfaceEvents[name]:
                    del classEvents[name]["errornous"]

    #
    # Members
    #
    interfaceMembers = getattr(interfaceApi, "members", None)
    if interfaceMembers:
        classMembers = getattr(classApi, "members", {})
        for name in interfaceMembers:
            if not name in classMembers:
                logging.warn("Class %s is missing implementation for member %s of interface %s!", className, name, interfaceName)
    
            else:
                interfaceEntry = interfaceMembers[name]
                classEntry = classMembers[name]
                
                # Add reference to interface
                classEntry["interface"] = interfaceName
                
                # Copy over doc from interface
                if not "doc" in classEntry and "doc" in interfaceEntry:
                    classEntry["doc"] = interfaceEntry["doc"]

                if "errornous" in classEntry[name] and not "errornous" in interfaceEntry[name]:
                    del classEntry[name]["errornous"]

                # Priorize return value from interface (it's part of the interface feature set to enforce this)
                if "returns" in interfaceEntry:
                    classEntry["returns"] = interfaceEntry["returns"]

                # Update tags with data from interface
                if "tags" in interfaceEntry:
                    if not "tags" in classEntry:
                        classEntry["tags"] = {}
                    
                    safeUpdate(classEntry["tags"], interfaceEntry["tags"])

                # Copy over params from interface
                if "params" in interfaceEntry:
                    # Fix completely missing parameters
                    if not "params" in classEntry:
                        classEntry["params"] = {}
                        
                    for paramName in interfaceEntry["params"]:
                        # Prefer data from interface
                        if not paramName in classEntry["params"]:
                            classEntry["params"][paramName] = {}
                            
                        classEntry["params"][paramName].update(interfaceEntry["params"][paramName])
                        
                        # Clear errournous documentation flags
                        if "errornous" in classEntry["params"][paramName] and not "errornous" in interfaceEntry["params"][paramName]:
                            del classEntry["params"][paramName]["errornous"]



class ApiWriter():
    
    def __init__(self, session):
        self.session = session
        
        
    def write(self, distFolder, format="json", compact=True, callback=None, showInternals=False, showPrivates=False):
        
        logging.info("Writing API data to: %s" % distFolder)
        
        if not format in ("json", "msgpack"):
            logging.warn("Invalid output format: %s. Falling back to json." % format)
            format = "json"
        
        def encode(content, name):
            if format == "json":
                class SetEncoder(json.JSONEncoder):
                    def default(self, obj):
                        if isinstance(obj, set):
                            return list(obj)
                        return json.JSONEncoder.default(self, obj)
                        
                if compact:
                    jsonEncoded = json.dumps(content, sort_keys=True, cls=SetEncoder, separators=(',',':'))
                else:
                    jsonEncoded = json.dumps(content, sort_keys=True, indent=2, cls=SetEncoder)
                
                if callback:
                    return "%s(%s,'%s');" % (callback, jsonEncoded, name)
                else:
                    return jsonEncoded
                
            elif format == "msgpack":
                return "%s" % msgpack.packb(content)
        
        classes, index, search = self.collect(internals=showInternals, privates=showPrivates)
        
        extension = "js" if callback and format is "json" else format
        logging.debug("Saving files as %s..." % extension)

        for className in classes:
            try:
                classData = classes[className]
                if type(classData) is dict:
                    classExport = classData
                else:
                    classExport = classData.export()
                    
                writeFile(os.path.join(distFolder, "%s.%s" % (className, extension)), encode(classExport, className))
            except TypeError as writeError:
                logging.error("Could not write API data of: %s: %s", className, writeError)
                continue
        
        writeFile(os.path.join(distFolder, "$index.%s" % extension), encode(index, "$index"))
        writeFile(os.path.join(distFolder, "$search.%s" % extension), encode(search, "$search"))
        
        
        

    def collect(self, internals=False, privates=False):
        
        def isVisible(entry):
            if "visibility" in entry:
                visibility = entry["visibility"]
                if visibility == "private" and not privates:
                    return False
                if visibility == "internal" and not internals:
                    return False

            return True
        
        
        
        #
        # Collecting Original Data
        #
        
        logging.debug("Collecting Classes...")
        apiData = {}
        
        for project in self.session.getProjects():
            classes = project.getClasses()
            for className in classes:
                apiData[className] = classes[className].getApi()



        #
        # Including Mixins / IncludedBy
        #

        logging.debug("Resolving Mixins...")

        # Just used temporary to keep track of which classes are merged
        mergedClasses = set()

        def getApi(className):
            classApi = apiData[className]

            if className in mergedClasses:
                return classApi

            classIncludes = getattr(classApi, "includes", None)
            if classIncludes:
                for mixinName in classIncludes:
                    mixinApi = apiData[mixinName]
                    if not hasattr(mixinApi, "includedBy"):
                        mixinApi.includedBy = set()
                    
                    mixinApi.includedBy.add(className)

                    mergeMixin(className, mixinName, classApi, getApi(mixinName))
                    

            mergedClasses.add(className)

            return classApi

        for className in apiData:
            apiData[className] = getApi(className)



        #
        # Connection Interfaces / ImplementedBy
        #
        
        logging.debug("Connecting Interfaces...")
        
        for className in apiData:
            classApi = getApi(className)
            
            if not hasattr(classApi, "main"):
                continue
                
            classType = classApi.main["type"]
            if classType == "core.Class":
                
                classImplements = getattr(classApi, "implements", None)
                if classImplements:
                    
                    for interfaceName in classImplements:
                        interfaceApi = apiData[interfaceName]
                        implementedBy = getattr(interfaceApi, "implementedBy", None)
                        if not implementedBy:
                            implementedBy = interfaceApi.implementedBy = []
                            
                        implementedBy.append(className)
                        
                        connectInterface(className, interfaceName, classApi, interfaceApi)
        
        
        
        #
        # Connecting Uses / UsedBy
        #

        # This matches all uses with the known classes and only keeps them if matched
        allClasses = set(list(apiData))
        for className in apiData:
            uses = apiData[className].uses

            # Rebuild use list
            cleanUses = set()
            for use in uses:
                if use != className and use in allClasses:
                    cleanUses.add(use)
                    
                    useEntry = apiData[use]
                    if not hasattr(useEntry, "usedBy"):
                        useEntry.usedBy = set()
                        
                    useEntry.usedBy.add(className)

            apiData[className].uses = cleanUses
        
        
        
        #
        # Filter Internals/Privates
        #
        
        def filterInternalsPrivates(classApi, field):
            data = getattr(classApi, field, None)
            if data:
                for name in list(data):
                    if not isVisible(data[name]):
                        del data[name]

        for className in apiData:
            filterInternalsPrivates(apiData[className], "statics")
            filterInternalsPrivates(apiData[className], "members")
        
        
        
        #
        # Merging Named Classes
        #
        
        for className in list(apiData):
            classApi = apiData[className]
            destName = classApi.main["name"]
            
            if destName is not None and destName != className:

                if destName in apiData:
                    destApi = apiData[destName]
                    destApi.main["from"].append(className)
                
                else:
                    destApi = apiData[destName] = ApiData(destName)
                    destApi.main = {
                        "type" : "Extend",
                        "name" : destName,
                        "from" : [className],
                        "doc" : "Extensions for %s" % destName
                    }
                    
                classApi.main["extension"] = True
                    
                # Read existing data
                constructor = getattr(classApi, "constructor", None)
                statics = getattr(classApi, "statics", None)
                members = getattr(classApi, "members", None)

                if constructor is not None:
                    if hasattr(destApi, "constructor"):
                        logging.warn("Overriding constructor in extension %s by %s", destName, className)
                        
                    destApi.constructor = constructor

                if statics is not None:
                    if not hasattr(destApi, "statics"):
                        destApi.statics = {}

                    for staticName in statics:
                        destApi.statics[staticName] = copy.copy(statics[staticName])
                        destApi.statics[staticName]["from"] = className
                        destApi.statics[staticName]["fromLink"] = "static:%s~%s" % (className, staticName)

                if members is not None:
                    if not hasattr(destApi, "members"):
                        destApi.members = {}
                        
                    for memberName in members:
                        destApi.members[memberName] = members[memberName]
                        destApi.members[memberName]["from"] = className
                        destApi.members[memberName]["fromLink"] = "member:%s~%s" % (className, memberName)
        
        
        
        #
        # Collecting errors
        #
        
        for className in sorted(apiData):
            classApi = apiData[className]
            errors = []

            if isErrornous(classApi.main):
                errors.append({
                    "kind": "main",
                    "name": None,
                    "line": 1
                })
            
            if hasattr(classApi, "construct"):
                if isErrornous(classApi.construct):
                    errors.append({
                        "kind": "construct",
                        "name": None,
                        "line": classApi.construct["line"]
                    })
            
            for section in ("statics", "members", "properties", "events"):
                items = getattr(classApi, section, {})
                for itemName in items:
                    item = items[itemName]
                    if isErrornous(item):
                        errors.append({
                            "kind": itemMap[section],
                            "name": itemName,
                            "line": item["line"]
                        })
                        
            if errors:
                logging.warn("API documentation errors in %s", className)
                for entry in sorted(errors, key=lambda entry: entry["line"]):
                    if entry["name"]:
                        logging.warn("- %s: %s (line %s)", entry["kind"], entry["name"], entry["line"])
                    else:
                        logging.warn("- %s (line %s)", entry["kind"], entry["line"])
                
                classApi.errors = errors
        
        
        #
        # Collecting Package Docs
        #

        logging.debug("Collecting Package Docs...")

        for project in self.session.getProjects():
            docs = project.getDocs()
            for packageName in docs:
                apiData[packageName] = ApiData(packageName)
                apiData[packageName].main = {
                    "type" : "Package",
                    "name" : packageName,
                    "doc" : docs[packageName]
                }
                

        for className in list(apiData):
            # Auto create API data for all packages in between
            splits = className.split(".")
            packageName = splits[0]
            for split in splits[1:]:
                if not packageName in apiData:
                    logging.debug("Creating missing package doc entry: %s" % packageName)
                    apiData[packageName] = ApiData(packageName)
                    apiData[packageName].main = {
                        "type" : "Package",
                        "name" : packageName
                    }

                packageName = "%s.%s" % (packageName, split)
        
        
        
        #
        # Writing API Index
        #
        
        logging.debug("Building Index...")
        index = {}
        
        for className in apiData:
            
            classApi = apiData[className]
            mainInfo = classApi.main
            
            # Create missing packages for className
            current = index
            for split in className.split("."):
                if not split in current:
                    current[split] = { "$type": "Package", "$nodoc" : True }

                current = current[split]
            
            # Store current type
            current["$type"] = mainInfo["type"]
            
            # Bring errornous info to index
            if "errornous" in mainInfo:
                current["$errornous"] = mainInfo["errornous"]
            
            # Clear no documentation flag
            del current["$nodoc"]
            
            
            
        #
        # Building Search Index
        #
        
        logging.debug("Building Search Index")
        search = {}
        
        def addSearch(classApi, field):
            data = getattr(classApi, field, None)
            if data:
                for name in data:
                    if not isVisible(data[name]):
                        continue
                    
                    if not name in search:
                        search[name] = set()

                    search[name].add(className)                
        
        for className in apiData:
            
            classApi = apiData[className]

            addSearch(classApi, "statics")
            addSearch(classApi, "members")
            addSearch(classApi, "properties")
            addSearch(classApi, "events")
        
        
        
        
        #
        # Return
        #
        
        return apiData, index, search
        
        
        
