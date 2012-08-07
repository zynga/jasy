import os
import jasy
import logging
import threading

import cherrypy
import requests

from cherrypy.lib.static import serve_file as serveFile
from cherrypy import log
from urllib.parse import urlparse

from jasy.core.Logging import info, header

# Disable logging HTTP request being created
requests_log = logging.getLogger("requests")
requests_log.setLevel(logging.WARNING)






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



# These headers will be blocked between header copies
blockHeaders = set(["content-encoding", "content-length", "connection", "keep-alive", "proxy-authenticate", "proxy-authorization", "transfer-encoding", "remote-addr", "host"])



def serveProxy(url, query, https=False):
    """
    This method loads remote URLs and returns their content
    """

    # Prepare request
    url = "http://%s" % url
    headers = {name: cherrypy.request.headers[name] for name in cherrypy.request.headers if not name.lower() in blockHeaders}

    # Load URL from remote host
    try:
        result = requests.get(url, params=query, headers=headers)
    except Exception as err:
        raise cherrypy.HTTPError(403)
    
    # Copy response headers to our reponse
    for name in result.headers:
        if not name in blockHeaders:
            cherrypy.response.headers[name] = result.headers[name]

    # Apply headers for basic HTTP authentification
    if "X-Proxy-Authorization" in result.headers:
        cherrypy.response.headers["Authorization"] = result.headers["X-Proxy-Authorization"]
        del cherrypy.response.headers["X-Proxy-Authorization"]

    return result.content
    
    

#
# ROOT
#

class Root(object):
    
    def __init__(self, routes):
        logging.info("Routes: %s " % routes)
        pass
        
    @cherrypy.expose()
    def default(self, *args, **query):
        """
        This method returns the content of existing files on the file system.
        Query string might be used for cache busting and are otherwise ignored.
        """
        
        # Append special header to all responses
        cherrypy.response.headers["X-Jasy-Version"] = jasy.__version__
        
        # Enable cross domain access
        enableCrossDomain()
        
        # Root index page
        if not args:
            return "Jasy %s" % jasy.__version__
        
        # When it's a file name in the local folder... load it
        path = os.path.join(*args)
        if os.path.exists(path):
            return serveFile(os.path.abspath(path))
            
        # Otherwise it might be a remote URL
        else:
            url = "/".join(args)
            return serveProxy(url, query, False)
        
        # Returns a classic 404
        raise cherrypy.NotFound()


#
# START
#

def empty(*param, **args):
    pass

def runServer(routes, port=8080):
    
    header("HTTP Server")
    logging.info("Started server at port: %s" % port)

    config = {
        "global" : {
            "environment" : "production",
            "log.screen" : False,
            "server.socket_port": port,
            "engine.autoreload_on" : False
        },
        
        "/" : {
            "log.screen" : False
        }
        
    }
    
    # Initialize global config
    cherrypy.config.update(config)

    # Somehow this screen disabling does not work
    # This hack to disable all access/error logging works
    cherrypy.log.access = empty
    cherrypy.log.error = empty
    cherrypy.log.screen = False

    # Initialize app
    app = cherrypy.tree.mount(Root(None), "", config)


    def log():
        pass
    
    cherrypy.engine.subscribe("main", log)

    
    # Start engine
    cherrypy.engine.start()
    cherrypy.engine.block()
    
    

