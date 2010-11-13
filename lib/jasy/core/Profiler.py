#
# Jasy - JavaScript Tooling Refined
# Copyright 2010 Sebastian Werner
#

import time, logging

__all__ = ["pstart", "pstop"]

__start = None

def pstart():
    global __start
    __start = time.time()
    
    
def pstop():
    global __start
    now = time.time()
    logging.info(" - in %sms" % int((now-__start)*1000))
    __start = now
    