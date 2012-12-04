from django.conf.urls.defaults import patterns, include, url
from django.conf import settings

import os
APP_PATH = os.path.abspath(os.path.dirname(__file__))

urlpatterns = patterns('',
    (r'^$', 'historify.views.index'),
    (r'^add/$', 'historify.views.add'),
    (r'^getMedia/(?P<mediaid>\d+)/$', 'historify.views.getMedia'),
    (r'^getArchive/(?P<year>\d+)/$', 'historify.views.getArchive'),
	(r'^getPictures/(?P<year>\d+)/(?P<locate>\d+)/$', 'historify.views.getPictures'),
	(r'^getVideos/(?P<year>\d+)/(?P<locate>\d+)/$', 'historify.views.getVideos'),
#    (r'^historifyReturn/(?P<tag>\w*)/(?P<pageid>\d+)/$', 'historify.views.historifyReturn'),
#    (r'^(?P<imageid>\d+)/$', 'historify.views.showMedia'),
#    (r'^(?P<mediaid>\d+)/getMedia/$', 'historify.views.getMedia'),
#    (r'^(?P<imageid>\d+)/prev/$', 'historify.views.prev'),
#    (r'^(?P<imageid>\d+)/next/$', 'historify.views.next'),
#    (r'^(?P<mediaid>\d+)/vote/$', 'historify.views.vote'),
#    (r'^(?P<mediaid>\d+)/zoomBox/$', 'historify.views.zoomBox'),
#    (r'^(?P<mediaid>\d+)/comment/$', 'historify.views.comment'),
#    (r'^tagslist/$', 'historify.views.randomTags'),
#    (r'^(?P<imageid>\d+)/comment/(?P<commentid>\d+)/delete/$', 'historify.views.delete'),
#    (r'^uploader/$', 'historify.views.uploader'),

)

# serving static files
urlpatterns += patterns('',
    (r'^css/(?P<path>.*)$', 'django.views.static.serve',
        {'document_root': os.path.join(APP_PATH, 'static/css'), 'show_indexes': settings.DEBUG}),
    (r'^js/(?P<path>.*)$', 'django.views.static.serve',
        {'document_root': os.path.join(APP_PATH, 'static/js'), 'show_indexes': settings.DEBUG}),
    (r'^media/(?P<path>.*)$', 'django.views.static.serve',
        {'document_root': os.path.join(APP_PATH, 'static/media'), 'show_indexes': settings.DEBUG}),
)



