#!/usr/bin/env python3

import os
import cherrypy
from cherrypy.lib.static import serve_file
import requests
import logging
import jasy


#
# LOGGING
#

logging.basicConfig(level=logging.DEBUG, format="%(message)s")
logging.getLogger().handlers[0].setLevel(logging.DEBUG)


#
# CROSS DOMAIN
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





#
# REMOTE
#

class Remote():

	# These headers will be blocked between header copies
	block = set(["content-encoding", "content-length", "connection", "keep-alive", "proxy-authenticate", "proxy-authorization", "transfer-encoding", "remote-addr", "host"])

	@cherrypy.expose()
	def default(self, *args, **query):
		"""
		This method loads remote URLs and returns their content
		"""

		# TODO: HTTPS, POST
		
		# Build header data
		headers = {name: cherrypy.request.headers[name] for name in cherrypy.request.headers if not name.lower() in self.block}
		url = "http://%s" % "/".join(args)
		result = requests.get(url, params=query, headers=headers)
		
		# Copy response headers to our reponse
		for name in result.headers:
			if not name in self.block:
				cherrypy.response.headers[name] = result.headers[name]

		# Apply headers for basic HTTP authentification
		if "X-Proxy-Authorization" in result.headers:
			cherrypy.response.headers["Authorization"] = result.headers["X-Proxy-Authorization"]
			del cherrypy.response.headers["X-Proxy-Authorization"]

		# Enable cross domain access
		enableCrossDomain()
		
		return result.content



#
# ROOT
#

class Root(object):
	
	remote = Remote()
	
	@cherrypy.expose()
	def index(self):
		return "Jasy %s Server" % jasy.__version__

	@cherrypy.expose()
	def default(self, *args):
		"""
		This method returns the content of existing files on the file system
		"""
		
		# Enable cross domain access
		enableCrossDomain()
		
		target = os.path.join(*args)
		
		if os.path.exists(target):
			return serve_file(os.path.abspath(target))
		else:
			raise cherrypy.NotFound()


#
# START
#

cherrypy.quickstart(Root())
