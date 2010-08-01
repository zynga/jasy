JS Tools
========

Fresh tool chain for JavaScript based on narcissus tree generator. Should support all kind of processing for JavaScript:

- Code Optimization
- Dependency Calculation
- Documentation
- Pretty Printing
- Code Quality Checks / Lint

Goals
-----

- Light-weight cross platform tool chain for processing JavaScript code
- In the future a replacement for qooxdoo's tool chain
- Modular tools instead of one monolithic solution

Usage
-----

    $ jstree filename.js => outputs syntax tree
    $ jscompress filename.js => outputs simple compressed file
    $ jsoptimize filename.js => outputs optimized and compressed file

Done
----

- Parser (reworked a lot of stuff from original code)
- Added support for Generators, Block Scope, Function Expressions, Array Comprehensions, ...
- Compressor (generate JavaScript code without white-spaces, etc.)
- Local Variable Optimizer
- Variant Processing (Removing debug blocks, alternative code, ...)

In Progress
-----------

- Auto Closure Wrapping for string optimizations, keyword optimization, etc.

Todo
----

- String optimizations
- Comment processing (Parse and attach to nodes)
- API data
- Unicode Data Merge (CLDR)
- PO-File Translations
- Lint Checks
- Pretty Printer
- ...
