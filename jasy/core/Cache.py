#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

import shelve, time, os, os.path, sys, pickle, dbm, uuid, hashlib, atexit

import jasy
import jasy.core.Util
import jasy.core.Console as Console

hostId = uuid.getnode()

class Cache:
    """ 
    A cache class based on shelve feature of Python. Supports transient in-memory 
    storage, too. Uses memory storage for caching requests to DB as well for 
    improved performance. Uses keys for identification of entries like a normal
    hash table / dictionary.
    """
    
    __shelve = None
    
    def __init__(self, path, filename="jasycache", hashkeys=False):
        self.__transient = {}
        self.__file = os.path.join(path, filename)
        self.__hashkeys = hashkeys

        self.open()

        # Be sure to correctly write down and close cache file on exit
        atexit.register(self.close)
        
        
    def open(self):
        """Opens a cache file in the given path"""
        
        try:
            self.__shelve = shelve.open(self.__file, flag="c")
            
            storedVersion = jasy.core.Util.getKey(self.__shelve, "jasy-version")
            storedHost = jasy.core.Util.getKey(self.__shelve, "jasy-host")
            
            if storedVersion == jasy.__version__ and storedHost == hostId:
                return
                    
            if storedVersion is not None or storedHost is not None:
                Console.debug("Jasy version or host has been changed. Recreating cache...")
            
            self.clear()

            self.__shelve["jasy-version"] = jasy.__version__
            self.__shelve["jasy-host"] = hostId
            
        except dbm.error as dbmerror:
            errno = None
            try:
                errno = dbmerror.errno
            except:
                pass
                
            if errno is 35:
                raise IOError("Cache file is locked by another process!")
                
            elif "type could not be determined" in str(dbmerror):
                Console.error("Could not detect cache file format: %s" % self.__file)
                Console.warn("Recreating cache database...")
                self.clear()
                
            elif "module is not available" in str(dbmerror):
                Console.error("Unsupported cache file format: %s" % self.__file)
                Console.warn("Recreating cache database...")
                self.clear()
                
            else:
                raise dbmerror
    
    
    def clear(self):
        """
        Clears the cache file through re-creation of the file
        """
        
        if self.__shelve != None:
            Console.debug("Closing cache file %s..." % self.__file)
            
            self.__shelve.close()
            self.__shelve = None

        Console.debug("Clearing cache file %s..." % self.__file)
        
        self.__shelve = shelve.open(self.__file, flag="n")

        self.__shelve["jasy-version"] = jasy.__version__
        self.__shelve["jasy-host"] = hostId
        
        
    def read(self, key, timestamp=None, inMemory=True):
        """ 
        Reads the given value from cache.
        Optionally support to check wether the value was stored after the given 
        time to be valid (useful for comparing with file modification times).
        """
        
        if self.__hashkeys:
            key = hashlib.sha1(key.encode("ascii")).hexdigest()

        if key in self.__transient:
            return self.__transient[key]
        
        timeKey = key + "-timestamp"
        if key in self.__shelve and timeKey in self.__shelve:
            if not timestamp or timestamp <= self.__shelve[timeKey]:
                value = self.__shelve[key]
                
                # Useful to debug serialized size. Often a performance
                # issue when data gets to big.
                # rePacked = pickle.dumps(value)
                # print("LEN: %s = %s" % (key, len(rePacked)))
                
                # Copy over value to in-memory cache
                if inMemory:
                    self.__transient[key] = value

                return value
                
        return None
        
    
    def store(self, key, value, timestamp=None, transient=False, inMemory=True):
        """
        Stores the given value.
        Default timestamp goes to the current time. Can be modified
        to the time of an other files modification date etc.
        Transient enables in-memory cache for the given value
        """
        
        if self.__hashkeys:
            key = hashlib.sha1(key.encode("ascii")).hexdigest()
        
        if inMemory:
            self.__transient[key] = value

        if transient:
            return
        
        if not timestamp:
            timestamp = time.time()
        
        try:
            self.__shelve[key+"-timestamp"] = timestamp
            self.__shelve[key] = value
        except pickle.PicklingError as err:
            Console.error("Failed to store enty: %s" % key)

        
    def sync(self):
        """ Syncs the internal storage database """
        
        if self.__shelve is not None:
            self.__shelve.sync() 
      
      
    def close(self):
        """ Closes the internal storage database """
        
        if self.__shelve is not None:
            self.__shelve.close()  
            self.__shelve = None

      
