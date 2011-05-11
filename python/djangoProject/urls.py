# -*- coding:UTF-8 -*- 
from django.conf.urls.defaults import patterns,include

from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    (r'^$', 'apacheTest.index'),
    (r'^crossdomain.xml$', 'common.flash.index'),
    (r'^admin/',include(admin.site.urls)),
)

urlpatterns += patterns('dfat',
	(r'^dfat/test', 'test.main'),
    (r'^dfat/post/.*$', 'postLog.main'),
    (r'^dfat/postTest/.*$', 'postTest.form'),
    (r'^dfat/postSuccess/.*$', 'postSuccess.success'),
    (r'^dfat/syncsm/.*$', 'backgroundSync.main'),
    (r'^dfat/syncsm2/.*$', 'backgroundSync.syncAllTask'),
    (r'^dfat/syncut/.*$', 'syncunittest.main'),
    (r'^dfat/forestage/getall/.*$', 'forestage.getalltask'),
    (r'^dfat/forestage/getone/.*$', 'forestage.getonetask'),
    (r'^dfat/forestage/update/.*$', 'forestage.updatetask'),
    (r'^dfat/forestage/smuserlist/.*$', 'forestage.smuserlist'),
    (r'^dfat/forestage/getonetaskunittest/.*$', 'forestage.getonetaskunittest'),
    (r'^dfat/forestage/updateunittest/.*$', 'forestage.updateunittest'),
    (r'^dfat/forestage/updatelog/.*$', 'forestage.updatelog'),
    (r'^dfat/forestage/gettasklog/.*$', 'forestage.gettasklog'),
    (r'^dfat/submitnodevtask/.*$', 'views.submitNoDevTask'),
)
urlpatterns += patterns('oregon1',
    (r'^oregon/post/.*$', 'getContent.main'),
    (r'^oregon/success/.*$', 'postSuccess.success'),
)

urlpatterns += patterns('oregon_new',
    (r'^oregonnew/list/.*$', 'oregonList.main'),
    (r'^oregonnew/closureTest/.*$', 'closure.main'),
)

urlpatterns += patterns('ui_click',
    (r'^click/page/.*$', 'page.main'),
    (r'^click/get/.*$', 'getClick.main'),
    (r'^click/syncorder/.*$', 'allOrders.main'),
)

urlpatterns += patterns('ftpImgViewer',
    (r'^ftpImgViewer/thumb/.*$', 'views.main'),
    (r'^ftpImgViewer/imglist/.*$', 'views.imglist'),
)