#! /usr/local/bin/ruby

a, b = "str", "str"

def a.greet
	puts "I am the object #{self.object_id}"
end

a.greet
b.greet #error