function init(){
    $("#uploaderCaption > input").val("");
    $("uploader > input").removeAttr("checked");
    $("#uploaderUrl").css("visibility", "hidden");
    $("#uploaderFile").css("visibility", "hidden");
}

function add(){
    var tagString = $.trim($("input[name='tags']").val());
    var jsonVal = JSON.stringify(tagString.split(" "));
    $("input[name='tags']").val(jsonVal);   
    $("#uploader > form").submit();
 }

function addJSON(){
    var tagString = $.trim($("input[name='tags']")).val();
    $("#uploader > form").submit();
}

function showURLUploader(){
    $("#uploaderUrl").css("visibility", "visible");
    $("#uploaderFile").css("visibility", "hidden");
}

function showFileUploader(){
    $("#uploaderUrl").css("visibility", "hidden");
    $("#uploaderFile").css("visibility", "visible");
}

function previewUrl(){
    var img = $("<img/>")[0];
    img.src = $("#uploaderUrl > input").val();
    $("#imagePreview").html($(img));
}

