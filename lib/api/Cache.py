#
# JavaScript Tools
# Copyright 2010 Sebastian Werner
#

import shelve, time, logging, os, os.path

class Cache:
    def __init__(self, path, clear=False):
        self.__timesFile = os.path.join(path, ".times")
        self.__dataFile = os.path.join(path, ".data")
        
        try:
            self.__times = shelve.open(self.__timesFile)
            self.__data = shelve.open(self.__dataFile)
        except:
            logging.warn("Invalid cache files. Clearing...")
            self.clear()
    
    
    def clear(self):
        logging.info("Rebuilding cache files...")
        self.__times = shelve.open(self.__timesFile, flag="n")
        self.__data = shelve.open(self.__dataFile, flag="n")
    
    
    def read(self, key, timestamp=None):
        """ 
        Reads the given value from cache.
         
        Optional timestamp value checks wether the value was stored 
        after the given time to be valid.
        """
        
        if key in self.__data and key in self.__times:
            if not timestamp or timestamp <= self.__times[key]:
                # print("From Cache: %s" % key) 
                return self.__data[key]

        #print("None: %s" % key)
        return None
        
    
    def store(self, key, value, timestamp=None):
        """
        Stores the given value.
        
        Default timestamp goes to the current time. Can be modified
        to the time of an other files modification date etc.
        """
        
        if not timestamp:
            timestamp = time.time()
        
        self.__times[key] = timestamp
        self.__data[key] = value
        
        
    def sync(self):
        """ Syncs the internal storage database """
        
        self.__times.sync()
        self.__data.sync() 
      
      
    def close(self):
        """ Closes the internal storage database """

        self.__times.close()
        self.__data.close()               