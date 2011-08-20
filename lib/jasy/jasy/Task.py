import logging


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

    