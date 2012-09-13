#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

import json

__all__ = ["toJson"]

class JsonEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, set):
            return list(obj)
            
        return json.JSONEncoder.default(self, obj)

def toJson(data, compress):
    
    if compress:
        return json.dumps(data, sort_keys=True, cls=JsonEncoder, separators=(',',':'))
    else:
        return json.dumps(data, sort_keys=True, cls=JsonEncoder, indent=2)
