Jasy 0.8-beta1
==============

### Major New Features

- Added scaffolding support:
  - Creating new projects from scratch. Each project is able to offer one or more skeletons.
  - These "origin" projects can be available locally or can be auto-cloned from a remote repository (GIT only at the moment)
  - Skeletons are able to define configuration questions to the user (`ask()`, `set()`).
  - Stores configuration values as *YAML* (`jasyscript.yaml`) or *JSON* (`jasyscript.json`).
  - Questions can be answered interactively via prompt or passed in as command line arguments (`--name value`).
  - Questions can be combined with custom logic when using a custom post-creation script (`jasycreate.py`).
  - The custom script also has user friendly methods for renaming files, creating directories etc. (via `file` object)
  - Questions support type checks (basics like String, Number, etc.)
  - Questions are able to define default values.
  - All field names might use kind of namespaces ("." in the field name) to create a structured configuration file.
- Added integrated web server:
  - Based on *CherryPy*
  - Each to configure custom top-level routing
  - Delivering static files from the file system
  - Automatically adds *CORS* header to every response so that the Jasy based server could be accessed from other domains/hosts.
  - Supports remapping local paths to different paths on the server
  - Proxying remote URLs (omitting cross-domain oddities)
  - Caching remote *GET* requests and deliver them locally.
  - Additional offline mode omits proxying of requests which are not available in the local cache.
- Added shared tooling libraries:
  - Support for projects to offer tooling features to other projects (via `jasylibrary.py`)
  - Using "@share" decorator to only share specific methods to the outside
  - All shared methods from each project are namespaced under an object with the name of the project.
