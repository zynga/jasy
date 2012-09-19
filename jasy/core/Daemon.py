#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

import time, os

import jasy.core.Console as Console

try:
    from watchdog.observers import Observer
    from watchdog.events import FileSystemEventHandler

except ImportError as err:
    Observer = None
    FileSystemEventHandler = None


if FileSystemEventHandler:

    class JasyEventHandler(FileSystemEventHandler):
        """
        Summarizes callbacks for filesystem change events.
        """

        def on_moved(self, event):
        super(JasyEventHandler, self).on_moved(event)

        what = 'directory' if event.is_directory else 'file'
        Console.info("Moved %s: from %s to %s", what, event.src_path, event.dest_path)

        def on_created(self, event):
        super(JasyEventHandler, self).on_created(event)

        what = 'directory' if event.is_directory else 'file'
        Console.info("Created %s: %s", what, event.src_path)

        def on_deleted(self, event):
        super(JasyEventHandler, self).on_deleted(event)

        what = 'directory' if event.is_directory else 'file'
        Console.info("Deleted %s: %s", what, event.src_path)

        def on_modified(self, event):
        super(JasyEventHandler, self).on_modified(event)

        what = 'directory' if event.is_directory else 'file'
        Console.info("Modified %s: %s", what, event.src_path)


def watch(path, callback):
    """
    Start observing changes in filesystem. See JasyEventHandler for the event callbacks.

    :param path: Path wich will be observed
    :type name: string
    """
    
    if Observer is None:
        Console.error("You need to install Watchdog for supporting file system watchers")

    # Initialize file system observer
    observer = Observer()
    observer.schedule(JasyEventHandler(), ".", recursive=True)
    observer.start()

    Console.info("Started file system watcher for %s... [PID=%s]", path, os.getpid())
    Console.info("Use 'ulimit -n 1024' to increase number of possible open files")

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()

    Console.info("Stopped file system watcher for %s...", path)
    observer.join()

