month = {
	"Jan" => "1", "Feb" => "2",
}
p month["Jan"]
p month

user_mapping = {"kayo" => nil}
p user_mapping.key?"kayo"
p user_mapping.key?"tetsu"
p user_mapping.fetch("kayo") { |key|  puts "kayo"}
p user_mapping.fetch("tetsu", "xxx")

####compare#####

hash1 = {"a"=>1, "b"=>2}
hash2 = {"a"=>1, "b"=>2}

p hash1 == hash2
hash1 = {"a" => 2, "b" => 1}
p hash1 == hash2
hash1 = {"a" => 1, "b" => 2, "c" => 3}
p hash1 == hash2

#####functions#####

hash1.each { |key, value| puts "#{key} => #{value}" }
p hash1.map { |key, value| "#{key} => #{value}" }


#####Enumerator######

p "-------------------------"
hash1.map.with_index{|(key, value), index|
	p "#{index} => #{key}"
}
