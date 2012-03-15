#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

from jasy.js.api.Data import ApiData
from jasy.core.Markdown import markdown
from jasy.core.Item import Item

class Doc(Item):
    
    kind = "doc"
    
    def getApi(self):
        field = "api[%s]" % self.id
        apidata = self.project.getCache().read(field, self.getModificationTime())
        
        if apidata is None:
            apidata = ApiData(self.id)
            apidata.main["type"] = "Package"
            apidata.main["doc"] = markdown(self.getText())
            
            self.project.getCache().store(field, apidata, self.getModificationTime())

        return apidata
        