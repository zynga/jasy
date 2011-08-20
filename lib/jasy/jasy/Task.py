import logging
from optparse import OptionParser


class Environment:
    tasks = {}
    verbose = None
    
    def __init__(self):
        pass

    def addTask(self, task):
        logging.debug("Registering task: %s" % task.name)
        self.tasks[task.name] = task
        
    def executeTask(self, name):
        if name in self.tasks:
            logging.debug("Executing task: %s" % name)
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
    
    # TODO: Support Task arguments in decorators:
    # http://stackoverflow.com/questions/739654/understanding-python-decorators/1594484#1594484

    if isinstance(func, Task):
        return func
    
    return Task(func)
    
    

def run():
    """ Main routine which should be called on startup """

    parser = OptionParser()
    parser.add_option("-q", "--quiet", action="store_false", dest="verbose", help="don't print status messages to stdout")
    parser.add_option("-v", "--verbose", action="store_true", dest="verbose", help="print more detailed status messages to stdout")
    parser.add_option("-l", "--log", dest="logfile", help="Write debug messages to given logfile")

    (options, args) = parser.parse_args()

    # Clear previous handlers, we would like full-control at comment line
    logging.getLogger().removeHandler(logging.root.handlers[0])

    if options.logfile:
        logging.basicConfig(filename=options.logfile, level=logging.DEBUG, format="%(asctime)s - %(levelname)s - %(message)s")
        logging.getLogger().setLevel(logging.DEBUG)
    elif not logging.root.handlers:
        if options.verbose is True:
            logging.getLogger().setLevel(logging.DEBUG)
        elif options.verbose is False:
            logging.getLogger().setLevel(logging.WARN)
        else:
            logging.getLogger().setLevel(logging.INFO)
    
    # Define a Handler which writes INFO messages or higher to the sys.stderr
    console = logging.StreamHandler()

    if options.verbose is True:
        console.setLevel(logging.DEBUG)
    elif options.verbose is False:
        console.setLevel(logging.WARN)
    else:
        console.setLevel(logging.INFO)
        
    console.setFormatter(logging.Formatter('>>> %(message)s', '%H:%M:%S'))
    logging.getLogger().addHandler(console)    

    for name, value in vars(options).items():
        setattr(env, name, value)

    for name in args:
        env.executeTask(name)
    