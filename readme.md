JS Tools
========

Fresh tool chain for JavaScript based on narcissus tree generator. Should support all kind of processing for JavaScript:

- Dependency Calculation
- Automatic Class Sorting
- Support for LabJS Loading
- Code Optimization (Variables Names, Dead Code Removal, ...)
- Documentation Generation
- Pretty Printing 
- Code Quality Checks (Lint)

It should also offers some kind of project handling with tools one might use in a Python script. See bin/jsproject for an example. Not yet sure about how exactly this will look in the future.

Usage
-----

    $ jstree filename.js => syntax tree
    $ jsdeps filename.js => dependencies of file
    $ jscompress filename.js => compressed (whitespaces, comments) file
    $ jsoptimize filename.js => optimized and compressed file

Done
----

- Parser (based on Narcissus JavaScript Parser)
- Rework parser for better child handling (easier to traverse tree compared to original)
- Support for JavaScript 1.8 (Generators, Block Scope, Function Expressions, Array Comprehensions, ...)
- Compressor (generate JavaScript code without white-spaces, etc.)
- Local Variable Optimizer
- Comment processing (Parse and attach to nodes)
- Project Support (Bundling multiple projects)
- Permutation Support (Removing debug blocks, alternative code, qooxdoo variants, hasjs statements, etc.)
- Permutation hashes with timestamp support (for permanent caching of files)
- Dependency Analysis (with support for permutations)

Todo
----

- Auto Closure Wrapping for string optimizations, keyword optimization, etc.
- String optimizations
- API data
- Unicode Data Merge (CLDR)
- PO-File Translations
- Lint Checks
- Pretty Printer
- ...
