#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

from jasy.core.Logging import *
from distutils.version import StrictVersion

try:
    import pip
except ImportError:
    error("pip is required to run JASY!")
    sys.exit(1)


needs = [
    {
        "packageName": "Pygments",
        "minVersion": "1.5",
        "installPath": "'pip install Pygments'",
        "updatePath": "'pip install --upgrade pygments'"
    },
    {
        "packageName": "polib",
        "minVersion": "1.0",
        "installPath": "'pip install polib'",
        "updatePath": "'pip install --upgrade polib'"
    },
    {
        "packageName": "requests",
        "minVersion": "0.13",
        "installPath": "'pip install requests'",
        "updatePath": "'pip install --upgrade requests'"
    },
    {
        "packageName": "CherryPy",
        "minVersion": "3.2",
        "installPath": "'pip install CherryPy'",
        "updatePath": "'pip install --upgrade CherryPy'"
    },
    {
        "packageName": "PyYAML",
        "minVersion": "3.0",
        "installPath": "'pip install PyYAML'",
        "updatePath": "'pip install --upgrade PyYAML'"
    }
]

optionals = [
    {
        "packageName": "misaka",
        "minVersion": "0.0",
        "installPath": "'pip install misaka'",
        "updatePath": ""
    },
    {
        "packageName": "watchdog",
        "minVersion": "0.0",
        "installPath": "'pip install -e git+https://github.com/wpbasti/watchdog#egg=watchdog'",
        "updatePath": ""
    },
    {
        "packageName": "pil",
        "minVersion": "0.0",
        "installPath": "'pip install -e git+https://github.com/zynga/pil-py3k#egg=pil-py3k'",
        "updatePath": ""
    }
]


def doCompleteDoctor():
    """Checks for uninstalled or too old versions of requirements and gives a complete output"""

    header("Troubleshooting Environment")


    dists = [dist for dist in pip.get_installed_distributions()]
    keys = [dist.key for dist in pip.get_installed_distributions()]
    
    versions = {}
    for dist in dists:
        versions[dist.key] = dist.version

    def checkSingleInstallation(keys, versions, packageName, minVersion, installPath, updatePath):
        info('%s:' % packageName)
        indent()
        if packageName.lower() in keys:
            info(colorize('Found installation', "green"))
            if StrictVersion(minVersion) > StrictVersion("0.0"):
                if StrictVersion(versions[packageName.lower()]) >= StrictVersion(minVersion):
                    info(colorize('Version is OK (needed: %s installed: %s)' % (minVersion, versions[packageName.lower()]), "green"))
                else:
                    info(colorize(colorize('- Version is NOT OK (needed: %s installed: %s)' % (minVersion, versions[packageName.lower()]) , "red"), "bold"))
                    info('  -> Update to the newest version of %s using %s' % (packageName, updatePath))
        else:
            info(colorize(colorize('Did NOT find installation', "red"), "bold"))
            info('  -> Install the newest version of %s using %s' % (packageName, installPath))
        outdent()


    # Needed packages
    info(colorize(colorize("Needed installations:", "bold"), "underline"))
    indent()
    for entry in needs:
        checkSingleInstallation(keys, versions, entry["packageName"], entry["minVersion"], entry["installPath"], entry["updatePath"])
    outdent()

    # Optional packages
    info(colorize(colorize("Optional installations:", "bold"), "underline"))
    indent()
    for entry in optionals:
        checkSingleInstallation(keys, versions, entry["packageName"], entry["minVersion"], entry["installPath"], entry["updatePath"])
    outdent()


def doInitializationDoctor():
    """Checks for uninstalled or too old versions only of needed requirements and gives error output"""

    dists = [dist for dist in pip.get_installed_distributions()]
    keys = [dist.key for dist in pip.get_installed_distributions()]
    
    versions = {}
    for dist in dists:
        versions[dist.key] = dist.version

    def checkSingleInstallation(keys, versions, packageName, minVersion, installPath, updatePath):
        if packageName.lower() in keys:
            if StrictVersion(minVersion) > StrictVersion("0.0"):
                if StrictVersion(versions[packageName.lower()]) < StrictVersion(minVersion):
                    info(colorize(colorize('JASY requirement error: "%s"' % packageName, "red"), "bold"))
                    indent()
                    info(colorize(colorize('- Version is NOT OK (needed: %s installed: %s)' % (minVersion, versions[packageName.lower()]) , "red"), "bold"))
                    info('  -> Update to the newest version of %s using %s' % (packageName, updatePath))
                    outdent()
                    return False
        else:
            info(colorize(colorize('JASY requirement error: "%s"' % packageName, "red"), "bold"))
            indent()
            info(colorize(colorize('Did NOT find installation', "red"), "bold"))
            info('  -> Install the newest version of %s using %s' % (packageName, installPath))
            outdent()
            return False

        return True

    allOk = True

    for entry in needs:
        if not checkSingleInstallation(keys, versions, entry["packageName"], entry["minVersion"], entry["installPath"], entry["updatePath"]):
            allOk = False   

    return allOk



