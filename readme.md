Jasy - JavaScript Tooling Framework 
===================================

Jasy is a collection of tools for dealing with JavaScript source code. It is based on Python3 and relies on a stable parser engine based on Narcissus/Spidermonkey by Mozilla.

The main goal of Jasy is to offer an API which could be used by developers to write their custom build/deployment scripts. Jasy offers an rich Python3-API. Your build script is just a normal Python script which includes the Jasy-API and defines so-called tasks.

Jasy also offers standalone tools for dealing with single JavaScript files to e.g. compress or format them.

License
-------

Jasy is licensed under a dual license MIT + Apache V2. See separate license files for details. The parser implementation is under a triple open source license MPL 1.1/GPL 2.0/LGPL 2.1 as these are from the original Spidermonkey code.

Parser
------

- Full JavaScript 1.8 parser based on Narcissus (which itself is based on Spidermonkey)
- Reworked parser for better child handling (easier to traverse tree compared to original)
- Full support for JavaScript 1.8 (Generators, Block Scope, Function Expressions, Array Comprehensions, ...)
- Comment processing (Comments are attached to nodes and are part of the AST)

Project Handling
----------------

- Project Support (Bundling multiple projects)
- Build scripts are plain Python and can do everything you want to do. No limitations.
- Import Jasy and define your own tasks (using Python decorator "task") (See demo/generate.py as an example)

Dependency Analysis
-------------------

- Dependency Analysis (with support for permutations). 
- All dependencies are regarded as load-time specific.
- Automatic and fine-tunable breaking of circular dependencies.
- Detects all objects which are not declared in the file itself e.g. window, document, my.namespaced.Class, etc.

Dead Code Removal
-----------------

- Resolves conditions and removes blocks which could not be reached
- Function part of the permutation support
- Supports switch statements
- Supports conditional statements (?:)
- Resolves boolean, number and string compares
- Supports AND and OR operators

Permutation Features
--------------------

- Permutation Support (building different results from one code base)
- Might be used to remove debug blocks or alternative code

Compression Features
--------------------

- Comment Removal
- White Space Removal (even in some quirky places e.g. keywords before strings, etc.)

Optimizer Features
------------------

- Renames local variables/functions/exceptions (based on their usage number)
- Renames file private variables (starting with double underscore by convention)
- Combines multi var statements into one per function (really all of them)
- Removes needless blocks (with just one statement)
- Automatically combines strings and numbers (e.g. "Version " + 1.3 => "Version 1.3")
- Optimizes if(-else) statements with expressions as content
  - Translates if-statements without else using `&&` or `||` operators
  - Translates if-statements with else using conditional operator `? :` (especially worth with returns/assignments)
- Removes needless else (if previous if-block ends with a return/throw statement)
- Removes needless parens based on priority analysis on the AST


Developer Support
-----------------

- Generates a so-named "source" version which loads the original class files which is useful during the development phase of an application.


Localization Features
---------------------

- Unicode CLDR Data Transformation
  - Rebuilds XML files to nicely useable ultra-modular JSON data classes
  - Integrates with dependency system
  - Fast access to data without additional API possible
  - Supports project fallback chain
- PO-File translations
  - Loads translations from PO-files
  - Create language specific variants
  - Replaces string instances directly inside the original file
  - Removes overhead through translation as no function call is needed anymore
  - Optimizes template replacement e.g. via %1 into a string "plus" operation


Todo
----

- Auto Closure Wrapping for string optimizations, keyword optimization, etc.
- String optimizations
- API data
- Code Quality Checks (Lint)
- Pretty Printer
- ...
