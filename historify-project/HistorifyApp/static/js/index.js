function comment(){
    $("#commentBox > form").submit();
}

function init(){
    // create the drag'n Drop zone in the uploader
    //createDragNDropZone();
    // Hide the uploader
    //showHideUploader();
    // Turn the edit mode off
    if ($(".image > img").length > 0){
         $(".image > img").hide();
            prepareCanvas();
            turnEditOff();
    } 
}
    