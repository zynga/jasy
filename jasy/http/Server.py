#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

import os, logging, base64, json, requests, cherrypy, locale
from collections import namedtuple

import jasy.core.Cache as Cache
import jasy.core.Console as Console

from jasy.core.Types import CaseInsensitiveDict
from jasy.core.Util import getKey
from jasy import __version__ as jasyVersion

Result = namedtuple('Result', ['headers', 'content'])

# Disable logging HTTP request being created
logging.getLogger("requests").setLevel(logging.WARNING)


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

def noBodyProcess():
    cherrypy.request.process_request_body = False

cherrypy.tools.noBodyProcess = cherrypy.Tool('before_request_body', noBodyProcess)


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
    @cherrypy.tools.noBodyProcess()
    def default(self, *args, **query):
        """
        This method returns the content of existing files on the file system.
        Query string might be used for cache busting and are otherwise ignored.
        """
        
        url = self.config["host"] + "/".join(args)
        result = None
        body = None
        
        # Try using offline mirror if feasible
        if self.enableMirror and cherrypy.request.method == "GET":
            mirrorId = "%s[%s]" % (url, json.dumps(query, separators=(',',':'), sort_keys=True))
            result = self.mirror.read(mirrorId)
            if result is not None and self.enableDebug:
                Console.info("Mirrored: %s" % url)
            
        if cherrypy.request.method in ("POST", "PUT"):
            body = cherrypy.request.body.fp.read()
         
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
                result = requests.request(cherrypy.request.method, url, params=query, headers=headers, data=body, verify=False)
                
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
        cherrypy.response.headers["X-Jasy-Version"] = jasyVersion
        
        # Enable cross domain access to this server
        enableCrossDomain()

        return result.content
        
        
class Static(object):
    
    def __init__(self, id, config, mimeTypes=None):
        self.id = id
        self.config = config
        self.mimeTypes = mimeTypes
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
        cherrypy.response.headers["X-Jasy-Version"] = jasyVersion
        
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
                if extension in self.mimeTypes:
                    contentType = self.mimeTypes[extension] + "; charset=" + locale.getpreferredencoding()

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

class Server:
    """Starts the built-in HTTP server inside the project's root directory"""

    def __init__(self, port=8080, host="127.0.0.1", mimeTypes=None):

        Console.info("Initializing server...")
        Console.indent()

        # Shared configuration (global/app)
        self.__config = {
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

        self.__port = port

        # Build dict of content types to override native mimetype detection
        combinedTypes = {}
        combinedTypes.update(additionalContentTypes)
        if mimeTypes:    
            combinedTypes.update(mimeTypes)

        # Update global config
        cherrypy.config.update(self.__config)

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

        # Basic routing
        self.__root = Static("/", {}, mimeTypes=combinedTypes)

        Console.outdent()


    def setRoutes(self, routes):
        """
        Adds the given routes to the server configuration. Routes can be used
        to add special top level entries to the different features of the integrated
        webserver either mirroring a remote server or delivering a local directory.

        The parameters is a dict where every key is the name of the route
        and the value is the configuration of that route.
        """

        Console.info("Adding routes...")
        Console.indent()        

        for key in routes:
            entry = routes[key]
            if "host" in entry:
                node = Proxy(key, entry)
            else:
                node = Static(key, entry, mimeTypes=self.__root.mimeTypes)
            
            setattr(self.__root, key, node)

        Console.outdent()


    def start(self):
        """
        Starts the web server and blocks execution. 

        Note: This stops further execution of the current task or method.
        """

        app = cherrypy.tree.mount(self.__root, "", self.__config)
        cherrypy.process.plugins.PIDFile(cherrypy.engine, ".jasy/server-%s" % self.__port).subscribe()
        
        cherrypy.engine.start()
        Console.info("Started HTTP server at port %s... [PID=%s]", self.__port, os.getpid())
        Console.indent()
        cherrypy.engine.block()

        Console.outdent()
        Console.info("Stopped HTTP server at port %s.", self.__port)  

