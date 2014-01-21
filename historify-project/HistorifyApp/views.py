from django.http import HttpResponse
from django.shortcuts import render_to_response, HttpResponseRedirect
from django.core.urlresolvers import reverse
from django.views.decorators.csrf import csrf_exempt
from django.core.exceptions import ObjectDoesNotExist
from django.core import serializers
from django.http import Http404
from django.utils.datastructures import MultiValueDictKeyError
from django.utils import simplejson
import re
import json
from HistorifyApp.models import *

import datetime

def index(request):
    return render_to_response('HistorifyApp/upload.html')

def getLocation(a,b):
	if (b < 200):
		return 1
	elif (b < 400):
		return 2
	elif (a < 860):
		return 3
	else:
		return 4

@csrf_exempt
def add(request):
    try:
        fType = request.FILES['file'].content_type
        if re.match("image", fType):
                imgVid = "img"
        elif re.match("video", fType):
                imgVid = "video"
        else:
                imgVid = "garbage"
        
        xcord = int(request.POST['xcoordinate'])
        ycord = int(request.POST['ycoordinate'])

        fileLocation = getLocation(xcord,ycord)
        
        fileLocation = Location.objects.get(id=fileLocation)
		
        print "Location added to: " + str(fileLocation.id)
        
        #Creating Media object to save file in the database
        
        uploadedFile = Media(media=request.FILES['file'],\
        fileType = imgVid,\
        mimeType=fType,\
        location=fileLocation,\
        label = request.POST['label'],\
        description=request.POST['description'],\
        year=request.POST['year'],\
        rating=1)
        uploadedFile.save()
    except MultiValueDictKeyError:
         print "We had a problem"
         return HttpResponse("We had a problem")
    else:
        return HttpResponse("Request Done")

def getMedia(request,mediaid):
    e = Media.objects.get(id=mediaid)
    return HttpResponse(e.media, mimetype=e.mimeType)

def getArchive(request,year):
    media_list = Media.objects.filter(year = year)
    print Media.objects.all()
    archive = list()
    archive = [[0,0],[0,0],[0,0],[0,0]]
    for media in media_list:
        if media.fileType == "video":
            archive[media.location.id - 1][0] = 1
        else:
            archive[media.location.id - 1][1] = 1
    print archive
    serialized_list = json.dumps(archive)
    return HttpResponse(serialized_list)

def getPictures(request,year,locate):
    locationObject = Location.objects.get(id=locate)
    media_list = Media.objects.filter(year=year).filter(fileType="img").filter(location=locationObject)
    return render_to_response('HistorifyApp/pageFlip.html',{'media_list': media_list})

def getVideos(request,year,locate):
    locationObject = Location.objects.get(id=locate)
    media_list = Media.objects.filter(year=year).filter(fileType="video").filter(location=locationObject)
    return render_to_response('HistorifyApp/pageFlip.html',{'media_list': media_list})


