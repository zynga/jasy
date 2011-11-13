#
# Jasy - JavaScript Tooling Framework
# Copyright 2010-2011 Sebastian Werner
#

import shelve, time, logging, os, os.path, sys, pickle, dbm

class Cache:
    """ 
    A cache class based on shelve feature of Python. 
    Supports transient only in-memory storage, too.
    """
    
    __db = None
    
    def __init__(self, path, clear=False):
        self.__transient = {}
        self.__file = os.path.join(path, "jasycache")
        
        try:
            self.__db = shelve.open(self.__file, flag="c")
        except dbm.error as error:
            errno = None
            try:
                errno = error.errno
            except:
                pass
                
            if errno is 35:
                raise IOError("Cache file is locked by another process!")
            elif "db type could not be determined" in str(error):
                logging.error("Could not detect cache file format!")
                logging.warn("Recreating cache database...")
                self.clear()
            else:
                raise error
    
    
    def clear(self):
        if self.__db != None:
            logging.debug("Closing cache file %s..." % self.__file)
            
            self.__db.close()
            self.__db = None

        logging.info("Clearing cache file %s..." % self.__file)
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
        self.__db.sync() 
      
      
    def close(self):
        """ Closes the internal storage database """
        self.__db.close()         
        
      