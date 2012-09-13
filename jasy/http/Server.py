#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

import sys, os, jasy, logging, base64, json, requests, cherrypy
from collections import namedtuple

import jasy.core.Cache as Cache
import jasy.core.Console as Console

from jasy.core.Types import CaseInsensitiveDict
from jasy.core.Util import getKey

Result = namedtuple('Result', ['headers', 'content'])

# Disable logging HTTP request being created
logging.getLogger("requests").setLevel(logging.WARNING)


__all__ = ["serve"]


#
# UTILITIES
#

def enableCrossDomain():
    # See also: https://developer.mozilla.org/En/HTTP_Access_Control
    
    # Allow requests from all locations
    cherrypy.response.headers["Access-Control-Allow-Origin"] = "*"
   
    # Allow all methods supported by urlfetch
    cherrypy.response.headers["Access-Control-Allow-Methods"] = "GET, POST, HEAD, PUT, DELETE"
    
    # Allow cache-control and our custom headers
    cherrypy.response.headers["Access-Control-Allow-Headers"] = "Cache-Control, X-Proxy-Authorization, X-Requested-With"    
    
    # Cache allowence for cross domain for 7 days
    cherrypy.response.headers["Access-Control-Max-Age"] = "604800"


def findIndex(path):
    all = ["index.html", "index.php"]
    for candidate in all:
        rel = os.path.join(path, candidate)
        if os.path.exists(rel):
            return candidate
            
    return None



#
# ROUTERS
#

class Proxy(object):
    
    def __init__(self, id, config):
        self.id = id
        self.config = config
        self.host = getKey(config, "host")
        self.auth = getKey(config, "auth")
        
        self.enableDebug = getKey(config, "debug", False)
        self.enableMirror = getKey(config, "mirror", False)
        self.enableOffline = getKey(config, "offline", False)

        if self.enableMirror:
            self.mirror = Cache.Cache(os.getcwd(), ".jasy/mirror-%s" % self.id, hashkeys=True)

        Console.info('Proxy "%s" => "%s" [debug:%s|mirror:%s|offline:%s]', self.id, self.host, self.enableDebug, self.enableMirror, self.enableOffline)
        
        
    # These headers will be blocked between header copies
    __blockHeaders = CaseInsensitiveDict.fromkeys([
        "content-encoding", 
        "content-length", 
        "connection", 
        "keep-alive", 
        "proxy-authenticate", 
        "proxy-authorization", 
        "transfer-encoding", 
        "remote-addr", 
        "host"
    ])
    
    
    @cherrypy.expose
    def default(self, *args, **query):
        """
        This method returns the content of existing files on the file system.
        Query string might be used for cache busting and are otherwise ignored.
        """
        
        url = self.config["host"] + "/".join(args)
        result = None

        # Try using offline mirror if feasible
        if self.enableMirror and cherrypy.request.method == "GET":
            mirrorId = "%s[%s]" % (url, json.dumps(query, separators=(',',':'), sort_keys=True))
            result = self.mirror.read(mirrorId)
            if result is not None and self.enableDebug:
                Console.info("Mirrored: %s" % url)
         
        # Check if we're in forced offline mode
        if self.enableOffline and result is None:
            Console.info("Offline: %s" % url)
            raise cherrypy.NotFound(url)
        
        # Load URL from remote server
        if result is None:

            # Prepare headers
            headers = CaseInsensitiveDict()
            for name in cherrypy.request.headers:
                if not name in self.__blockHeaders:
                    headers[name] = cherrypy.request.headers[name]
            
            # Load URL from remote host
            try:
                if self.enableDebug:
                    Console.info("Requesting: %s", url)
                    
                # Apply headers for basic HTTP authentification
                if "X-Proxy-Authorization" in headers:
                    headers["Authorization"] = headers["X-Proxy-Authorization"]
                    del headers["X-Proxy-Authorization"]                
                    
                # Add headers for different authentification approaches
                if self.auth:
                    
                    # Basic Auth
                    if self.auth["method"] == "basic":
                        headers["Authorization"] = b"Basic " + base64.b64encode(("%s:%s" % (self.auth["user"], self.auth["password"])).encode("ascii"))
                    
                # We disable verifícation of SSL certificates to be more tolerant on test servers
                result = requests.request(cherrypy.request.method, url, params=query, headers=headers, verify=False)
                
            except Exception as err:
                if self.enableDebug:
                    Console.info("Request failed: %s", err)
                    
                raise cherrypy.HTTPError(403)

            # Storing result into mirror
            if self.enableMirror and cherrypy.request.method == "GET":

                # Wrap result into mirrorable entry
                resultCopy = Result(result.headers, result.content)
                self.mirror.store(mirrorId, resultCopy)
        

        # Copy response headers to our reponse
        for name in result.headers:
            if not name.lower() in self.__blockHeaders:
                cherrypy.response.headers[name] = result.headers[name]

        # Append special header to all responses
        cherrypy.response.headers["X-Jasy-Version"] = jasy.__version__
        
        # Enable cross domain access to this server
        enableCrossDomain()

        return result.content
        
        
