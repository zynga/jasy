import logging
from optparse import OptionParser


class Environment:
    tasks = {}
    verbose = None
    
    def __init__(self):
        pass

    def addTask(self, task):
        logging.info("Registering task: %s" % task.name)
        self.tasks[task.name] = task
        
    def executeTask(self, name):
        if name in self.tasks:
            logging.info("Executing task: %s" % name)
            self.tasks[name]()
        else:
            raise Exception("No such task: %s" % name)
            

            
env = Environment()



class Task:
    __doc__ = ""
    
    def __init__(self, func):
        name = func.__name__
        self.__func = func
        
        self.name = name
        self.fullname = "%s.%s" % (func.__module__, name)
        
        try:
            self.__doc__ = func.__doc__
        except AttributeError:
            pass
            
        env.addTask(self)
        

    def __call__(self, *args, **kw):
        retval = self.__func()
        return retval


    def __repr__(self):
        return "Task: " + self.__name__



def task(func):
    """ Specifies that this function is a task. """
    
    if isinstance(func, Task):
        return func
    
    return Task(func)
    
    

def run():
    """ Main routine which should be called on startup """

    parser = OptionParser()
    parser.add_option("-q", "--quiet", action="store_false", dest="verbose", help="don't print status messages to stdout")
    parser.add_option("-v", "--verbose", action="store_true", dest="verbose", help="print more detailed status messages to stdout")

    (options, args) = parser.parse_args()

    for name, value in vars(options).items():
        setattr(env, name, value)

    for name in args:
        env.executeTask(name)
    