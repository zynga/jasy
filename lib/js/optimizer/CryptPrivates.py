#
# JavaScript Tools - Optimizer/Crypter for private member names
# Copyright 2010 Sebastian Werner
#

import binascii, string

__all__ = ["optimize"]



#
# Public API
#



def optimize(node, id):
    print("Crypt privates for: %s" % id)
    
    
