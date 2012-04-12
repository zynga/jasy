Jasy - Web Tooling Framework
============================

Jasy is a powerful Python3-based tooling framework. It makes it 
easy to manage heavy web projects. Its main goal is to offer 
an API which could be used by developers to write their custom 
build/deployment scripts.


## Installation

### Using Binary Packages

There are [pre-built packages available for either Windows or Mac](https://github.com/zynga/jasy/downloads) 
users. 

Download the ZIP file and unpack it inside our download folder. Then either run `install.sh` (Mac) or `activate.bat` (Windows).


### Custom Installation

You can also install Jasy on your own. Jasy has a few dependencies
like Python 3, Misaka (Markdown), Msgpack (API data), etc. For
details have a look at [the official documentation](https://github.com/zynga/jasy/wiki/Installation).

## Generate API documentation

As Jasy is thought for being used as a API in basically Python scripts you can also generate the full API documentation using the command `util/doc.sh`. The documentation is based on the [Sphinx](http://sphinx.pocoo.org/) documentation generator.

The [documentation is online](http://zynga.github.com/jasy/api/jasy.html) available as well.

## Roadmap

* Add support for sprite sheets (application icons, ...)
* Style sheet pre processor
* Image optimizer and sprite sheet generator
* Further optimization modules (share strings, shorthands for used objects, ...)
* Improve localization support (verify gettext support, add new features)
* Support for exporting multi names per file
* Support for AMD- and NPM-like syntax for dependencies/API generator
* Add pretty-printing option
* Add hinting support (ala JSHint)
* Add support for pushing builds to remote services (S3, etc.)


## Authors

Jasy was initially developed by [Sebastian Werner](mailto:info@sebastian-werner.net)
and is now continued as an official Zynga OpenSource project.


## License

Copyright (c) 2011-2012 Zynga Inc. http://zynga.com/

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
