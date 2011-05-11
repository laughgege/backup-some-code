from django.conf.urls.defaults import patterns
from django.contrib import admin

admin.autodiscover()
urlpatterns = patterns('',
    # Example:
    # (r'^myweb/', include('myweb.apps.foo.urls.foo')),
    # (r'^$', 'myweb.helloworld.index'),
	(r'^add/$', 'myweb.add.index'),
    (r'^list/$', 'myweb.list.index'),
    (r'^form/$', 'myweb.main.form.form'),
    (r'^getPost/$', 'myweb.main.form.postFormTest'),
    

    # Uncomment this for admin:
    (r'^admin/(.*)', admin.site.root),
)

