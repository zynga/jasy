#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

import shutil, json, base64, os, re, random, sys, mimetypes, http.client, urllib.parse, hashlib
import jasy.core.Console as Console

__all__ = ["requestUrl", "uploadData"]


#
# Generic HTTP support
#

def requestUrl(url, content_type="text/plain", headers=None, method="GET", port=None, body="", user=None, password=None):
    """Generic HTTP request wrapper with support for basic authentification and automatic parsing of response content"""
    
    Console.info("Opening %s request to %s..." % (method, url))

    parsed = urllib.parse.urlparse(url)
    
    if parsed.scheme== "http":
        request = http.client.HTTPConnection(parsed.netloc)
    elif parsed.scheme== "https":
        request = http.client.HTTPSConnection(parsed.netloc)
    else:
        raise Exception("Unsupported url: %s" % url)
    
    if parsed.query:
        request.putrequest(method, parsed.path + "?" + parsed.query)
    else:
        request.putrequest(method, parsed.path)
    
    request.putheader("Content-Type", content_type)
    request.putheader("Content-Length", str(len(body)))

    if user is not None and password is not None:
        auth = "Basic %s" % base64.b64encode(("%s:%s" % (user, password)).encode("utf-8")).decode("utf-8")
        request.putheader("Authorization", auth)
        
    request.endheaders()
    
    if body:
        Console.info("Sending data (%s bytes)..." % len(body))
    else:
        Console.info("Sending request...")

    Console.indent()

    request.send(body)

    response = request.getresponse()
    
    res_code = int(response.getcode())
    res_headers = dict(response.getheaders())
    res_content = response.read()
    res_success = False
    
    if res_code >= 200 and res_code <= 300:
        Console.debug("HTTP Success!")
        res_success = True
    else:
        Console.error("HTTP Failure Code: %s!", res_code)
        
    if "Content-Type" in res_headers:
        res_type = res_headers["Content-Type"]
        
        if ";" in res_type:
            res_type = res_type.split(";")[0]
            
        if res_type in ("application/json", "text/html", "text/plain"):
            res_content = res_content.decode("utf-8")

        if res_type == "application/json":
            res_content = json.loads(res_content)
            
            if "error" in res_content:
                Console.error("Error %s: %s", res_content["error"], res_content["reason"])
            elif "reason" in res_content:
                Console.info("Success: %s" % res_content["reason"])
                
    Console.outdent()
    
    return res_success, res_headers, res_content




#
# Multipart Support
#

def uploadData(url, fields, files, user=None, password=None, method="POST"):
    """Easy wrapper for uploading content via HTTP multi part"""
    
    content_type, body = encode_multipart_formdata(fields, files)
    return requestUrl(url, body=body, content_type=content_type, method=method, user=user, password=password)


def choose_boundary():
    """Return a string usable as a multipart boundary."""
    
    # Follow IE and Firefox
    nonce = "".join([str(random.randint(0, sys.maxsize-1)) for i in (0,1,2)])
    return "-"*27 + nonce


def get_content_type(filename):
    """Figures out the content type of the given file"""
    
    return mimetypes.guess_type(filename)[0] or "application/octet-stream"


def encode_multipart_formdata(fields, files):
    """Encodes given fields and files to a multipart ready HTTP body"""

    # Choose random boundary
    boundary = choose_boundary()

    # Build HTTP content type with generated boundary
    content_type = "multipart/form-data; boundary=%s" % boundary
    
    # Join all fields and files into one collection of lines
    lines = []

    for (key, value) in fields:
        lines.append("--" + boundary)
        lines.append('Content-Disposition: form-data; name="' + key + '"')
        lines.append("")
        lines.append(value)

    for (key, filename, value) in files:
        lines.append("--" + boundary)
        lines.append('Content-Disposition: form-data; name="' + key + '"; filename="' + filename + '"')
        lines.append('Content-Type: ' + get_content_type(filename))
        lines.append("")
        lines.append(value)
        
    lines.append("--" + boundary + "--")
    lines.append("")
    
    # Encode and join all lines as ascii
    bytelines = [line if isinstance(line, bytes) else line.encode("ascii") for line in lines]
    body = "\r\n".encode("ascii").join(bytelines)
    
    return content_type, body

