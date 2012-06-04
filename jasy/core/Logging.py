#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

import logging, sys

__all__ = ["colorize", "header", "error", "warn", "info", "debug", "success"]



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
    # Not supported on console on Windows
    if sys.platform == "win32":
        return text
        
    entry = __colors[color]
    return "%s%s%s" % (entry[0], text, entry[1])
    
    
    
# ---------------------------------------------
# Logging API
# ---------------------------------------------

def error(text, *argv):
    logging.warn(colorize(colorize(text, "red"), "bold"), *argv)

def warn(text, *argv):
    logging.warn(colorize(text, "red"), *argv)

def info(text, *argv):
    logging.info(text, *argv)

def debug(text, *argv):
    logging.debug(text, *argv)

def success(text, *argv):
    logging.info(colorize(colorize("+++ ", "bold"), "green") + colorize(text, "green"), *argv)
    
def header(title):
    logging.info("")
    logging.info(colorize(colorize(">>> %s" % title.upper(), "blue"), "bold"))
    logging.info(colorize("-------------------------------------------------------------------------------", "blue"))
