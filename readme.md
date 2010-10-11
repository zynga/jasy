JS Tools - Tools for JavaScript
===============================

Not only tools to process single files but also a Python-based API to write build scripts for complete projects. Take a look at bin/jsproject for a example.

Licensed under a dual license MIT + Apache V2.

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

- Support for LabJS Loading
- Auto Closure Wrapping for string optimizations, keyword optimization, etc.
- String optimizations
- API data
- Unicode Data Merge (CLDR)
- PO-File Translations
- Code Quality Checks (Lint)
- Pretty Printer
- ...
