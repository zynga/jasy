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


## Roadmap

### March 2012

* Improve installation support using pre-built Jasy installation packages for Mac and Windows. (DONE)
* Support for checking links, param and return types inside API docs. (DONE)
* Support API docs for dotted parameters (object parameters with specific required sub keys). (DONE)
* Support API doc generation for plain JavaScript statics/members (using namespace={} or namespace.prototype={})
* Supporting recursive project dependencies aka project A uses B uses C and A does not know anything about C.
* Improve support for 3rd party JavaScript libraries not matching the Jasy requirements (no jasyproject.conf or matching file layout). This will be implemented moving the configuration and a manual file layout structure into the project requiring this 3rd party library.
* Support for executing and manipulating tasks from other projects e.g. generating build version of project A from project B into a destination folder of project B.
* Support for auto cloning of remote repositories (using Git URLs)

### 2012

* Verify and test support for sprite sheets (application icons, ...)
* Style sheet pre processor
* Image optimizer and sprite sheet generator
* Further optimization modules (share strings, shorthands for public names, ...)
* Improve localization support (Verify gettext support, add new features)
* Support for exporting multi names per file
* Support for AMD- and NPM-like syntax for dependencies/API generator


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