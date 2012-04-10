#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

import logging, json, msgpack, copy, re

from jasy.env.File import *
from jasy.js.api.Data import ApiData
from jasy.js.api.Text import *
from jasy.js.util import *
from jasy.env.State import session, startSection

__all__ = ["ApiWriter"]


itemMap = {
    "members": "member",
    "statics": "static",
    "properties": "property",
    "events": "event"
}

linkMap = {
    "member": "members",
    "static": "statics",
    "property": "properties",
    "event": "events"
}

# Used to process HTML links
linkExtract = re.compile(r" href=(\"|')([a-zA-Z0-9#\:\.\~]+)(\"|')", re.M)
internalLinkParse = re.compile(r"^((static|member|property|event)\:)?([a-zA-Z0-9_\.]+)?(\~([a-zA-Z0-9_]+))?$")

def convertFunction(item):
    item["isFunction"] = True
    if "params" in item:
        params = item["params"]
        paramsNew = []
        sortedParams = list(sorted(params, key=lambda paramName: params[paramName]["position"]))
        for paramName in sortedParams:
            param = params[paramName]
            param["name"] = paramName
            paramsNew.append(param)
            
        item["params"] = paramsNew
        
        
def convertTags(item):
    if "tags" in item:
        tags = item["tags"]
        tagsNew = []
        if tags:
            for tagName in sorted(tags):
                tag = { "name" : tagName }
                if tags[tagName] is not True:
                    tag["value"] = "+".join(tags[tagName])
                tagsNew.append(tag)
            
        item["tags"] = tagsNew


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
    logging.info("Merging %s into %s", mixinName, className)

    sectionLink = ["member", "property", "event"]
    
    for pos, section in enumerate(("members", "properties", "events")):
        mixinItems = getattr(mixinApi, section, None)
        if mixinItems:
            classItems = getattr(classApi, section, None)
            if not classItems:
                classItems = {}
                setattr(classApi, section, classItems)
            
            for name in mixinItems:

                # Overridden Check
                if name in classItems:
                
                    # If it was included, just store another origin
                    if "origin" in classItems[name]:
                        classItems[name]["origin"].append({
                            "name": mixinName,
                            "link": "%s:%s~%s" % (sectionLink[pos], mixinName, name)
                        })
                
                    # Otherwise add it to the overridden list
                    else:
                        if not "overridden" in classItems[name]:
                            classItems[name]["overridden"] = []

                        classItems[name]["overridden"].append({
                            "name": mixinName,
                            "link": "%s:%s~%s" % (sectionLink[pos], mixinName, name)
                        })

                # Remember where classes are included from
                else:
                    classItems[name] = {}
                    classItems[name].update(mixinItems[name])
                    if not "origin" in classItems[name]:
                        classItems[name]["origin"] = []

                    classItems[name]["origin"].append({
                        "name": mixinName,
                        "link": "%s:%s~%s" % (sectionLink[pos], mixinName, name)
                    })



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
                if not "interface" in classProperties[name]:
                    classProperties[name]["defined"] = []

                classProperties[name]["defined"].append({
                    "name": interfaceName,
                    "link": "property:%s~%s" % (interfaceName, name)
                })
                
                # Copy over documentation
                if not "doc" in classProperties[name] and "doc" in interfaceProperties[name]:
                    classProperties[name]["doc"] = interfaceProperties[name]["doc"]

                if not "summary" in classProperties[name] and "summary" in interfaceProperties[name]:
                    classProperties[name]["summary"] = interfaceProperties[name]["summary"]
                    
                if "errornous" in classProperties[name] and not "errornous" in interfaceProperties[name]:
                    del classProperties[name]["errornous"]
                    
                # Update tags with data from interface
                if "tags" in interfaceProperties[name]:
                    if not "tags" in classProperties[name]:
                        classProperties[name]["tags"] = {}

                    safeUpdate(classProperties[name]["tags"], interfaceProperties[name]["tags"])                    
    
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
                if not "interface" in classEvents[name]:
                    classEvents[name]["defined"] = []

                classEvents[name]["defined"].append({
                    "name": interfaceName,
                    "link": "event:%s~%s" % (interfaceName, name)
                })
                
                # Copy user event type and documentation from interface
                if not "doc" in classEvents[name] and "doc" in interfaceEvents[name]:
                    classEvents[name]["doc"] = interfaceEvents[name]["doc"]

                if not "summary" in classEvents[name] and "summary" in interfaceEvents[name]:
                    classEvents[name]["summary"] = interfaceEvents[name]["summary"]

                if not "type" in classEvents[name] and "type" in interfaceEvents[name]:
                    classEvents[name]["type"] = interfaceEvents[name]["type"]

                if "errornous" in classEvents[name] and not "errornous" in interfaceEvents[name]:
                    del classEvents[name]["errornous"]
                    
                # Update tags with data from interface
                if "tags" in interfaceEvents[name]:
                    if not "tags" in classEntry:
                        classEvents[name]["tags"] = {}

                    safeUpdate(classEvents[name]["tags"], interfaceEvents[name]["tags"])                    

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
                if not "interface" in classEntry:
                    classEntry["defined"] = []
                    
                classEntry["defined"].append({
                    "name": interfaceName,
                    "link": "member:%s~%s" % (interfaceName, name)
                })
                
                # Copy over doc from interface
                if not "doc" in classEntry and "doc" in interfaceEntry:
                    classEntry["doc"] = interfaceEntry["doc"]

                if not "summary" in classEntry and "summary" in interfaceEntry:
                    classEntry["summary"] = interfaceEntry["summary"]

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
    
    def write(self, distFolder, format="json", compact=True, callback="apiload", showInternals=False, showPrivates=False):
        
        startSection("Writing API data...")
        
        if not format in ("json", "msgpack"):
            logging.warn("Invalid output format: %s. Falling back to json." % format)
            format = "json"
        
        def encode(content, name):
            if format == "json":
                class SetEncoder(json.JSONEncoder):
                    def default(self, obj):
                        if isinstance(obj, set):
                            return sorted(list(obj))

                        return json.JSONEncoder.default(self, obj)
                        
                if compact:
                    jsonEncoded = json.dumps(content, sort_keys=False, cls=SetEncoder, separators=(',',':'))
                else:
                    jsonEncoded = json.dumps(content, sort_keys=False, indent=2, cls=SetEncoder)
                
                if callback:
                    return "%s(%s,'%s');" % (callback, jsonEncoded, name)
                else:
                    return jsonEncoded
                
            elif format == "msgpack":
                return "%s" % msgpack.packb(content)
        
        data, highlighted, index, search = self.collect(internals=showInternals, privates=showPrivates)
        
        extension = "js" if callback and format is "json" else format
        logging.debug("Saving files as %s..." % extension)

        for className in data:
            try:
                classData = data[className]
                if type(classData) is dict:
                    classExport = classData
                else:
                    classExport = classData.export()

                writeFile(os.path.join(distFolder, "%s.%s" % (className, extension)), encode(classExport, className))
            except TypeError as writeError:
                logging.error("Could not write API data of: %s: %s", className, writeError)
                continue

        for className in highlighted:
            try:
                writeFile(os.path.join(distFolder, "%s.html" % className), highlighted[className])
            except TypeError as writeError:
                logging.error("Could not write highlighted code of: %s: %s", className, writeError)
                continue

        writeFile(os.path.join(distFolder, "meta-index.%s" % extension), encode(index, "meta-index"))
        writeFile(os.path.join(distFolder, "meta-search.%s" % extension), encode(search, "meta-search"))



    def collect(self, internals=False, privates=False):
        
        #
        # Collecting Original (Cached) Data
        #
        
        logging.info("Generating API Data...")
        apiData = {}
        highlightedCode = {}
        
        for project in session.getProjects():
            classes = project.getClasses()
            for className in classes:
                apiData[className] = classes[className].getApi()
                highlightedCode[className] = classes[className].getHighlightedCode()
                
        knownClasses = set(list(apiData))



        #
        # Attaching Links to Source Code (Lines)
        # Building Documentation Summaries
        #

        logging.info("Adding Source Links...")

        for className in apiData:
            classApi = apiData[className]

            constructData = getattr(classApi, "construct", None)
            if constructData is not None:
                if "line" in constructData:
                    constructData["sourceLink"] = "source:%s~%s" % (className, constructData["line"])

            for section in ("properties", "events", "statics", "members"):
                sectionData = getattr(classApi, section, None)

                if sectionData is not None:
                    for name in sectionData:
                        if "line" in sectionData[name]:
                            sectionData[name]["sourceLink"] = "source:%s~%s" % (className, sectionData[name]["line"])



        #
        # Including Mixins / IncludedBy
        #

        logging.info("Resolving Mixins...")

        # Just used temporary to keep track of which classes are merged
        mergedClasses = set()

        def getApi(className):
            classApi = apiData[className]

            if className in mergedClasses:
                return classApi

            classIncludes = getattr(classApi, "includes", None)
            if classIncludes:
                for mixinName in classIncludes:
                    if not mixinName in apiData:
                        logging.error("Invalid mixin %s in class %s", className, mixinName)
                        continue
                        
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
        # Checking links
        #
        
        logging.info("Checking Links...")
        
        additionalTypes = ("Call", "Identifier", "Map", "Integer", "Node", "Element")
        
        def checkInternalLink(link, className):
            match = internalLinkParse.match(link)
            if not match:
                return 'Invalid link "#%s"' % link
                
            if match.group(3) is not None:
                className = match.group(3)
                
            if not className in knownClasses and not className in apiData:
                return 'Invalid class in link "#%s"' % link
                
            # Accept all section/item values for named classes,
            # as it might be pretty complicated to verify this here.
            if not className in apiData:
                return True
                
            classApi = apiData[className]
            sectionName = match.group(2)
            itemName = match.group(5)
            
            if itemName is None:
                return True
                
            if sectionName is not None:
                if not sectionName in linkMap:
                    return 'Invalid section in link "#%s"' % link
                    
                section = getattr(classApi, linkMap[sectionName], None)
                if section is None:
                    return 'Invalid section in link "#%s"' % link
                else:
                    if itemName in section:
                        return True
                        
                    return 'Invalid item in link "#%s"' % link
            
            for sectionName in ("statics", "members", "properties", "events"):
                section = getattr(classApi, sectionName, None)
                if section and itemName in section:
                    return True
                
            return 'Invalid item link "#%s"' % link


        def checkLinksInItem(item):
            
            # Process types
            if "type" in item:
                
                if item["type"] == "Function":

                    # Check param types
                    if "params" in item:
                        for paramName in item["params"]:
                            paramEntry = item["params"][paramName]
                            if "type" in paramEntry:
                                for paramTypeEntry in paramEntry["type"]:
                                    if not paramTypeEntry["name"] in knownClasses and not paramTypeEntry["name"] in additionalTypes and not ("builtin" in paramTypeEntry or "pseudo" in paramTypeEntry):
                                        item["errornous"] = True
                                        logging.error('- Invalid param type "%s" in %s at line %s', paramTypeEntry["name"], className, item["line"])

                                    if not "pseudo" in paramTypeEntry and paramTypeEntry["name"] in knownClasses:
                                        paramTypeEntry["linkable"] = True
                
                
                    # Check return types
                    if "returns" in item:
                        for returnTypeEntry in item["returns"]:
                            if not returnTypeEntry["name"] in knownClasses and not returnTypeEntry["name"] in additionalTypes and not ("builtin" in returnTypeEntry or "pseudo" in returnTypeEntry):
                                item["errornous"] = True
                                logging.error('- Invalid return type "%s" in %s at line %s', returnTypeEntry["name"], className, item["line"])
                            
                            if not "pseudo" in returnTypeEntry and returnTypeEntry["name"] in knownClasses:
                                returnTypeEntry["linkable"] = True
                            
                elif not item["type"] in builtinTypes and not item["type"] in additionalTypes:
                    
                    logging.error('- Invalid type "%s" in %s at line %s', item["type"], className, item["line"])
            
            
            # Process doc
            if "doc" in item:
                
                def processInternalLink(match):
                    linkUrl = match.group(2)

                    if linkUrl.startswith("#"):
                        linkCheck = checkInternalLink(linkUrl[1:], className)
                        if linkCheck is not True:
                            item["errornous"] = True
                            if sectionName:
                                logging.error("- %s in %s:%s~%s at line %s" % (linkCheck, sectionName, className, name, item["line"]))
                            else:
                                logging.error("- %s in %s at line %s" % (linkCheck, className, item["line"]))
            
                linkExtract.sub(processInternalLink, item["doc"])


        # Process APIs
        for className in apiData:
            classApi = apiData[className]
            
            sectionName = None
            constructData = getattr(classApi, "construct", None)
            if constructData is not None:
                checkLinksInItem(constructData)

            for sectionName in ("properties", "events", "statics", "members"):
                section = getattr(classApi, sectionName, None)

                if section is not None:
                    for name in section:
                         checkLinksInItem(section[name])



        #
        # Filter Internals/Privates
        #
        
        logging.info("Filtering Items...")
        
        def isVisible(entry):
            if "visibility" in entry:
                visibility = entry["visibility"]
                if visibility == "private" and not privates:
                    return False
                if visibility == "internal" and not internals:
                    return False

            return True

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
        # Connection Interfaces / ImplementedBy
        #
        
        logging.info("Connecting Interfaces...")
        
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
        # Merging Named Classes
        #
        
        logging.info("Merging Named Classes...")
        
        for className in list(apiData):
            classApi = apiData[className]
            destName = classApi.main["name"]
            
            if destName is not None and destName != className:

                logging.debug("Extending class %s with %s" % (destName, className))

                if destName in apiData:
                    destApi = apiData[destName]
                    destApi.main["from"].append(className)
                
                else:
                    destApi = apiData[destName] = ApiData(destName)
                    destApi.main = {
                        "type" : "Extend",
                        "name" : destName,
                        "from" : [className]
                    }
                    
                # If there is a "main" tag found in the class use its API description
                if "tags" in classApi.main and classApi.main["tags"] is not None and "main" in classApi.main["tags"]:
                    if "doc" in classApi.main:
                        destApi.main["doc"] = classApi.main["doc"]
                
                classApi.main["extension"] = True
                    
                # Read existing data
                construct = getattr(classApi, "construct", None)
                statics = getattr(classApi, "statics", None)
                members = getattr(classApi, "members", None)

                if construct is not None:
                    if hasattr(destApi, "construct"):
                        logging.warn("Overriding constructor in extension %s by %s", destName, className)
                        
                    destApi.construct = copy.copy(construct)

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
                        destApi.members[memberName] = copy.copy(members[memberName])
                        destApi.members[memberName]["from"] = className
                        destApi.members[memberName]["fromLink"] = "member:%s~%s" % (className, memberName)



        #
        # Connecting Uses / UsedBy
        #

        logging.info("Collecting Use Patterns...")

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
        # Collecting errors
        #
        
        logging.info("Collecting Errors...")
        
        for className in sorted(apiData):
            classApi = apiData[className]
            errors = []

            if isErrornous(classApi.main):
                errors.append({
                    "kind": "Main",
                    "name": None,
                    "line": 1
                })
            
            if hasattr(classApi, "construct"):
                if isErrornous(classApi.construct):
                    errors.append({
                        "kind": "Constructor",
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
                logging.warn("- Found errors in %s", className)
                errorsSorted = sorted(errors, key=lambda entry: entry["line"])
                
                for entry in errorsSorted:
                    if entry["name"]:
                        logging.warn("  - %s: %s (line %s)", entry["kind"], entry["name"], entry["line"])
                    else:
                        logging.warn("  - %s (line %s)", entry["kind"], entry["line"])
                
                classApi.errors = errorsSorted
        
        
        
        #
        # Building Search Index
        #

        logging.info("Building Search Index...")
        search = {}

        def addSearch(classApi, field):
            data = getattr(classApi, field, None)
            if data:
                for name in data:
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
        # Post Process (dict to sorted list)
        #
        
        logging.info("Post Processing Data...")
        
        for className in sorted(apiData):
            classApi = apiData[className]
            
            convertTags(classApi.main)
            
            construct = getattr(classApi, "construct", None)
            if construct:
                convertFunction(construct)
                convertTags(construct)

            for section in ("statics", "members", "properties", "events"):
                items = getattr(classApi, section, None)
                if items:
                    sortedList = []
                    for itemName in sorted(items):
                        item = items[itemName]
                        item["name"] = itemName
                        
                        if "type" in item and item["type"] == "Function":
                            convertFunction(item)
                                
                        convertTags(item)
                        sortedList.append(item)

                    setattr(classApi, section, sortedList)
        
        
        
        #
        # Collecting Package Docs
        #

        logging.info("Collecting Package Docs...")
        
        # Inject existing package docs into api data
        for project in session.getProjects():
            docs = project.getDocs()
            
            for packageName in docs:
                logging.debug("- Creating package entry with documentation: %s" % packageName)
                apiData[packageName] = docs[packageName].getApi()
        
        
        # Fill missing package docs
        for className in sorted(apiData):
            splits = className.split(".")
            packageName = splits[0]
            for split in splits[1:]:
                if not packageName in apiData:
                    logging.warn("- Missing package documentation for package: %s" % packageName)
                    apiData[packageName] = ApiData(packageName)
                    apiData[packageName].main = {
                        "type" : "Package",
                        "name" : packageName
                    }
                        
                packageName = "%s.%s" % (packageName, split)


        # Now register all classes in their parent namespace/package
        for className in sorted(apiData):
            splits = className.split(".")
            packageName = ".".join(splits[:-1])
            if packageName:
                package = apiData[packageName]
                logging.debug("- Registering class %s in parent %s" % (className, packageName))
                
                entry = {
                    "name" : splits[-1],
                    "link" : className,
                }
                
                classMain = apiData[className].main
                if "doc" in classMain and classMain["doc"]:
                    summary = extractSummary(classMain["doc"])
                    if summary:
                        entry["summary"] = summary
                        
                if "type" in classMain and classMain["type"]:
                    entry["type"] = classMain["type"]
                
                if not hasattr(package, "content"):
                    package.content = [entry]
                else:
                    package.content.append(entry)



        #
        # Writing API Index
        #
        
        logging.debug("Building Index...")
        index = {}
        
        for className in sorted(apiData):
            
            classApi = apiData[className]
            mainInfo = classApi.main
            
            # Create structure for className
            current = index
            for split in className.split("."):
                if not split in current:
                    current[split] = {}
            
                current = current[split]
            
            # Store current type
            current["$type"] = mainInfo["type"]
            
            # Keep information if
            if hasattr(classApi, "content"):
                current["$content"] = True
        
        
        
        #
        # Return
        #
        
        return apiData, highlightedCode, index, search
        
        
        
