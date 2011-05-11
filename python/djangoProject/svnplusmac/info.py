# -*- coding:UTF-8 -*-

HELP = '''1. checkout开发目录  svn co svn://192.168.83.56/$website$ svn_dev  
    注: $可能需要用 \ 转义, 用户名和密码均为邮箱登录名, 若未开通请联系 gftian@ctrip.com
2. svnplus init
    输入步骤1中 svn_dev 目录的绝对路径
3. svnplus change 环境名
    local ui dev test uat online auto
4. 配置不使用代理. 这里建议使用chrome proxy switchy 插件
5. 使用代理站点 svnplus noproxy
6. 成功. 有问题请联系 yanh@ctrip.com
    
'''

NOTICE = {
    'root':'Please input your svn root path ~~\n',
}

ROOT = "严寒"