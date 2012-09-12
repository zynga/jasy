#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

import logging, sys

__all__ = ["colorize", "header", "error", "warn", "info", "debug", "indent", "outdent"]



# ---------------------------------------------
# Colorized Output
# ---------------------------------------------

__colors = {
    'bold'      : ['\033[1m',  '\033[22m'],
    'italic'    : ['\033[3m',  '\033[23m'],
    'underline' : ['\033[4m',  '\033[24m'],
    'inverse'   : ['\033[7m',  '\033[27m'],

    'white'     : ['\033[37m', '\033[39m'],
    'grey'      : ['\033[90m', '\033[39m'],
    'black'     : ['\033[30m', '\033[39m'],

    'blue'      : ['\033[34m', '\033[39m'],
    'cyan'      : ['\033[36m', '\033[39m'],
    'green'     : ['\033[32m', '\033[39m'],
    'magenta'   : ['\033[35m', '\033[39m'],
    'red'       : ['\033[31m', '\033[39m'],
    'yellow'    : ['\033[33m', '\033[39m']
}

def colorize(text, color="red"):
    # Not supported on console on Windows native
    # Note: Cygwin has a different platform value
    if sys.platform == "win32":
        return text
        
    entry = __colors[color]
    return "%s%s%s" % (entry[0], text, entry[1])



# ---------------------------------------------
# Logging API
# ---------------------------------------------

__level = 0

def level(text):
    global __level
    
    if __level == 0 or text == "":
        return text
    elif __level == 1:
        return "- %s" % text
    else:
        return "%s- %s" % ("  " * (__level-1), text)

def indent():
    global __level
    __level += 1

def outdent(all=False):
    global __level
    
    if all:
        __level = 0
    else:
        __level -= 1
    
def error(text, *argv):
    logging.warn(level(colorize(colorize(text, "red"), "bold")), *argv)

def warn(text, *argv):
    logging.warn(level(colorize(text, "red")), *argv)

def info(text, *argv):
    logging.info(level(text), *argv)

def debug(text, *argv):
    logging.debug(level(text), *argv)

def header(title):
    global __level
    __level = 0
    
    logging.info("")
    logging.info(colorize(colorize(">>> %s" % title.upper(), "blue"), "bold"))
    logging.info(colorize("-------------------------------------------------------------------------------", "blue"))
