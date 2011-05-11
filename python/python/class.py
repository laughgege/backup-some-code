基本定制类型
C.__init__(self[, arg1, ...]) 构造器（带一些可选的参数）
C.__new__(self[, arg1, ...]) 构造器（带一些可选的参数）；通常用在设置不变数据类型的子类。
C.__del__(self) 解构器
C.__str__(self) 可打印的字符输出；内建str()及print 语句
C.__repr__(self) 运行时的字符串输出；内建repr() 和‘‘ 操作符
C.__unicode__(self) Unicode 字符串输出；内建unicode()
C.__call__(self, *args) 表示可调用的实例
C.__nonzero__(self) 为object 定义False 值；内建bool() （从2.2 版开始）
C.__len__(self) “长度”（可用于类）；内建len()

对象(值)比较
C.__cmp__(self, obj) 对象比较；内建cmp()
C.__lt__(self, obj) and 小于/小于或等于；对应<及<=操作符
C.__gt__(self, obj) and 大于/大于或等于；对应>及>=操作符
C.__eq__(self, obj) and 等于/不等于；对应==,!=及<>操作符

属性
C.__getattr__(self, attr) 获取属性；内建getattr()；仅当属性没有找到时调用
C.__setattr__(self, attr, val) 设置属性
C.__delattr__(self, attr) 删除属性
C.__getattribute__(self, attr) a 获取属性；内建getattr()；总是被调用
C.__get__(self, attr) a （描述符）获取属性
C.__set__(self, attr, val) a （描述符）设置属性
C.__delete__(self, attr) a （描述符）删除属性

数值类型:二进制操作符
C.__*add__(self, obj) 加；+操作符
C.__*sub__(self, obj) 减；-操作符
C.__*mul__(self, obj) 乘；*操作符
C.__*div__(self, obj) 除；/操作符
C.__*truediv__(self, obj) e True 除；/操作符
C.__*floordiv__(self, obj) e Floor 除；//操作符
C.__*mod__(self, obj) 取模/取余；%操作符
C.__*divmod__(self, obj) 除和取模；内建divmod()
C.__*pow__(self, obj[, mod]) 乘幂；内建pow();**操作符
C.__*lshift__(self, obj) 左移位；<<操作符
C.__*rshift__(self, obj) 右移；>>操作符
C.__*and__(self, obj) 按位与；&操作符
C.__*or__(self, obj) 按位或；|操作符
C.__*xor__(self, obj) 按位与或；^操作符

数值类型:一元操作符
C.__neg__(self) 一元负
C.__pos__(self) 一元正
C.__abs__(self) 绝对值；内建abs()
C.__invert__(self) 按位求反；~操作符


数值类型:数值转换
C.__complex__(self, com) 转为complex(复数);内建complex()
C.__int__(self) 转为int;内建int()
C.__long__(self) 转为long；内建long()
C.__float__(self) 转为float；内建float()


数值类型:基本表示法
C.__oct__(self) 八进制表示；内建oct()
C.__hex__(self) 十六进制表示；内建hex()


数值类型:数值压缩
C.__coerce__(self, num) 压缩成同样的数值类型；内建coerce()
C.__index__(self) 在有必要时,压缩可选的数值类型为整型（比如：用于切片索引等等）


序列类型
C.__getslice__(self, ind1,ind2) 得到序列片断
C.__setslice__(self, i1, i2,val) 设置序列片断
C.__delslice__(self, ind1,ind2) 删除序列片断
C.__contains__(self, val) f 测试序列成员；内建in 关键字
C.__*add__(self,obj) 串连；+操作符
C.__*mul__(self,obj) 重复；*操作符
C.__iter__(self) e 创建迭代类；内建iter()



映射类型
C.__getslice__(self, ind1,ind2) 得到序列片断
C.__setslice__(self, i1, i2,val) 设置序列片断
C.__delslice__(self, ind1,ind2) 删除序列片断
C.__contains__(self, val) f 测试序列成员；内建in 关键字
C.__iter__(self) 创建迭代类；内建iter()
C.__len__(self) mapping 中的项的数目
C.__hash__(self) 散列(hash)函数值
C.__getitem__(self,key) 得到给定键(key)的值
C.__setitem__(self,key,val) 设置给定键(key)的值
C.__delitem__(self,key) 删除给定键(key)的值
C.__missing__(self,key) 给定键如果不存在字典中，则提供一个默认值