#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

import re
import jasy.core.Console as Console

__all__ = ["extractSummary"]

# Used to filter first paragraph from HTML
paragraphExtract = re.compile(r"^(.*?)(\. |\? |\! |$)")
newlineMatcher = re.compile(r"\n")

# Used to remove markup sequences after doc processing of comment text
stripMarkup = re.compile(r"<.*?>")

def extractSummary(text):
    try:
        text = stripMarkup.sub("", newlineMatcher.sub(" ", text))
        matched = paragraphExtract.match(text)
    except TypeError:
        matched = None
        
    if matched:
        summary = matched.group(1)
        if summary is not None:
            if not summary.endswith((".", "!", "?")):
                summary = summary.strip() + "."
            return summary
            
    else:
        Console.warn("Unable to extract summary for: %s", text)
    
    return None
    
