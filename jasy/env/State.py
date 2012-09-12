#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

import jasy.env.Session as Session

__all__ = ["session"]

session = Session.Session()
session.__doc__ = """Auto initialized session object based on jasy.env.Session"""

