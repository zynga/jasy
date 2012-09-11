#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

import time, os

from jasy.core.Logging import *
from jasy.env.State import session

try:
    from watchdog.observers import Observer
    from watchdog.events import FileSystemEventHandler
except ImportError as err:
    Observer = None
    FileSystemEventHandler = None


__all__ = ["watch"]


if FileSystemEventHandler:

    class JasyEventHandler(FileSystemEventHandler):

      def on_moved(self, event):
        super(JasyEventHandler, self).on_moved(event)

        what = 'directory' if event.is_directory else 'file'
        info("Moved %s: from %s to %s", what, event.src_path, event.dest_path)

      def on_created(self, event):
        super(JasyEventHandler, self).on_created(event)

        what = 'directory' if event.is_directory else 'file'
        info("Created %s: %s", what, event.src_path)

      def on_deleted(self, event):
        super(JasyEventHandler, self).on_deleted(event)

        what = 'directory' if event.is_directory else 'file'
        info("Deleted %s: %s", what, event.src_path)

      def on_modified(self, event):
        super(JasyEventHandler, self).on_modified(event)

        what = 'directory' if event.is_directory else 'file'
        info("Modified %s: %s", what, event.src_path)


def watch(path, callback):
    
    header("Build Daemon")
    
    if Observer is None:
        error("You need to install Watchdog for supporting file system watchers")

    # We need to pause the session to make room for other jasy executions
    session.pause()

    # Initialize file system observer
    observer = Observer()
    observer.schedule(JasyEventHandler(), ".", recursive=True)
    observer.start()

    info("Started file system watcher for %s... [PID=%s]", path, os.getpid())
    info("Use 'ulimit -n 1024' to increase number of possible open files")

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()

    info("Stopped file system watcher for %s...", path)
    observer.join()

