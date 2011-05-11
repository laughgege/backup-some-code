def yan(bol=False):
	return bol

print filter(yan, (0, 1, True, False, []))
print map(yan, (0, 1, True, False, []))


##partial

from operator import add, mul
from functools import partial

add1 = partial(add, 1)
mul100 = partial(mul,100)

print add1(10)
print mul100(500)
print add1


'''
from functools import partial

import Tkinter
root = Tkinter.Tk()
MyButton = partial(Tkinter.Button, root, fg='white', bg='blue')
b1 = MyButton(text='Button 1')
b2 = MyButton(text='Button 2')
qb = MyButton(text='QUIT', bg='red', command=root.quit) 
b1.pack() 
b2.pack() 
qb.pack(fill=Tkinter.X, expand=True) 
root.title('PFAs!')
root.mainloop()'''


def foo(): 
	m= 3 
	def bar(): 
		n= 4
		print m + n 
		print m
	bar()	
foo()
