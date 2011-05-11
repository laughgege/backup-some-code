/*
 * 界面工作日志和任务管理系统，实践俄勒冈实验的做法，分片式开发
 * http://doc.ui.sh.ctriptravel.com/uig/%E5%B7%A5%E4%BD%9C%E6%97%A5%E5%BF%97%E7%AE%A1%E7%90%86%E7%B3%BB%E7%BB%9F
 * 2010-03-29
 * 参与人：ccd储成栋,yn于宁,ckma马长昆,xj徐嘉,zmh郑梦涵,zzr张子然
 */


/**
* 日志录入：
*/

# postUrl django.ui.com/post/

params:
    user
    date yyyy-mm-dd
    subject
    content

1.如果GET 方法有user 即是查询
2.POST 没有id是插入，只有id是删除， id和其他是更新其他字段
    

# admin django.ui.com/admin/

op1 
R2wLAfm4F2