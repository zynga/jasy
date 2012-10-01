#!/usr/bin/env python3

import sys, os, unittest, logging, pkg_resources, tempfile

# Extend PYTHONPATH with local 'lib' folder
jasyroot = os.path.normpath(os.path.join(os.path.abspath(sys.argv[0]), os.pardir, os.pardir, os.pardir))
sys.path.insert(0, jasyroot)

import jasy.core.Project as Project
import jasy.core.Session as Session

globProject = None


class Tests(unittest.TestCase):

    def writeFile(self, path, fileName, content):
        handle = open(os.path.join(path, fileName), mode="w", encoding="utf-8")
        handle.write(content)
        handle.close()

    def readFile(self, path, fileName):
        return open(os.path.join(path, fileName), mode="r", encoding="utf-8").read()

    def createjpyaml(self, path, requirements):
        content = """name: myproject
fields:
  debug: {check: "Boolean", default: False, values: [True, False]}
  engine: {check: ["webkit", "gecko", "trident", "presto"], default: "trident", values: ["webkit", "gecko", "trident", "presto"]}
requires:"""
        for r in requirements:
            content += r
        self.writeFile(path, "jasyproject.yaml",  content)
        #print(content)

    def createRequirement(self, name, manPath=None):
        if manPath is not None:
            reqpath = os.path.join(manPath, name)
        else:
            reqpath = os.path.join(tempfile.TemporaryDirectory().name, name)
        try:
            os.makedirs(os.path.join(reqpath, "class"))
        except OSError as e:
            pass

        self.writeFile(os.path.join(reqpath, "class"), "Base.js", ";")
        ruquirement = ("""
- source: %s
  config:
    name: %s""" % (reqpath, name))

        return ruquirement

    def createProject(self, requirements, onlyFileCreation=False):

        global globProject
        globProject = tempfile.TemporaryDirectory()

        path = os.path.join(globProject.name, "myproject")
        os.makedirs(path)

        def createFolders():
            os.makedirs(os.path.join(path, "source"))
            os.makedirs(os.path.join(os.path.join(path, "source"), "class"))
            os.makedirs(os.path.join(os.path.join(path, "source"), "asset"))
            os.makedirs(os.path.join(os.path.join(path, "source"), "translation"))

        def createSampleClasses():
            self.writeFile(os.path.join(path, "source"), "index.html", """<html></html>""")
            self.writeFile(os.path.join(os.path.join(path, "source"), "class"), "Main.js", ";")

        def createSampleAssets():
            self.writeFile(os.path.join(os.path.join(path, "source"), "asset"), "main.css", """html{}""")

        def createSampleTranslations():
            self.writeFile(os.path.join(os.path.join(path, "source"), "translation"), "de.po", " ")

        createFolders()
        self.createjpyaml(path, requirements)
        createSampleClasses()
        createSampleAssets()
        createSampleTranslations()

        os.chdir(path)

        if onlyFileCreation:
            return path

        return Project.getProjectFromPath(path)

    def test_init(self):

        self.createProject([], onlyFileCreation=True)

        session = Session.Session()
        session.init()
        self.assertTrue(session.getProjectByName("myproject") is not None)


    def test_pause_resume(self):

        session = Session.Session()
        session.addProject(self.createProject([]))

        try:
            session.pause()
            session.resume()

            self.assertTrue(True)
        except:
            self.assertTrue(False)

    def test_other_process(self):

        project = self.createProject([])

        try:
            session = Session.Session()
            session.addProject(project)
            session2 = Session.Session()
            session2.addProject(project)
            session2.pause()
            session.resume()

            self.assertTrue(True)
        except:
            self.assertTrue(False)

        try:
            session = Session.Session()
            session.addProject(project)
            session2 = Session.Session()
            session2.addProject(project)
            session2.resume()

            self.assertTrue(False)
        except:
            self.assertTrue(True)

        try:
            session = Session.Session()
            session.addProject(project)
            session2 = Session.Session()
            session2.addProject(project)
            session2.close()
            session2.clean()

            self.assertTrue(False)
        except:
            self.assertTrue(True)

        try:
            session = Session.Session()
            session.addProject(project)
            session2 = Session.Session()
            session2.addProject(project)
            session2.close()
            session.clean()

            self.assertTrue(False)
        except:
            self.assertTrue(True)


    def test_load_library(self):
        path = os.path.join(globProject.name, "mylib")
        os.makedirs(path)
        self.writeFile(path, "MyScript.py", """
@share
def double(number):
    return number*2

@share
def pow(number):
    return number*number

def add(number):
    return number+1
""")
        session = Session.Session()
        env = {}
        session.init(scriptEnvironment=env)

        session.loadLibrary("MyScript", os.path.join(path, "MyScript.py"))

        self.assertEqual(env["MyScript"].double(5), 10)
        self.assertEqual(env["MyScript"].pow(4), 16)

        try:
            env["MyScript"].add(8)

            self.assertTrue(False)
        except:
            self.assertTrue(True)


    def test_field(self):
        session = Session.Session()
        session.addProject(self.createProject([]))

        self.assertEqual(session.exportFields(),'[[\'debug\', 2, false], [\'engine\', 2, "trident"]]')

    
    def test_set_field(self):
        session = Session.Session()
        session.addProject(self.createProject([]))

        session.setField("debug", True)
        self.assertEqual(session.exportFields(),'[[\'debug\', 2, true], [\'engine\', 2, "trident"]]')

    
    def test_set_permutation(self):
        session = Session.Session()
        session.addProject(self.createProject([]))

        session.permutateField("debug", values=[False, True], detect=None, default=True)
        session.permutateField("engine", values=["webkit", "gecko", "trident", "presto"], detect=None, default="gecko")

        self.assertEqual(session.exportFields(),'[[\'debug\', 2, true], [\'engine\', 2, "gecko"]]')  

        session.permutateField("engine", values=["webkit"], detect=None, default="webkit")

        self.assertEqual(session.exportFields(),'[[\'debug\', 2, true], [\'engine\', 2, "webkit"]]')  

    
    def test_permutate(self):
        session = Session.Session()
        session.addProject(self.createProject([]))

        counter = 0
        for p in session.permutate():
            counter += 1
        self.assertEqual(counter, 8)

        session.permutateField("engine", values=["webkit", "gecko", "trident"])
        counter = 0
        for p in session.permutate():
            counter += 1
        self.assertEqual(counter, 6)

        session.setField("debug", True)
        counter = 0
        for p in session.permutate():
            counter += 1
        self.assertEqual(counter, 3)


    def test_locale(self):
        session = Session.Session()
        session.addProject(self.createProject([]))

        session.setLocales(["de", "en_", "fr"])

        counter = 0
        for p in session.permutate():
            counter += 1
        self.assertEqual(counter, 24)


if __name__ == '__main__':
    logging.getLogger().setLevel(logging.ERROR)
    suite = unittest.TestLoader().loadTestsFromTestCase(Tests)
    unittest.TextTestRunner(verbosity=2).run(suite)
