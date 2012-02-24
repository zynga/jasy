#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Sebastian Werner
#

import logging, re


__all__ = ["markdown2html", "code2highlight"]


# Try two alternative implementations
try:
    import misaka

    misakaExt = misaka.EXT_AUTOLINK | misaka.EXT_NO_INTRA_EMPHASIS | misaka.EXT_FENCED_CODE
    misakaRender = misaka.HTML_SKIP_STYLE | misaka.HTML_SMARTYPANTS
    
    def markdown2html(markdownStr):
        return misaka.html(markdownStr, misakaExt, misakaRender)

    logging.debug("Using high performance C-based Markdown implementation")
    
except ImportError as ex:
     
    try:
    
        import markdown
    
        def markdown2html(markdownStr):
            return markdown.markdown(markdownStr)

        logging.debug("Using Python Markdown implementation.")
        
    except:
        
        def markdown2html(markdownStr):
            return markdownStr

        logging.error("Missing Markdown implementation. Please install Misaka (preferred) or Python-Markdown.")




try:
    # http://misaka.61924.nl/#toc_3
    
    from pygments import highlight
    from pygments.formatters import HtmlFormatter
    from pygments.lexers import get_lexer_by_name

    codeblock = re.compile(r'<pre(?: lang="([a-z0-9]+)")?><code(?: class="([a-z0-9]+).*?")?>(.*?)</code></pre>', re.IGNORECASE | re.DOTALL)

    def code2highlight(html):
        def _unescape_html(html):
            html = html.replace('&lt;', '<')
            html = html.replace('&gt;', '>')
            html = html.replace('&amp;', '&')
            return html.replace('"', '"')
        
        def _highlight_match(match):
            language, classname, code = match.groups()
            
            # default to Javascript
            if (language or classname) is None:
                language = "javascript"
                
            return highlight(_unescape_html(code), get_lexer_by_name(language or classname or "javascript"), HtmlFormatter(linenos="table"))
            
        return codeblock.sub(_highlight_match, html)
        

except ImportError as ex:
    
    def code2highlight(html):
        return html
    
    logging.error("Syntax highlighting is disabled because Pygments is missing.")
    

