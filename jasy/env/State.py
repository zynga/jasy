#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

# Globally available session object
session = None

def initSession(api):
    global session

    import jasy.env.Session as Session
    session = Session.Session(api)
