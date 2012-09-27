#!/usr/bin/env python3

import sys, os, unittest, logging, pkg_resources, tempfile

# Extend PYTHONPATH with local 'lib' folder
jasyroot = os.path.normpath(os.path.join(os.path.abspath(sys.argv[0]), os.pardir, os.pardir, os.pardir))
sys.path.insert(0, jasyroot)

import jasy.core.Project as Project


class Tests(unittest.TestCase):

    def writeFile(self, path, fileName, content):
        handle = open(os.path.join(path, fileName), mode="w", encoding="utf-8")
        handle.write(content)
        handle.close()

    def readFile(self, path, fileName):
        return open(os.path.join(path, fileName), mode="r", encoding="utf-8").read()

    def createjpyaml(self, path):
        self.writeFile(path, "jasyproject.yaml", """name: myproject
""")

    def createjpyaml_withContent(self, path):
        self.writeFile(path, "jasyproject.yaml", """name: myproject

content: {myproject.Main: [man/Main.js, man/Add.js], myproject/main.css: [man/main.css]}
""")

    def createCaseOne(self):
        #manual

        path = os.path.join(tempfile.TemporaryDirectory().name, "myproject")
        os.makedirs(path)

        def createFolders():
            os.makedirs(os.path.join(path, "man"))

        def createSampleClasses():
            self.writeFile(os.path.join(path, "man"), "index.html", """<html></html>""")
            self.writeFile(os.path.join(path, "man"), "Main.js", ";")
            self.writeFile(os.path.join(path, "man"), "Add.js", ";")

        def createSampleAssets():
            self.writeFile(os.path.join(path, "man"), "main.css", """html{}""")


        createFolders()
        self.createjpyaml_withContent(path)
        createSampleClasses()
        createSampleAssets()

        return Project.getProjectFromPath(path)


    def createCaseTwo(self):
        #application

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
        self.createjpyaml(path)
        createSampleClasses()
        createSampleAssets()
        createSampleTranslations()

        return Project.getProjectFromPath(path)


    def createCaseThree(self):
        #src

        path = os.path.join(tempfile.TemporaryDirectory().name, "myproject")
        os.makedirs(path)

        def createFolders():
            os.makedirs(os.path.join(path, "src"))

        def createSampleClasses():
            self.writeFile(os.path.join(path, "src"), "index.html", """<html></html>""")
            self.writeFile(os.path.join(path, "src"), "Main.js", ";")

        def createSampleAssets():
            self.writeFile(os.path.join(path, "src"), "main.css", """html{}""")

        createFolders()
        self.createjpyaml(path)
        createSampleClasses()
        createSampleAssets()

        return Project.getProjectFromPath(path)


    def createCaseFour(self):
        #resource

        path = os.path.join(tempfile.TemporaryDirectory().name, "myproject")
        os.makedirs(path)

        def createFolders():
            os.makedirs(os.path.join(path, "class"))
            os.makedirs(os.path.join(path, "asset"))
            os.makedirs(os.path.join(path, "translation"))

        def createSampleClasses():
            self.writeFile(os.path.join(path, "class"), "index.html", """<html></html>""")
            self.writeFile(os.path.join(path, "class"), "Main.js", ";")

        def createSampleAssets():
            self.writeFile(os.path.join(path, "asset"), "main.css", """html{}""")

        def createSampleTranslations():
            self.writeFile(os.path.join(path, "translation"), "de.po", " ")

        createFolders()
        self.createjpyaml(path)
        createSampleClasses()
        createSampleAssets()
        createSampleTranslations()

        return Project.getProjectFromPath(path)


    def getProjects(self):
        return [self.createCaseOne(),self.createCaseTwo(),self.createCaseThree(),self.createCaseFour()]

    def test_get_project(self):
        for project in self.getProjects():
            self.assertEqual(project.getName(), "myproject")

    def test_get_name_from_path(self):
        for project in self.getProjects():
            self.assertEqual(Project.getProjectNameFromPath(project.getPath()), "myproject")

    def test_scan(self):
        for project in self.getProjects():
            project.scan()
            self.assertEqual(project.scanned, True)

    def test_has_requires(self):
        for project in self.getProjects():
            self.assertEqual(project.hasRequires(), False)

    def test_fields(self):
        for project in self.getProjects():
            self.assertEqual(project.getFields(), {})

    def test_get_class_by_name(self):
        for project in self.getProjects():
            self.assertEqual(project.getClassByName("myproject.Main"), project.getClasses()["myproject.Main"])
            self.assertEqual(type(project.getClassByName("myproject.Main")).__name__, "ClassItem")

    def test_assets(self):
        for project in self.getProjects():
            self.assertEqual(type(project.getAssets()["myproject/main.css"]).__name__, "AssetItem")

    def test_translations(self):
        for project in [self.createCaseTwo(), self.createCaseFour()]:
            self.assertEqual(type(project.getTranslations()["myproject.de"]).__name__, "TranslationItem")     

    def test_manual_class_fusion(self):
        self.assertEqual(self.createCaseOne().getClassByName("myproject.Main").getText(), ";;")

if __name__ == '__main__':
    logging.getLogger().setLevel(logging.ERROR)
    suite = unittest.TestLoader().loadTestsFromTestCase(Tests)
    unittest.TextTestRunner(verbosity=2).run(suite)