- Started implementation of file system watcher to allow auto rebuilding based on file system changes
  - Based on Watchdog (custom port for Python 3: https://github.com/wpbasti/watchdog) - still broken regarding *FSEvents* on *Mac OS X*


### Other New Features

- Added number of built-in tasks: `about`, `help`, `create` and `doctor` (not implemented yet)
- Added support for *YAML* for config files (jasyproject.yaml)
- Added nice `about` task showing version, copyright and homepage
- Added auto-installing non-native dependencies (*Pygments*, *polib*, *requests*, *CherryPy*, *PyYAML*). Kept dependencies containing native code optional (*Misaka*, *PIL*)
- Added [Travis.ci integration](http://travis-ci.org/#!/zynga/jasy) for testing scaffolding support
- Added support for showing optional task arguments in Jasy's help screen


### Improvements/Fixes

- Tasks documentation is now being implemented using doc strings on the function blocks instead of a custom string inside the `@task()` decorator.
- Improved "jasy" script to allow built-in tasks (execution outside of any Jasy project)
- Better error handling in "jasyscript.py" and other scripts indirectly executed by Jasy by setting a correct file name during `compile`for debugging.
- Jasy options and parameters on help screen are sorted now.
- Fixed issues with missing "pkg_resources" when installing Python on Mac via standard distribution
- Moved "jasy" command and prefix handling into Task module.
- Removed dependency and usage references to msgpack (never actually used anywhere in the code)
- Correctly close all `jasycache` files even if not managed by the session when Jasy is closed/crashed.
- Switched over from `distutils` to `distribute` for `setup.py`.
- Install `.bat` files on Windows only.


### Internals

- Added optional support for hashing keys of `Cache` object transparently to reduce key sizes
- Added new `jasy.core.Config` class for transparently supporting JSON/YAML formats with correct Unicode handling
- Added new module `jasy.core.File` for simplifying typical unix like file system operations (`cp`, `mv`, `mkdir`, ...)
- Reworked `jasy.core.Project` to use new `jasy.core.Config` class instead of custom config file loading.
- Added `jasy.core.Types` for a collection of new types to work with. First added type is a `CaseInsensitiveDict` which is useful for dealing with HTTP headers.
- Added new utility methods to `jasy.core.Util`: `debounce` (useful for debouncing method calls), `getFirstSubFolder` (returns the first sub folder in the given path), `massFilePatcher` (is able to patch placeholders in all files of the given directory with actual content)


Jasy 0.7.5
==========

- Added option to disable syntax highlighting in API data via `ApiWriter().write("data", highlight=True/False)`


Jasy 0.7.4
==========

- Fixed issues with correctly loading cache file on some systems
- Revamped project initialization phase to be more efficient and logical while displaying a nice dependency tree during init. 
- Improved version detection and handling inside `Session`/`Project`
- Internal Repository API is now less Git specific
- Made error reporting for API errors optional on console using new "printErrors" parameter in `Writer.write()`
- Improved error message output when invalid parameters are used


Jasy 0.7.3
==========

- Improved support for deep object documentation (e.g. defining a parameter x which is a map with the keys foo and bar)
- Improved comment processing: Made the text to HTML conversion lazy so that it is not done during parsing the class, but at generating API docs. Improves initial performance.
- Improved parsing/outdenting of code comments (comments which contain actual code) to not raise warnings
- Fixed detecting size of JPEGs directly saved via Photoshop
- Fixed output to log file
- Fixed `getProjectByName` to actually use the correct active session project and not simply the first found.
- Fixed project references in "requires" which uses shell shorthands like `~` for the home directory
- Fixed dependencies so that this release should really be the first which does not require any packages being installed (fixes comment parsing where we still have used Misaka in Jasy 0.7.2)


Jasy 0.7.2
==========

- Fix some issues with unused optimizer (SWFObject compilation)
- Added machine ID to verify cache is opened on same machine as created
- Some logging output improvements
- Further improved/fixed GIT support for edge cases
- Added debug logging of detailed shell output (Git only at the moment)


Jasy 0.7.1
==========

- Performance optimizations
- Improved logging output


Jasy 0.7
========

Major
-----

- Completely revamped asset handling. See migration guide for hints on how calls in jasyscript.py need to be modified.
  - Allow modular assets - moved out of kernel.js
  - Improved internal structure of assets for better compression and faster lookup
  - Support for multi profile assets (assets from different locations, roots and with different URL layouts)
  - Support for image sprites and image animations based on configuration files
  - Added information about asset types so that one can access this information on the client via core.io.Asset APIs.
- Added support for generating image sprites from source assets
- Revamped Jasy dependencies to make all dependencies optional (through disabling features). Makes initial installation of Jasy much easier. Added requirements.txt for easy installation of optional packages.
- Added support for omitting repository updates via "--fast"/"-f" option.
- Added help screen when no tasks were given and with "-h" option.

Minor
-----

- Improved categorization of project's content into classes, assets, translations, etc.
- Improved GIT cloning/updating stability.
- Improved output during processing/parsing classes for better user feedback during long runs.
- Renamed formatting=>jsFormatting, optimization=>jsOptimization in preparation of new supported types.
- Added getSortedClasses() to Resolver to omit initializing Sorter() in jasyscript.py at all, making scripts simpler again.
- Improved some edge cases for better error handling. Throwing user friendly JasyError instead of plain Exception.
- Added new utility method getChecksum() to easily detect SHA1 checksum of files.
- Removed typically unused storeCombined() method.


Jasy 0.6.1
==========

- Added `getProjectByName()`, `getGitBranch()`, `sha1File()`, `removeFile()`
- Added possibility to post-register assets using `addFile()`
- Added support for executing Jasy from inside the project structure e.g. from "source/class".
- Improved stability in project handling and git cloning


Jasy 0.6
========

- Major simplification of `jasyscript` via revamp of environment handling
- Support for auto cloning of repositories via `git` (needs system installation)
- Support for project requirements (recursively)
- Revamped console logging (colored and structured)
- Cleanup of project processing/indexing (improved stability/flexibility)
- Support for manually defined project structures to support non-jasy 3rd party projects easily
- Support for calling remote tasks
- Support for executing jasy from a other folder than the project's root


Jasy 0.6-beta2
==============

- Support for project overrides (local project overrides project with same name of any dependency) (useful for hot fixes).


Jasy 0.6-beta1
==============

- Support for checking links, param and return types inside API docs.
- Support API docs for dotted parameters (object parameters with specific required sub keys). 
- Support API doc generation for plain JavaScript statics/members (using namespace={} or namespace.prototype={}) 
- Supporting recursive project dependencies aka project A uses B uses C and A does not know anything about C.
- Improve support for 3rd party JavaScript libraries not matching the Jasy requirements (no jasyproject.conf or matching file layout). This will be implemented moving the configuration and a manual file layout structure into the project requiring this 3rd party library.
- Support for executing and manipulating tasks from other projects e.g. generating build version of project A from project B into a destination folder of project B.
- Added support for automatic and overrideable task prefixes.
- Performance of typical initial `build` tasks was dramatically improved by adding slots and improved deep cloning support to `Node`.


Jasy 0.5
========

- No stable release. Use 0.5-beta12 or 0.6.


Jasy 0.5-beta12
===============

- Added support for validating links inside doc strings
- Added support for validating types in params and return values
- Changed doc output format for param and return types to hold info about linkability, auto-detection, array-like, builtin, pseudo, etc.

Jasy 0.5-beta11
===============

- Added packer script for Mac OS.
- Fixed a few API doc issues.

Jasy 0.5-beta10
===============

- Worked on better API support

Jasy 0.5-beta9
==============

- Improved error handling and output
- Changed format of members/events/properties/statics to sorted arrays
- Apply sorting to uses, implements, etc.

Jasy 0.5-beta8
==============

- Improved markdown handling
- Stabilization when errors happen during API generation 
- Added assets and other meta information to API data

Jasy 0.5-beta7
==============

- Added size calculation of generated files to API data
- Renamed "constructor" key in API data to "construct"
- Minor bug fixes

Jasy 0.5-beta6
==============

- Added cache versioning
- Minor bug fixes

Jasy 0.5-beta5
==============

- Added support for generating a basic search index with all statics/members/properties/events
- Added support for compressing json output
- Added support for ignoring private/internal statics/members
- Added more connections between classes: includedBy and usedBy sections.

Jasy 0.5-beta4
==============

- Added support for merging extensions into destination object (e.g. polyfills, sugar for native objects like String, etc.)
- Added support for generating jsonp output files with custom callback
- Added support for readme.md/package.md package docs

Jasy 0.5-beta3
==============

- Minor fixes

Jasy 0.5-beta2
==============

- Minor fixes for paren optimization

Jasy 0.5-beta1
==============

- Initial release with support for generating API data as JSON files
- Support for generating session based API data with class/interface linking 
- Changed checksum computing to SHA1 to bring it in sync with changes in Core library
- Improved installation process with dependency handling etc.

Jasy 0.4.6
==========

- Minor bug fixes

Jasy 0.4.5
==========

- Minor bug fixes

Jasy 0.4.4
==========

- Minor bug fixes

Jasy 0.4.3
==========

- Minor bug fixes

Jasy 0.4.2
==========

- Minor bug fixes

Jasy 0.4.1
==========

- Minor bug fixes

Jasy 0.4
========

- Restructed to support real installation of Jasy into system folders using easy_install or PIP.
- Changed unit test implementation to Python native library

Jasy 0.3
========

- Initial Release
