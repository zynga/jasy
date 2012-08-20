import os, json
from jasy.core.Error import JasyError

try:
    import yaml
except ImportError:
    yaml = None

def writeConfig(data, filename, indent=2, encoding="utf-8"):
    fileExt = os.path.splitext(filename)[1]
    fileHandle = open(filename, mode="w", encoding="utf-8")

    if fileExt == ".json":
        json.dump(data, fileHandle, indent=indent, ensure_ascii=False)
    elif fileExt == ".yaml":
        if yaml is None:
            raise JasyError("Unable to safe YAML. Python module is missing!")

        yaml.dump(data, fileHandle, default_flow_style=False, indent=indent, allow_unicode=True)
    else:
        raise JasyError("Unsupported file type: %s" % fileExt)

