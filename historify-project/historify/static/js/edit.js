function turnEditOn()
{
    $("#edit > a").text("on");
    $("#edit > a").attr("onclick","turnEditOff();return false;");
    $("#drawMenu").css("visibility", "visible");
    $("#colorPicker").css("visibility", "visible");
}

function turnEditOff()
{
    $("#edit > a").text("off");
    $("#edit > a").attr("onclick","turnEditOn();return false;");
    $("#drawMenu").css("visibility", "hidden");
    $("#colorPicker").css("visibility", "hidden");
}

function editIsOn(){
    return $("#edit > a").text()=="on";
}
