#! /usr/local/bin/ruby
#-*- coding:utf-8-*-
def odd?(n)
	case n % 2
	when 0 then false
	when 1 then true
	else raise "no this number"
	end
end

while num=gets
	unless /\A-?\d+Z/ =~ num
		$stderr.puts "error"
		next
	end
	num=num.to_i
	
	if odd?(num)
		puts "#{num}"
	else
		puts "#{num}"
	end
end