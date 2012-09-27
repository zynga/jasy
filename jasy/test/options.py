#!/usr/bin/env python3

import sys, os, unittest, logging

# Extend PYTHONPATH with local 'lib' folder
if __name__ == "__main__":
    jasyroot = os.path.normpath(os.path.join(os.path.abspath(sys.argv[0]), os.pardir, os.pardir, os.pardir))
    sys.path.insert(0, jasyroot)
    print("Running from %s..." % jasyroot)

import jasy.core.Options as Options


class Tests(unittest.TestCase):

    def test_add(self):

        options = Options.Options()
        options.add("file", accept=str, value="jasyscript.py", help="Use the given jasy script")
        self.assertEqual(options.__getattr__("file"), 'jasyscript.py')


    def test_parse(self):

        options = Options.Options()
        options.parse(['--file', 'bla'])
        self.assertEqual(options.__getattr__("file"), "bla")


    def test_add_and_parse(self):

        options = Options.Options()
        options.add("file", accept=str, value="jasyscript.py", help="Use the given jasy script")
        options.parse(['--file', 'foo'])
        self.assertEqual(options.__getattr__("file"), "foo") 


    def test_getTasks(self):

        options = Options.Options()
        options.parse(['source', '--file', 'foo'])
        self.assertEqual(options.getTasks()[0]['task'], 'source') 


if __name__ == '__main__':
    logging.getLogger().setLevel(logging.ERROR)
    suite = unittest.TestLoader().loadTestsFromTestCase(Tests)
    unittest.TextTestRunner(verbosity=2).run(suite)

