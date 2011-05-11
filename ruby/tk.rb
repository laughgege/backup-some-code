#! /usr/local/bin/ruby

require "tk"

TkLable.new{
	text "Hello, World"
	bg "red"
	pack 
}

TkButton.new{
	text "Close"
	command {exit}
	pack
}

Tk.mainloop

#something wrong i don't know