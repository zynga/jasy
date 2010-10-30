#
# JavaScript Tools
# Copyright 2010 Sebastian Werner
#

import shelve, time, logging, os, os.path

class Cache:
    """ 
    A cache class based on shelve feature of Python. 
    Supports transient only in-memory storage, too.
    """
    
    def __init__(self, path, clear=False):
        self.__file = os.path.join(path, "cache")
        self.__transient = {}
        
        logging.debug("Cache File: %s" % self.__file)
        
        try:
            logging.debug("Open cache file %s..." % self.__file)
            self.__db = shelve.open(self.__file)
        except:
            logging.warn("Detected faulty cache files. Rebuilding...")
            self.clear()
    
    
    def clear(self):
        if hasattr(self, "__db"):
            self.__db.close()

        logging.debug("Initialize cache file %s..." % self.__file)
        self.__db = shelve.open(self.__file, flag="n")
        
        
    def read(self, key, timestamp=None):
        """ 
        Reads the given value from cache.
         
        Optional timestamp value checks wether the value was stored 
        after the given time to be valid.
        """
        
        if key in self.__transient:
            return self.__transient[key]
        
        timeKey = key + "-timestamp"
        if key in self.__db and timeKey in self.__db:
            if not timestamp or timestamp <= self.__db[timeKey]:
                # print("From Cache: %s" % key) 
                return self.__db[key]

        #print("None: %s" % key)
        return None
        
    
    def store(self, key, value, timestamp=None, transient=False):
        """
        Stores the given value.
        
        Default timestamp goes to the current time. Can be modified
        to the time of an other files modification date etc.
        """
        
        if transient:
            self.__transient[key] = value;
            return
        
        if not timestamp:
            timestamp = time.time()
        
        try:
            self.__db[key+"-timestamp"] = timestamp
            self.__db[key] = value
        except:
            # Ignore cache store errors
            pass
        
        
    def sync(self):
        """ Syncs the internal storage database """
        self.__db.sync() 
      
      
    def close(self):
        """ Closes the internal storage database """
        self.__db.close()         
        
      