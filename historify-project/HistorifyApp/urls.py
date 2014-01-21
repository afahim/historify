from django.conf.urls import patterns, url

import os
APP_PATH = os.path.abspath(os.path.dirname(__file__))

from HistorifyApp import views

urlpatterns = patterns('',
    (r'^$', 'HistorifyApp.views.index'),
    (r'^add/$', 'HistorifyApp.views.add'),
    (r'^getMedia/(?P<mediaid>\d+)/$', 'HistorifyApp.views.getMedia'),
    (r'^getArchive/(?P<year>\d+)/$', 'HistorifyApp.views.getArchive'),
	(r'^getPictures/(?P<year>\d+)/(?P<locate>\d+)/$', 'HistorifyApp.views.getPictures'),
	(r'^getVideos/(?P<year>\d+)/(?P<locate>\d+)/$', 'HistorifyApp.views.getVideos'),
)
