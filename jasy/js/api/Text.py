import re

__all__ = ["extractSummary"]

# Used to filter first paragraph from HTML
paragraphExtract = re.compile(r"^(.*?)(\. |\? |\! )")
newlineMatcher = re.compile(r"\n")

# Used to remove markup sequences after doc processing of comment text
stripMarkup = re.compile(r"<.*?>")

def extractSummary(text):
    text = stripMarkup.sub("", newlineMatcher.sub(" ", text))
    matched = paragraphExtract.match(text)
    if matched:
        summary = matched.group(1)
        if summary is not None:
            if not summary.endswith((".", "!", "?")):
                summary = summary + "."
            return summary
            
    else:
        logging.debug("Unable to extract summary for: %s", text)
    
    return None