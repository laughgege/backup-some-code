#! /usr/local/bin/ruby

p '-----------------'
p 1.class
p 1.object_id
p 1.methods

p "str".class
a, b = "str", "str"

p a.object_id
p b.object_id
p a==b
p a.equal? b

# p method 调制用得方法

p Fixnum.class
p Fixnum.object_id
p Fixnum.ancestors
p Fixnum.instance_methods
p 2.kind_of? Fixnum
p Fixnum.kind_of? Class
p Fixnum.kind_of? Object

