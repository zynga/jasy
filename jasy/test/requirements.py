#!/usr/bin/env python3

import sys, os, unittest, logging, pkg_resources, tempfile

# Extend PYTHONPATH with local 'lib' folder
jasyroot = os.path.normpath(os.path.join(os.path.abspath(sys.argv[0]), os.pardir, os.pardir, os.pardir))
sys.path.insert(0, jasyroot)

import jasy.core.Project as Project
import jasy.core.Session as Session


class Tests(unittest.TestCase):

    def writeFile(self, path, fileName, content):
        handle = open(os.path.join(path, fileName), mode="w", encoding="utf-8")
        handle.write(content)
        handle.close()

    def readFile(self, path, fileName):
        return open(os.path.join(path, fileName), mode="r", encoding="utf-8").read()

    def createjpyaml(self, path, requirements):
        content = """name: myproject  
requires:"""
        for r in requirements:
            content += r
        self.writeFile(path, "jasyproject.yaml",  content)
        #print(content)

    def createRequirement(self, name, subrequirements=None, manPath=None):
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


        if subrequirements is not None:
            ruquirement += """
    requires:"""
            for s in subrequirements:
                ruquirement += s;

        return ruquirement

    def createSubRequirement(self, name, manPath=None):
        if manPath is not None:
            reqpath = os.path.join(manPath, name)
        else:
            reqpath = os.path.join(tempfile.TemporaryDirectory().name, name)
        try:
            os.makedirs(os.path.join(reqpath, "class"))
        except OSError as e:
            pass

        self.writeFile(os.path.join(reqpath, "class"), "Base.js", ";")
        return("""
    - source: %s
      config:
      name: %s""" % (reqpath, name))


    def createProject(self, requirements):

        self.createRequirement("bob")

        path = os.path.join(tempfile.TemporaryDirectory().name, "myproject")
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

        return Project.getProjectFromPath(path)


    def test_has_requires(self):
        project = self.createProject([self.createRequirement("engine"), self.createRequirement("engine2")])
        project.scan()
        self.assertEqual(project.hasRequires(), True)

    def test_requires(self):
        project = self.createProject([self.createRequirement("engine"), self.createRequirement("engine2")])
        project.scan()
        requires = project.getRequires()
        self.assertEqual(requires[0].getName(), "engine")
        self.assertEqual(requires[1].getName(), "engine2")

    def test_classes(self):
        project = self.createProject([self.createRequirement("framework")])
        project.scan()
        requires = project.getRequires()
        self.assertEqual(requires[0].getClassByName('framework.Base').getText(), ";")

    def test_subrequirement(self):
        project = self.createProject([self.createRequirement("engine", [self.createSubRequirement("framework")])])
        project.scan()
        requires = project.getRequires()
        self.assertEqual(requires[0].getName(), "engine")
        subrequires = requires[0].getRequires()
        self.assertEqual(subrequires[0].getName(), "framework")

    
    def test_subrequirement_classes(self):
        session = Session.Session()
        session.addProject(self.createProject([self.createRequirement("engine", [self.createSubRequirement("framework")])]))

        self.assertEqual(len(session.getProjects()), 3)


    """
    # jasy error: TODO catch if this ends in an endless loop
    def test_crossed_requirements(self):

        enginePath = tempfile.TemporaryDirectory().name
        frameworkPath = tempfile.TemporaryDirectory().name

        requirement1 = self.createRequirement("engine", [self.createSubRequirement("framework", manPath=frameworkPath)], manPath=enginePath)
        requirement2 = self.createRequirement("framework", [self.createSubRequirement("engine", manPath=enginePath)], manPath=frameworkPath)

        session = Session.Session()
        session.addProject(self.createProject([requirement1, requirement2]))

        self.assertEqual(len(session.getProjects()), 3)
    """

    def test_same_subrequirements(self):

        frameworkPath = tempfile.TemporaryDirectory().name

        requirement1 = self.createRequirement("engine", [self.createSubRequirement("framework", manPath=frameworkPath)])
        requirement2 = self.createRequirement("engine2", [self.createSubRequirement("framework", manPath=frameworkPath)])

        session = Session.Session()
        session.addProject(self.createProject([requirement1, requirement2]))

        self.assertEqual(len(session.getProjects()), 4)


if __name__ == '__main__':
    logging.getLogger().setLevel(logging.ERROR)
    suite = unittest.TestLoader().loadTestsFromTestCase(Tests)
    unittest.TextTestRunner(verbosity=2).run(suite)
