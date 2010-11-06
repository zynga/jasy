#!/usr/bin/env python3

import json, sys, os

output = {}
for dirPath, dirNames, fileNames in os.walk("."):
    for fileName in fileNames:
        if fileName.endswith(".meta"):
            data = json.loads(open(fileName).read())

            for fullsingle in data:
              basesingle = fullsingle[fullsingle.rfind("/")+1:]
      
              value = data[fullsingle]
      
              fullsprite = value[3]
              basesprite = fullsprite[fullsprite.rfind("/")+1:]
      
              if not basesprite in output:
                  output[basesprite] = {}
          
              offset = value[4:6]
      
              if offset[0] < 0:
                  offset[0] *= -1
      
              if offset[1] < 0:
                  offset[1] *= -1
      
              output[basesprite][basesingle] = offset

outputFile = open("sprites.json", "w")
outputFile.write(json.dumps(output, sort_keys=True))
outputFile.close()
