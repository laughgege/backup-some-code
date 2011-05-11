array = ["a", "b", "c"]

array.each do |item|
	puts item
end

array.each_with_index do |item, index|
	p [item, index]
end

##################
acids = ["Adenin", "Thymine", "Guanine", "Cytosine"]

signs = acids.map do |item|
	item[0,1]
end

p signs

acids = ["Adenin", "Thymine", "Guanine", "Cytosine"]

signs = acids.map { |item|
	item[0,1]
}

p signs

p acids.map{|a| a.downcase}

#p acids.map{ &:downcase} 

#################

p acids.sort

p acids.sort{|x,y| x.to_i <=> y.to_i}

p acids.select{|x| /^A.+/ === x}