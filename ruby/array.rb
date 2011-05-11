# -*- coding:utf-8-*-
cattle = "yahoo"
p container = [cattle, cattle]

cattle[2] = "p"
p container

###############

a, b = 1, "str"
c = [a, b, 3, "str"]
d = [a, c, [1, 2, 3]]

p c[0]
p c[1]
p c[2]
p c[3]
p c[4]
p d[2]

############

p c[-1]
p c[-2]
p c[-3]
p c[-4]
p c.length

#############

p c[1,2] #1位置后面２个
p c[1,3]
p c[1,4]
p c[-2,2]
p c[4,2]


###########

p c[1..2] #１到２包含２
p c[1...2] #１到２包含２
p c[-2..-1]
p c[-2..3]
p c[-2...3]
p c[4..5]

###########赋值##########

a = [1, 2]
p a[0]

a[4] = '4'
p a

a[0, 3] = 'a', 'b', 'c'
p a

a[1..2] = '1', '2'
p a

a[1, 2] = "?" #变短了
p a

a[0..2] = "a" #更短了
p a

a[-1] = "A"
p a

##############

a = ["a", "n"]

p a[-3]
#a[-3] = 1 error

##################

array1 = [1, 2, "str"]
array2 = [1, 2, "str"]
p array1 === array2
p array1 === ["str", 1, 2] #false
p array1 === ["str", 1]

########== 和 ===基本一样###########
p array1 == array2
p array1 == ["str", 1, 2] #false
p array1 == ["str", 1]

########不一样的情况###########
p "_______________________"
p (1..10) === 5
p (1..10) == 5

p /\d+/ === "123"  # true: 字符串匹配这个模式
p String === "s"
p Fixnum === 1 
p "s" === String

######################

array = ["a", "b", "c"]

p array.length
p array.size
p array *= 2

p array.include? "c"
p array.sort
p array
p array.uniq
array.uniq! #修改array本身
p array
























