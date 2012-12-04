//Code for displaying / hiding icons on the map

var width = window.innerWidth;
var height = window.innerHeight;
var cellWidth = width/2;
var cellHeight = height/2;

var coord = [ [850, 100], [650, 250], [700, 650] , [900, 525] ];
var media = [ [0, 0], [0, 0], [0, 0], [0, 0] ];

var vidIcon = "<img class=\"icon vidIcon\"  onclick = \"\" src = \"css/zaidImages/movie.png\"/>";
var picIcon = "<img class=\"icon picIcon\"  onclick = \"\" src = \"css/zaidImages/picture.png\"/>";

function handleIcons()
{
        var i = 0;
        for (i = 0; i < 4; i++)
        {
          $("#header").after(vidIcon);
          $("#header").after(picIcon);
        }
          
        placeAll();
        hideAll();
        showPopulated();
        
}
      
function placeAll()
{
        $(".vidIcon").each(function(index){
          this.style.position = "fixed";
          this.style.left    =  coord[index][0] + "px";
          this.style.top      =  coord[index][1] + "px";
          $(this).attr('onclick',"historyBookVideos(" + (index+1) + ")");
        });
        $(".picIcon").each(function(index){
          this.style.position = "fixed";
          this.style.left    =  coord[index][0] + "px";
          this.style.top      =  coord[index][1] + 30 + "px";
           $(this).attr('onclick',"historyBookImages(" + (index+1) + ")");
        });
}
      
function hideAll()
{
        $(".icon").each(function(index){
          this.style.visibility  = "hidden";
        });
}
      
function showPopulated()
{
      $(".vidIcon").each(function(index){
          if(media[index][0] == 1){
            //$(this).fadeIn();
            this.style.visibility = "visible";
          }
        });
        
        $(".picIcon").each(function(index){
          if(media[index][1] == 1){
            this.style.visibility = "visible";
            //$(this).fadeIn('slow');
          }
        });
}

function historyBookVideos(location)
{
	var currentYear = $( "#slider" ).slider( "value" );
	var historyIframe = "<p><a class='iframe' href=\"/histofify/getVideos/" + currentYear +  "/\">Outside Webpage (Iframe)</a></p>";
	$("body").append(historyIframe);
	$.colorbox({iframe:true,href:"/historify/getVideos/" + currentYear + "/"+ location + "/", width:"100%", height:"100%"});
	
}

function historyBookImages(location)
{
	var currentYear = $( "#slider" ).slider( "value" );
	var historyIframe = "<p><a class='iframe' href=\"/histofify/getImages/" + currentYear +  "/\">Outside Webpage (Iframe)</a></p>";
	$("body").append(historyIframe);
	$.colorbox({iframe:true,href:"/historify/getPictures/" + currentYear + "/"+ location + "/", width:"100%", height:"100%"});
}
	