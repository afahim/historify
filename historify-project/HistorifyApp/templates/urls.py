from django.conf.urls import patterns, url

from HistorifyApp import views

urlpatterns = patterns('',
    (r'^$', 'historify.views.index'),
    (r'^add/$', 'historify.views.add'),
    (r'^getMedia/(?P<mediaid>\d+)/$', 'historify.views.getMedia'),
    (r'^getArchive/(?P<year>\d+)/$', 'historify.views.getArchive'),
	(r'^getPictures/(?P<year>\d+)/(?P<locate>\d+)/$', 'historify.views.getPictures'),
	(r'^getVideos/(?P<year>\d+)/(?P<locate>\d+)/$', 'historify.views.getVideos'),
)