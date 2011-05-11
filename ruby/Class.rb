class Person
	attr_accessor :age, :name
	def initialize(age, name)
		@name = name
		@age = age
	end

	def self.fuck(name)
		p name
	end
	
end

yan = Person.new(27, "yanhan")
p yan.name
#p yan.fuck("you")
Person.fuck("you")

p "---------------------------"

class Duration
	def initialize(since, till)
		@since = since
		@until = till
		@read = "read"
		@write = "write"
	end

	attr_accessor :since, :until
	attr_reader :read
	attr_writer :write
end

dur = Duration.new(Time.now, Time.now + 3600)
p dur.until
p dur.read

p "---------------------------"

class Fixnum
	alias orginal_addition +
	def +(rhs)
		orginal_addition(rhs).succ
	end
end

p 1+1

p "---------------------------"

class Animal
	
end

class Yahoo < Animal

end

p Yahoo.superclass

##########

class Foo
	@@class_variable = "foo"
	def print
		p @@class_variable
	end
end

class Bar < Foo
	@@class_variable = "bar"
	def print
		p @@class_variable
	end
end

foo = Foo.new
foo.print
bar = Bar.new()
bar.print

p "---------------------------"

class D
	DAYS_OF_WEEK = 7
	p DAYS_OF_WEEK

	def print_days_of_week
		p DAYS_OF_WEEK
	end
end

D.new.print_days_of_week

p D::DAYS_OF_WEEK

DAYS_OF_MONTH = 30

p DAYS_OF_MONTH

p "---------------------------"

class Yahoo
	def public_method; end

	private :public_method
	def internal_use; end
	def public_api
		return internal_use
	end
	public :public_api
end

yahoo = Yahoo.new
#yahoo.public_method ############
yahoo.public_api
#yahoo.inernal_use

########singleton class#########
class << yahoo
	def hello
		p "hello world"
	end
end

#like

def yahoo.hello1
	p "hello world1"
end

yahoo.hello
yahoo.hello1

##########so this way to def static method###############

class A
	class << self
		def hello
			p "hello world2"
		end
		def hello1
			p ""
		end
	end
	
end

A.hello

include Math


#require，load用于包含文件；include，extend则用于包含模块。
#require加载文件一次，load加载文件多次。
#require加载文件时可以不加后缀名，load加载文件时必须加后缀名。
#require一般情况下用于加载库文件，而load用于加载配置文件。