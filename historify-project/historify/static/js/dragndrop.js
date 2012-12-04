// This snippet of was found at
// https://developer.mozilla.org/en/Using_files_from_web_applications

//Mouse Position Global Variables
var mousePosX = 0;
var mousePosY = 0;
var droppedX = 0;
var droppedY = 0;
var moved = 1;

var currentFile;

function createDragNDropZone(){
    var dropbox = $("#uploaderFile")[0];
    dropbox.addEventListener("dragenter", dragenter, false);
    dropbox.addEventListener("dragover", dragover, false);
    dropbox.addEventListener("drop", drop, false);
}

function handleFiles(files) {
  for (var i = 0; i < files.length; i++) {
    var file = files[i];
    currentFile = files[i];
    $.colorbox({href:"#inline_content",inline:true, width:"400px"});
    
  }
}

function sendForm()
{
    //fill in x and y coordinates into the form
    
    $("input[name='xcoordinate']").val(droppedX);
    $("input[name='ycoordinate']").val(droppedY);

    var data = new FormData(document.forms.namedItem('uploadForm'));  
   
    data.append("file", currentFile);  
    
    var xhr = new XMLHttpRequest();  
    xhr.open("POST", "/historify/add/");  
    xhr.onload = function(e) 
    {   
        if (xhr.status == 200) 
        {  
            //alert("Uploaded!");  
        }
        else
        {  
            //alert("Error! Status: " + xhr.status);
        }  
    };  
  
    xhr.send(data);
    
    $.colorbox.close()
    
    var currentYear = $( "#slider" ).slider( "value" );
    var requestURL = "/historify/getArchive/" + currentYear;
    $.ajax({
    url: requestURL,
    success: function(data) {
                hideAll();
                media = JSON.parse(data);
                showPopulated();
            }
    });

}

function dragenter(e) {
  e.stopPropagation();
  e.preventDefault();
}

function dragover(e) {
  e.stopPropagation();
  e.preventDefault();
}
function drop(e) {
  droppedX = mouseX(e);
  droppedY = mouseY(e);
  moved = 0;
  e.stopPropagation();
  e.preventDefault();
  var dt = e.dataTransfer;
  var files = dt.files;
  handleFiles(files);
}

// This snippet of code was inspired from about.com
// http://javascript.about.com/library/blmousepos.htm

function mouseX(evt) 
{
if (evt.pageX) return evt.pageX;
else if (evt.clientX)
   return evt.clientX + (document.documentElement.scrollLeft ?
   document.documentElement.scrollLeft :
   document.body.scrollLeft);
else return null;
}

function mouseY(evt) 
{
if (evt.pageY) return evt.pageY;
else if (evt.clientY)
   return evt.clientY + (document.documentElement.scrollTop ?
   document.documentElement.scrollTop :
   document.body.scrollTop);
else return null;
}
