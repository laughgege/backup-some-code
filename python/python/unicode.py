# coding=utf-8
# can't run in textmate

CODEC = 'utf-8'
FILE = "unicode.txt"

hello_out = u"Hello world\n"
bytes_out = hello_out.encode(CODEC)

f = file(FILE, "w")
f.write(bytes_out)
f.close()

f = open(FILE, "r")
bytes_in = f.read()
f.close()
hello_in = bytes_in.decode(CODEC)
print hello_in

#unicode 原则
程序中出现字符串时一定要加个前缀u.
不要用str()函数,用unicode()代替.
不要用过时的 string 模块 -- 如果传给它的是非 ASCII 字符,它会把一切搞砸。
不到必须时不要在你的程序里面编解码 Unicode 字符.只在你要写入文件或数据库或者
网络时,才调用 encode()函数;相应地,只在你需要把数据读回来的时候才调用 decode() 函数.

Python 标准库里面的绝大部分模块都是兼容 Unicode 的.除了 pickle 模块!pickle 模块只 支持 ASCII 字符串。
如果你把一个 Unicode 字符串交给 pickle 模块来 unpickle,它会报异常. 你必须先把你的字符串转换成 ASCII 字符串才可以.
所以最好是避免基于文本的 pickle 操作. 幸运地是现在二进制格式已经作为 pickle 的默认格式了,pickle 的二进制格式支持不错.
这点 在你向数据库里面存东西是尤为突出,把它们作为 BLOB 字段存储而不是作为 TEXT 或者 VARCHAR 字段存储要好很多.
万一有人把你的字段改成了 Unicode 类型,这可以避免 pickle 的崩溃.

数据库适配器可能有点麻烦,有些适配器支持 Unicode 有些不支持,
比如说 MySQLdb,它并 不是默认就支持 Unicode 模式,
你必须在 connect()方法里面用一个特殊的关键字 use_unicode 来确保你得到的查询结果是 Unicode 字符串.


unicode 原始字符串 ur"xxxx"
unichr(2000)