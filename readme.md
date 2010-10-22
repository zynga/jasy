JSTools - Tools for JavaScript
===============================

JSTools are tools for dealing with JavaScript source codes and projects containing JavaScript source code. It is based on Python and
relies on a stable parser engine based on Narcissus/Spidermonkey by Mozilla. It supports all kind of fancy new stuff supported
up to JavaScript 1.8.

JSTools is meant as a replacement for qooxdoo's toolchain. There should be standalone tools for dealing with JavaScript files to apply typical
things to them like parsing, compressing, optimizing, etc. JSTools should also offer a API which could be used by Python developers to write
their custom scripts based on the available modules. This is meant to be used like SCons, Waf, etc.

License
-------

Licensed under a dual license MIT + Apache V2. See separate license files for details.

Parser
------

- Full JavaScript 1.8 parser based on Narcissus (based on Spidermonkey)
- Reworked parser for better child handling (easier to traverse tree compared to original)
- Support for JavaScript 1.8 (Generators, Block Scope, Function Expressions, Array Comprehensions, ...)
- Comment processing (Parse and attach to nodes)

Project Handling
----------------

- Project Support (Bundling multiple projects)

Dependency Analysis
-------------------

- Dependency Analysis (with support for permutations). 
- All dependencies are regarded as load-time specific.
- Automatic and fine-tunable breaking of circular dependencies.
- Detects all objects which are not declared in the file itself e.g. window, document, my.namespaced.Class, etc.

Permutation Features
--------------------

- Permutation Support (Removing debug blocks, alternative code, qooxdoo variants, hasjs statements, etc.)
- Permutation hashes with timestamp support (for permanent caching of files)

Compression Features
--------------------

- Comment Removal
- White Space Removal (even is some quirky places e.g. keywords before strings, etc.)

Optimizer Features
------------------

- Renames local variables/functions
- Renames file private variables (starting with double underscore)
- Combines multi var statements into one per function
- Removes needless blocks (with just one statement)
- Optimizes if(-else) statements with expressions as content
  - Translates if-statements without else using `&&` or `||` operators
  - Translates if-statements with else using conditional operator `? :` (especially impressive with returns/assignments)
- Removes needless else (if previous if-block ends with a return/throw statement)



Todo
----

- Support for LabJS Loading
- Auto Closure Wrapping for string optimizations, keyword optimization, etc.
- String optimizations
- API data
- Unicode Data Merge (CLDR)
- PO-File Translations
- Code Quality Checks (Lint)
- Pretty Printer
- ...
