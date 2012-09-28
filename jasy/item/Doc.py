#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

import jasy.js.api.Data as Data
import jasy.core.Text as Text
import jasy.item.Abstract as Abstract

from jasy import UserError

class DocItem(Abstract.AbstractItem):
    
    kind = "doc"
    
    def getApi(self):
        field = "api[%s]" % self.id
        apidata = self.project.getCache().read(field, self.getModificationTime())
        
        if not Text.supportsMarkdown:
            raise UserError("Missing Markdown feature to convert package docs into HTML.")
        
        if apidata is None:
            apidata = Data.ApiData(self.id)
            apidata.main["type"] = "Package"
            apidata.main["doc"] = Text.highlightCodeBlocks(Text.markdownToHtml(self.getText()))
            
            self.project.getCache().store(field, apidata, self.getModificationTime())

        return apidata
        