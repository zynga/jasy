#!/usr/bin/env python3

import sys, os, unittest, logging, tempfile

# Extend PYTHONPATH with local 'lib' folder
if __name__ == "__main__":
    jasyroot = os.path.normpath(os.path.join(os.path.abspath(sys.argv[0]), os.pardir, os.pardir, os.pardir))
    sys.path.insert(0, jasyroot)
    print("Running from %s..." % jasyroot)

import jasy.core.Config as Config

class Tests(unittest.TestCase):

    def test_write_json(self):

        tempDirectory = tempfile.TemporaryDirectory().name
        os.makedirs(tempDirectory)

        Config.writeConfig([{"one": 1,"two": 2},{"three": 3,"four": 4}], os.path.join(tempDirectory, "test.json"))
        
        self.assertEqual(Config.findConfig(os.path.join(tempDirectory, "test.json")), os.path.join(tempDirectory, "test.json"))        
       
       
    def test_write_and_read_json(self):

        tempDirectory = tempfile.TemporaryDirectory().name
        os.makedirs(tempDirectory)

        Config.writeConfig([{"one": 10-9,"two": 5-3},{"three": 1+1+1,"four": 2*2}], os.path.join(tempDirectory, "test.json"))
        data = Config.loadConfig(os.path.join(tempDirectory, "test.json"))

        self.assertEqual(data, [{'two': 2, 'one': 1}, {'four': 4, 'three': 3}])        
       

    def test_write_yaml(self):

        tempDirectory = tempfile.TemporaryDirectory().name
        os.makedirs(tempDirectory)

        Config.writeConfig([{"one": 1,"two": 2},{"three": 3,"four": 4}], os.path.join(tempDirectory, "test.yaml"))
        
        self.assertEqual(Config.findConfig(os.path.join(tempDirectory, "test.yaml")), os.path.join(tempDirectory, "test.yaml"))        
    

    def test_write_and_read_json(self):

        tempDirectory = tempfile.TemporaryDirectory().name
        os.makedirs(tempDirectory)

        Config.writeConfig([{"one": 10-9,"two": 5-3},{"three": 1+1+1,"four": 2*2}], os.path.join(tempDirectory, "test.yaml"))
        data = Config.loadConfig(os.path.join(tempDirectory, "test.yaml"))

        self.assertEqual(data, [{'two': 2, 'one': 1}, {'four': 4, 'three': 3}]) 


    def test_matching_types(self):

        self.assertTrue(Config.matchesType(42, "int"))
        self.assertTrue(Config.matchesType(11.0, "float"))
        self.assertTrue(Config.matchesType(11.1, "float"))
        self.assertTrue(Config.matchesType("hello", "string"))
        self.assertTrue(Config.matchesType(False, "bool"))
        self.assertTrue(Config.matchesType([{"one": 10-9,"two": 5-3},{"three": 1+1+1,"four": 2*2}], "list"))
        self.assertTrue(Config.matchesType({"one": 10-9,"two": 5-3}, "dict"))
    

    def test_config_object_hasdata(self):

        config = Config.Config({'two': 2, 'one': 1, 'ten': 10})
        self.assertTrue(config.has('two'))


    def test_config_object_getdata(self):

        config = Config.Config({'two': 2, 'one': 1, 'ten': 10})
        self.assertEqual(config.get('ten'), 10)


    def test_config_object_setdata(self):

        config = Config.Config({'two': 2, 'one': 1, 'ten': 10})
        config.set('ten', 15)
        self.assertEqual(config.get('ten'), 15)


    def test_config_object_getdata_withdot(self):

        config = Config.Config({'foo': {'yeah': 42}, 'one': 1})
        self.assertEqual(config.get('foo.yeah'), 42)


    def test_config_object_setdata_withdot(self):

        config = Config.Config({'foo': {'yeah': 42}, 'one': 1})
        config.set('foo.yeah', 1337)
        self.assertEqual(config.get('foo')['yeah'], 1337)


if __name__ == '__main__':
    logging.getLogger().setLevel(logging.ERROR)
    suite = unittest.TestLoader().loadTestsFromTestCase(Tests)
    unittest.TextTestRunner(verbosity=2).run(suite)

