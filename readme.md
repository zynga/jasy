JS Tools
========

New tool chain based on narcissus tree generator.

Goals
-----

- Light-weight cross platform tool chain for processing JavaScript code
- In the future a replacement for qooxdoo's massive tool chain
- Modular tools instead of one monolithic solution

Usage
-----

    $ jstree filename.js => outputs syntax tree
    $ jscompress filename.js => outputs simple compressed file
    $ jsoptimize filename.js => outputs optimized and compressed file

Done
----

- Parser (reworked a lot of stuff from original code)
- Compressor (generate JavaScript code without white-spaces, etc.)
- Local Variable Optimizer
- Variant Processing (Removing debug blocks, alternative code, ...)

In Progress
-----------

- Auto Closure Wrapping for string optimizations, keyword optimization, etc.


Todo
----

- String optimizations
- API data
- Unicode data merge-in (CLDR)
- PO-File translations
- ...
