#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

import shelve, time, logging, os, os.path, sys, pickle, dbm
from jasy import __version__ as version

class Cache:
    """ 
    A cache class based on shelve feature of Python. Supports transient in-memory 
    storage, too. Uses memory storage for caching requests to DB as well for 
    improved performance. Uses keys for identification of entries like a normal
    hash table / dictionary.
    """
    
    __db = None
    
    def __init__(self, path, clear=False):
        self.__transient = {}
        self.__file = os.path.join(path, "jasycache")
        
        try:
            self.__db = shelve.open(self.__file, flag="c")
            
            if "jasy-version" in self.__db:
                storedVersion = self.__db["jasy-version"]
            else:
                storedVersion = None
                
            if storedVersion != version:
                logging.warn("Jasy version has been changed. Recreating cache...")
                self.clear()
            
        except dbm.error as error:
            errno = None
            try:
                errno = error.errno
            except:
                pass
                
            if errno is 35:
                raise IOError("Cache file is locked by another process! Maybe there is still another open Session/Project?")
                
            elif "db type could not be determined" in str(error):
                logging.error("Could not detect cache file format!")
                logging.warn("Recreating cache database...")
                self.clear()
                
            else:
                raise error
    
    
    def clear(self):
        """
        Clears the cache file through re-creation of the file
        """
        
        if self.__db != None:
            logging.debug("Closing cache file %s..." % self.__file)
            
            self.__db.close()
            self.__db = None

        logging.debug("Clearing cache file %s..." % self.__file)
        self.__db = shelve.open(self.__file, flag="n")
        self.__db["jasy-version"] = version
        
        
    def read(self, key, timestamp=None):
        """ 
        Reads the given value from cache.
        Optionally support to check wether the value was stored after the given 
        time to be valid (useful for comparing with file modification times).
        """
        
        if key in self.__transient:
            return self.__transient[key]
        
        timeKey = key + "-timestamp"
        if key in self.__db and timeKey in self.__db:
            if not timestamp or timestamp <= self.__db[timeKey]:
                value = self.__db[key]
                
                # Useful to debug serialized size. Often a performance
                # issue when data gets to big.
                # rePacked = pickle.dumps(value)
                # print("LEN: %s = %s" % (key, len(rePacked)))
                
                # Copy over value to in-memory cache
                self.__transient[key] = value
                return value
                
        return None
        
    
    def store(self, key, value, timestamp=None, transient=False):
        """
        Stores the given value.
        Default timestamp goes to the current time. Can be modified
        to the time of an other files modification date etc.
        """
        
        self.__transient[key] = value
        if transient:
            return
        
        if not timestamp:
            timestamp = time.time()
        
        try:
            self.__db[key+"-timestamp"] = timestamp
            self.__db[key] = value
        except pickle.PicklingError as err:
            logging.error("Failed to store enty: %s" % key)

        
    def sync(self):
        """ Syncs the internal storage database """
        
        if self.__db is not None:
            self.__db.sync() 
      
      
    def close(self):
        """ Closes the internal storage database """
        
        if self.__db is not None:
            self.__db.close()  
            self.__db = None       
        
      