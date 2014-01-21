var clickX = new Array();
var clickY = new Array();
var clickDrag = new Array();
var clickColor = new Array();
var paint = false;

var currentColor = "#000000";

function changeColor(c)
{
    currentColor = c;
}

function addClick(x, y, dragging)
{
  clickX.push(x);
  clickY.push(y);
  clickDrag.push(dragging);
  clickColor.push(currentColor);
}

function prepareCanvas(){
    $("<canvas></canvas>").prependTo($(".image")[0]);
    var canvas = $('canvas')[0];
    var context = canvas.getContext("2d");
    clearCanvas();

      $(canvas).mousedown(function(e){
          var mouseX = e.pageX - this.offsetLeft;
          var mouseY = e.pageY - this.offsetTop;
      
          if (editIsOn()){
              paint = true;
              addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop,false);
              redraw();
          }   
    });

    $(canvas).mousemove(function(e){
      if(paint){
        addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
        redraw();
      }
    });

    $(canvas).mouseup(function(e){
      paint = false;
    });

    $(canvas).mouseleave(function(e){
      paint = false;
    });
}

function redraw(){
  clearCanvas();
  var canvas = $('canvas')[0];
  var context = canvas.getContext("2d");
  context.lineJoin = "round";
  context.lineWidth = 5;
  for(var i=0; i < clickX.length; i++)
      {        
        if(clickDrag[i]){
                  context.beginPath();
                  context.moveTo(clickX[i-1], clickY[i-1]);
                  context.lineTo(clickX[i], clickY[i]);
                  context.closePath();
                  context.strokeStyle = clickColor[i];
                  context.stroke();
        }
      }
}

function clearCanvas(){
    var canvas = $('canvas')[0];
    var img = $('.image > img')[0];
    var w = 400 * img.width / img.height
    $(canvas).attr("height",400);
    $(canvas).attr("width",w);
    var context = canvas.getContext("2d");
    context.drawImage(img, 0, 0, w, 400);
}
 
function resetCanvas()
{
    clickX=[];
    clickY=[];
    clickDrag=[];
    redraw();
}
