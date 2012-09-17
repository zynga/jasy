#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

"""
Centralized logging for complete Jasy environment.
"""

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
    """Uses to colorize the given text for output on Unix terminals"""

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

def __format(text):
    global __level
    
    if __level == 0 or text == "":
        return text
    elif __level == 1:
        return "- %s" % text
    else:
        return "%s- %s" % ("  " * (__level-1), text)

def indent():
    """
    Increments global indenting level. Prepends spaces to the next
    logging messages until outdent() is called.

    Should be called whenever leaving a structural logging section.
    """

    global __level
    __level += 1

def outdent(all=False):
    """
    Decrements global indenting level. 
    Should be called whenever leaving a structural logging section.
    """

    global __level
    
    if all:
        __level = 0
    else:
        __level -= 1
    
def error(text, *argv):
    """Outputs an error message (visible by default)"""

    logging.warn(__format(colorize(colorize(text, "red"), "bold")), *argv)

def warn(text, *argv):
    """Outputs an warning (visible by default)"""

    logging.warn(__format(colorize(text, "red")), *argv)

def info(text, *argv):
    """Outputs an info message (visible by default, disable via --quiet option)"""

    logging.info(__format(text), *argv)

def debug(text, *argv):
    """Output a debug message (hidden by default, enable via --verbose option)"""

    logging.debug(__format(text), *argv)

def header(title):
    """Outputs the given title with prominent formatting"""

    global __level
    __level = 0
    
    logging.info("")
    logging.info(colorize(colorize(">>> %s" % title.upper(), "blue"), "bold"))
    logging.info(colorize("-------------------------------------------------------------------------------", "blue"))
