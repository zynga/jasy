#!/usr/bin/env python3

import sys, os, unittest, logging

# Extend PYTHONPATH with local 'lib' folder
jasyroot = os.path.normpath(os.path.join(os.path.abspath(sys.argv[0]), os.pardir, os.pardir, os.pardir))
sys.path.insert(0, jasyroot)

import jasy.vcs.Repository as Repository


class Tests(unittest.TestCase):

    def test_git_urls(self):
        
        self.assertEqual(Repository.isUrl("foo"), False)
        self.assertEqual(Repository.isUrl("../bar"), False)
        self.assertEqual(Repository.isUrl("https://faz.net?x=1"), False)
        self.assertEqual(Repository.isUrl("git@github.com:zynga/apibrowser.git"), True)
        self.assertEqual(Repository.isUrl("https://github.com/zynga/core"), False)
        self.assertEqual(Repository.isUrl("git+https://github.com/zynga/core"), True)
        self.assertEqual(Repository.isUrl("https://github.com/zynga/core.git"), True)
        self.assertEqual(Repository.isUrl("git+https://github.com/zynga/core.git"), True)
        self.assertEqual(Repository.isUrl("https://wpbasti@github.com/zynga/apibrowser.git"), True)
        self.assertEqual(Repository.isUrl("git://github.com/zynga/core.git"), True)
        self.assertEqual(Repository.isUrl("git://gitorious.org/qt/qtdeclarative.git"), True)
        self.assertEqual(Repository.isUrl("git+git://gitorious.org/qt/qtdeclarative.git"), True)
        self.assertEqual(Repository.isUrl("https://git.gitorious.org/qt/qtdeclarative.git"), True)
    


if __name__ == '__main__':
    logging.getLogger().setLevel(logging.ERROR)
    suite = unittest.TestLoader().loadTestsFromTestCase(Tests)
    unittest.TextTestRunner(verbosity=2).run(suite)
