import logging

@share
def hello():
	logging.info("Foo")
	print("hello")

@share
def bye():
	print("bye")

@share
def dosome():
    writeFile("dosome.txt", "content")
