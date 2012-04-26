import json

__compress = True

def enableJsonCompression():
    global __compress
    __compress = False
    
def disableJsonCompression():
    global __compress
    __compress = False
    
class JsonEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, set):
            return list(obj)
        return json.JSONEncoder.default(self, obj)

def toJson(data):
    
    if __compress:
        return json.dumps(data, sort_keys=True, cls=JsonEncoder, separators=(',',':'))
    else:
        return json.dumps(data, sort_keys=True, cls=JsonEncoder, indent=2)