class Static(object):
    
    def __init__(self, id, config, contentTypes=None):
        self.id = id
        self.config = config
        self.contentTypes = contentTypes
        self.root = getKey(config, "root", ".")
        self.enableDebug = getKey(config, "debug", False)

        Console.info('Static "%s" => "%s" [debug:%s]', self.id, self.root, self.enableDebug)
        
    @cherrypy.expose
    def default(self, *args, **query):
        """
        This method returns the content of existing files on the file system.
        Query string might be used for cache busting and are otherwise ignored.
        """
        
        # Append special header to all responses
        cherrypy.response.headers["X-Jasy-Version"] = jasy.__version__
        
        # Enable cross domain access to this server
        enableCrossDomain()
        
        # When it's a file name in the local folder... load it
        if args:
            path = os.path.join(*args)
        else:
            path = "index.html"
        
        path = os.path.join(self.root, path)
        
        # Check for existance first
        if os.path.isfile(path):
            if self.enableDebug:
                Console.info("Serving file: %s", path)

            # Default content type to autodetection by Python mimetype API            
            contentType = None

            # Support overriding by extensions
            extension = os.path.splitext(path)[1]
            if extension:
                extension = extension.lower()[1:]
                if extension in self.contentTypes:
                    contentType = self.contentTypes[extension]

            return cherrypy.lib.static.serve_file(os.path.abspath(path), content_type=contentType)
            
        # Otherwise return a classic 404
        else:
            if self.enableDebug:
                Console.warn("File at location %s not found at %s!", path, os.path.abspath(path))
            
            raise cherrypy.NotFound(path)
        
# 
# ADDITIONAL MIME TYPES
# 

additionalContentTypes = {
    "js": "application/javascript",
    "jsonp": "application/javascript",
    "json": "application/json",
    "oga": "audio/ogg",
    "ogg": "audio/ogg",
    "m4a": "audio/mp4",
    "f4a": "audio/mp4",
    "f4b": "audio/mp4",
    "ogv": "video/ogg",
    "mp4": "video/mp4",
    "m4v": "video/mp4",
    "f4v": "video/mp4",
    "f4p": "video/mp4",
    "webm": "video/webm",
    "flv": "video/x-flv",
    "svg": "image/svg+xml",
    "svgz": "image/svg+xml",
    "eot": "application/vnd.ms-fontobject",
    "ttf": "application/x-font-ttf",
    "ttc": "application/x-font-ttf",
    "otf": "font/opentype",
    "woff": "application/x-font-woff",
    "ico": "image/x-icon",
    "webp": "image/webp",
    "appcache": "text/cache-manifest",
    "manifest": "text/cache-manifest",
    "htc": "text/x-component",
    "rss": "application/xml",
    "atom": "application/xml",
    "xml": "application/xml",
    "rdf": "application/xml",
    "crx": "application/x-chrome-extension",
    "oex": "application/x-opera-extension",
    "xpi": "application/x-xpinstall",
    "safariextz": "application/octet-stream",
    "webapp": "application/x-web-app-manifest+json",
    "vcf": "text/x-vcard",
    "swf": "application/x-shockwave-flash",
    "vtt": "text/vtt"
}



#
# START
#

def serve(routes=None, customContentTypes=None, port=8080, host="127.0.0.1"):
    """Starts the built-in HTTP server inside the project's root directory"""
    
    Console.header("HTTP Server")
    
    # Shared configuration (global/app)
    config = {
        "global" : {
            "environment" : "production",
            "log.screen" : False,
            "server.socket_port": port,
            "server.socket_host": host,
            "engine.autoreload_on" : False
        },
        
        "/" : {
            "log.screen" : False
        }
    }

    # Build dict of content types to override native mimetype detection
    contentTypes = {}
    contentTypes.update(additionalContentTypes)
    if customContentTypes:    
            contentTypes.update(customContentTypes)

    # Update global config
    cherrypy.config.update(config)

    # Somehow this screen disabling does not work
    # This hack to disable all access/error logging works
    def empty(*param, **args): pass
    def inspect(*param, **args): 
        if args["severity"] > 20:
            Console.error("Critical error occoured:")
            Console.error(param[0])
    
    cherrypy.log.access = empty
    cherrypy.log.error = inspect
    cherrypy.log.screen = False

    # Initialize routing
    Console.info("Initialize routing...")
    Console.indent()
    root = Static("/", {}, contentTypes=contentTypes)
    if routes:
        for key in routes:
            entry = routes[key]
            if "host" in entry:
                node = Proxy(key, entry)
            else:
                node = Static(key, entry, contentTypes=contentTypes)
            
            setattr(root, key, node)
    Console.outdent()
    
    # Finally start the server
    app = cherrypy.tree.mount(root, "", config)
    cherrypy.process.plugins.PIDFile(cherrypy.engine, "jasylock-http-%s" % port).subscribe()
    
    cherrypy.engine.start()
    Console.info("Started HTTP server at port %s... [PID=%s]", port, os.getpid())
    Console.indent()
    cherrypy.engine.block()

    Console.outdent()
    Console.info("Stopped HTTP server at port %s.", port)

