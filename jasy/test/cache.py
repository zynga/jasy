#!/usr/bin/env python3

import sys, os, unittest, logging, tempfile

# Extend PYTHONPATH with local 'lib' folder
jasyroot = os.path.normpath(os.path.join(os.path.abspath(sys.argv[0]), os.pardir, os.pardir, os.pardir))
sys.path.insert(0, jasyroot)

import jasy.core.Cache as Cache

class Tests(unittest.TestCase):

    def test_store_and_read(self):

        tempDirectory = tempfile.TemporaryDirectory().name
        os.makedirs(tempDirectory)
        cache = Cache.Cache(tempDirectory)
        cache.store("test", 1337)
        self.assertEqual(cache.read("test"), 1337)

    def test_overwriting(self):

        tempDirectory = tempfile.TemporaryDirectory().name
        os.makedirs(tempDirectory)
        cache = Cache.Cache(tempDirectory)
        cache.store("test", 1337)
        self.assertEqual(cache.read("test"), 1337)
        cache.store("test", "yeah")
        self.assertEqual(cache.read("test"), "yeah")

    def test_close_and_reopen(self):

        tempDirectory = tempfile.TemporaryDirectory().name
        os.makedirs(tempDirectory)
        cache = Cache.Cache(tempDirectory)
        cache.store("test", 1337)
        self.assertEqual(cache.read("test"), 1337)
        cache.close()
        cache2 = Cache.Cache(tempDirectory)
        self.assertEqual(cache2.read("test"), 1337)   

    def test_clear(self):     

        tempDirectory = tempfile.TemporaryDirectory().name
        os.makedirs(tempDirectory)
        cache = Cache.Cache(tempDirectory)
        cache.store("test", 1337)
        self.assertEqual(cache.read("test"), 1337)
        cache.close()
        cache2 = Cache.Cache(tempDirectory)
        cache2.clear()      
        cache2.close()
        cache3 = Cache.Cache(tempDirectory)
        self.assertEqual(cache3.read("test"), None)   

    def test_store_iMfalse_and_read_iMtrue(self):

        tempDirectory = tempfile.TemporaryDirectory().name
        os.makedirs(tempDirectory)
        cache = Cache.Cache(tempDirectory)
        cache.store("test", 1337, inMemory=False)
        self.assertEqual(cache.read("test"), 1337)

    def test_store_iMfalse_and_read_iMfalse(self):

        tempDirectory = tempfile.TemporaryDirectory().name
        os.makedirs(tempDirectory)
        cache = Cache.Cache(tempDirectory)
        cache.store("test", 1337, inMemory=False)
        self.assertEqual(cache.read("test", inMemory=False), 1337)

    def test_store_iMtrue_and_read_iMfalse(self):

        tempDirectory = tempfile.TemporaryDirectory().name
        os.makedirs(tempDirectory)
        cache = Cache.Cache(tempDirectory)
        cache.store("test", 1337)
        self.assertEqual(cache.read("test", inMemory=False), 1337)

    def test_store_read_transient(self):

        tempDirectory = tempfile.TemporaryDirectory().name
        os.makedirs(tempDirectory)
        cache = Cache.Cache(tempDirectory)
        cache.store("test", 1337, transient=True, inMemory=False)
        self.assertEqual(cache.read("test", inMemory=False), None)


if __name__ == '__main__':
    logging.getLogger().setLevel(logging.ERROR)
    suite = unittest.TestLoader().loadTestsFromTestCase(Tests)
    unittest.TextTestRunner(verbosity=2).run(suite)

