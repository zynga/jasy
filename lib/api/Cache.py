#
# JavaScript Tools
# Copyright 2010 Sebastian Werner
#

import shelve, time, logging

class Cache:
    def __init__(self):
        self.__times = shelve.open("times")
        self.__data = shelve.open("data")
        
    
    def read(self, key, timestamp=None):
        """ 
        Reads the given value from cache.
         
        Optional timestamp value checks wether the value was stored 
        after the given time to be valid.
        """
        
        if key in self.__data:
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