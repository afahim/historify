var CWIDTH;
var CHEIGHT;
var CGAP = 10;
var CXSPACING;
var CYSPACING;
var ROWS = 4;

function translate3d(x, y, z) {
	return "translate3d(" + x + "px, " + y + "px, " + z + "px)";
}

function cameraTransformForCell(n) {
	var x = Math.floor(n / ROWS);
	var y = n - x * ROWS;
	var cx = (x + 0.5) * CXSPACING;
	var cy = ((y-ROWS/2) * 0.2 + ROWS/2)*CYSPACING;

	if (magnifyMode) {
		return translate3d(-cx, -cy, 120);
	}
	else {
		return translate3d(-cx, -cy, 0);
	}	
}

var currentCell = -1;

var cells = [];
var lastx = 0;

var page = 0;
var loading = true;
var currTags = ""

var currentTimer = null;
var loadedComments = -1;

var dolly, camera;

var magnifyMode = false;

var toggle = false;
var zoomTimer = null;

var keys = { left: false, right: false, up: false, down: false };
var keymap = { 37: "left", 38: "up", 39: "right", 40: "down" };
var keytimer = null;

function getTagName(cell) {
	return (cell.info.fileType == "video")?"video":"img";
}

function refreshImage(elem, cell) {
	if (cell.iszoomed) 	{
		return;
	}

	if (zoomTimer) 	{
		clearTimeout(zoomTimer);
	}
	
	var zoomImage = jQuery('<' + getTagName(cell) + ' controls="controls" class="zoom"></' + getTagName(cell) + '>');

	zoomTimer = setTimeout(function () 	{
		zoomImage.load(function () {
			layoutImageInCell(zoomImage[0], cell.div[0]);
			jQuery(elem).replaceWith(zoomImage);
			cell.iszoomed = true;
		});

		zoomImage.attr("src", cell.info.zoom);

		zoomTimer = null;
	}, 2000);
}

function layoutImageInCell(image, cell) {
    var iwidth = image.width;
    var iheight = image.height;
    var cwidth = jQuery(cell).width();
    var cheight = jQuery(cell).height();
    var ratio = Math.min(cheight / iheight, cwidth / iwidth);
    
    iwidth *= ratio;
    iheight *= ratio;

	image.style.width = Math.round(iwidth) + "px";
	image.style.height = Math.round(iheight) + "px";

	image.style.left = Math.round((cwidth - iwidth) / 2) + "px";
	image.style.top = Math.round((cheight - iheight) / 2) + "px";
}

function updateStack(newIndex, newmagnifymode) {
	if (currentCell == newIndex && magnifyMode == newmagnifymode)
	{
		return;
	}

	var oldIndex = currentCell;
	newIndex = Math.min(Math.max(newIndex, 0), cells.length - 1);
	if (newIndex < 0) newIndex = 0;
	currentCell = newIndex;

	if (oldIndex != -1)
	{
		var oldCell = cells[oldIndex];
		oldCell.div.attr("class", "cell fader view original");	
		if (oldCell.reflection)
		{
			oldCell.reflection.attr("class", "cell fader view reflection");
		}
	}
	
	var cell = cells[newIndex];
	cell.div.addClass("selected");
	
	if (cell.reflection)
	{
		cell.reflection.addClass("selected");
	}

	magnifyMode = newmagnifymode;
	
	if (magnifyMode)
	{
		cell.div.addClass("magnify");
		refreshImage(cell.div.find(getTagName(cell))[0], cell);
	}

	dolly.style.webkitTransform = cameraTransformForCell(newIndex);
	
	var currentMatrix = new WebKitCSSMatrix(document.defaultView.getComputedStyle(dolly, null).webkitTransform);
	var targetMatrix = new WebKitCSSMatrix(dolly.style.webkitTransform);
	
	var dx = currentMatrix.e - targetMatrix.e;
	var angle = Math.min(Math.max(dx / (CXSPACING * 3.0), -1), 1) * 45;

	camera.style.webkitTransform = "rotateY(" + angle + "deg)";
	camera.style.webkitTransitionDuration = "330ms";

	if (currentTimer)
	{
		clearTimeout(currentTimer);
	}
	
	currentTimer = setTimeout(function ()
	{
		camera.style.webkitTransform = "rotateY(0)";
		camera.style.webkitTransitionDuration = "5s";
	}, 330);
}

function findSpace(info) {
	var start = lastx*ROWS;
	for (var start = lastx*ROWS; start < cells.length; start += ROWS) {
		var newcol = true;
		for (var i = 0; i < ROWS; ++i) {
			if (cells[start+i].occupied < 0) {
				// See if vertical room is enough
				if (ROWS - ((start+i) % ROWS) < info.celly) {
					newcol = false;
					break;
				}
				else {
					// Check all cells
					var works = true;
					for (var j = 0; j < info.celly; ++j) {
						for (var k = 0; k < info.cellx && start + k*ROWS < cells.length; ++k) {
							if (cells[start + i + j + k*ROWS].occupied > 0) {
								works = false;
								break;
							}
						}
						if (!works) break;
					}
					if (works) {
						var newCells = start + i + j + k*ROWS - cells.length + 40;
						for (var j = 0; j < newCells; ++j) {
							cells.push({occupied:-1});
						}
						while (cells.length % ROWS != 0) cells.push({occupied:-1});
						for (var j = 0; j < info.celly; ++j) {
							for (var k = 0; k < info.cellx; ++k) {
								cells[start + i + j + k*ROWS].occupied = info.id;
							}
						}										
						return start + i;
					}
				}
			}
		}
		if (newcol) {
			++lastx;
		}
	}
	var newCells = info.cellx*ROWS;
	for (var j = 0; j < newCells; ++j) {
		cells.push({occupied:-1});
	}

	toggle = !toggle;
	for (var j = 0; j < info.celly; ++j) {
		for (var k = 0; k < info.cellx; ++k) {
			cells[start + j + k*ROWS].occupied = info.id;
		}
	}
	return start;
}

function snowstack_addimage(reln, info) {
	addimage(reln, info, true);
}

function clickListener(e) {
	closeComments();
}

function closeComments() {
	jQuery("#comments").hide();
	window.removeEventListener('click', clickListener);
	window.addEventListener('keydown', keydownlistener);
	window.addEventListener('keyup', keyuplistener);
	loadedComments = -1;
}

function makeRequest(url) {
	cells[loadedComments].info.popularity++
	jQuery("#hidden").load(url, null, function(responseText) {
	showBox(url.replace("vote","zoomBox"));
	} );
}

function updateComments(xhr, status) {
	jQuery("#comments").html(xhr);
	console.info(xhr);
	jQuery("#comments").show();
	jQuery("#vote").attr("href", "javascript:makeRequest('/wall/" + cells[loadedComments].info.id + "/vote/');");
	jQuery("#popularity").text(cells[loadedComments].info.popularity);
	
	window.removeEventListener('keydown', keydownlistener);
	window.removeEventListener('keyup', keyuplistener);
	window.addEventListener('click', clickListener);
}

function showBox(url) {
	jQuery.ajaxSetup ({
		cache: false
	});
	loadedComments = parseInt(url.split("/")[2]);
	for (var i = 0; i < cells.length; ++i) {
		if (cells[i].occupied == loadedComments && cells[i].info.id == loadedComments) {
			loadedComments = i;
			break;
		}
	}
	jQuery("#comments").load(url, null, updateComments);
}

function addimage(reln, info, newImage) {
	var realn = findSpace(info);
	var cell = cells[realn];
	var x = Math.floor(realn / ROWS);
	var y = realn - x * ROWS;

	cell.info = info;

	if (newImage) {
		cell.div = jQuery('<div class="cell fader view original" style="opacity: 0" id="image' + info.id + '"></div>').width(CWIDTH*info.cellx + CGAP*(info.cellx-1)).height(CHEIGHT*info.celly + CGAP*(info.celly-1));
	}
	cell.div[0].style.webkitTransform = translate3d(x * CXSPACING, y * CYSPACING, 0);
	if (newImage) {
		var img = document.createElement(getTagName(cell));

		jQuery(img).load(function () {
			layoutImageInCell(img, cell.div[0]);
			cell.div.append(jQuery('<a class="mover viewflat" href="javascript:showBox(\'' + cell.info.link + '\');" target="_self"></a>').append(img));
			cell.div.css("opacity", 1);
		});
		
		img.src = info.thumb;
		if (cell.info.fileType ==  "video") {
			img.autoplay = true;
			img.loop = true;
			img.width = CWIDTH*info.cellx + CGAP*(info.cellx-1);
			img.height = CHEIGHT*info.celly + CGAP*(info.celly-1);
			layoutImageInCell(img, cell.div[0]);
			cell.div.append(jQuery('<a class="mover viewflat" href="javascript:showBox(\'' + cell.info.link + '\');" target="_self"></a>').append(img));
			cell.div.css("opacity", 1);
			sourcetag = document.createElement("source");
			sourcetag.src = info.thumb;
			sourcetag.type = info.type;
			img.appendChild(sourcetag);
		}
		jQuery("#stack").append(cell.div);
	}

	if (y == ROWS-1) {
		cell.reflection = jQuery('<div class="cell fader view reflection" style="opacity: 0"></div>').width(CWIDTH).height(CHEIGHT);
		cell.reflection[0].style.webkitTransform = translate3d(x * CXSPACING, CYSPACING, 0);
	
		var rimg = document.createElement("img");
	
		jQuery(rimg).load(function () {
			layoutImageInCell(rimg, cell.reflection[0]);
			cell.reflection.append(jQuery('<div class="mover viewflat"></div>').append(rimg));
			cell.reflection.css("opacity", 1);
		});
	
		rimg.src = info.thumb;
		jQuery("#rstack").append(cell.reflection);
	}
}

function snowstack_init() {
	CHEIGHT = Math.round(window.innerHeight / 7);
	CWIDTH = Math.round(CHEIGHT * 300 / 180);
	CXSPACING = CWIDTH + CGAP;
	CYSPACING = CHEIGHT + CGAP;
	
	dolly = jQuery("#dolly")[0];
	camera = jQuery("#camera")[0];
	jQuery("#mirror")[0].style.webkitTransform = "scaleY(-1.0) " + translate3d(0, - CYSPACING * 6 - 1, 0);
}

function populateTags() {
	jQuery("#taglist").load('/wall/tagslist/', null);
}
function searchTag() {
	updateTags(jQuery('#search').val());
}
function updateTags(tags) {
	jQuery('#search').text(tags)
	page = 0;
	loading = true;
	oldcells = cells;
	cells = [];
	currentCell = -1;
	lastx = 0;
	currTags = tags;
	
	$("#stack").find("img").each(function(id, el) {
		// FIXME
		$(this).animate({opacity: 0.2, 
		                 top: 0}, 'slow');
	});
	
	jQuery("#rstack").empty();
	jQuery("#stack").empty();
	$("#image").find("img").each(snowstack_addimage);
	$("#image").find("video").each(snowstack_addimage);
	fetchImages(function (images)
    {
		if (images.length == 0) updateTags("");
		else {
			jQuery.each(images, snowstack_addimage);
			updateStack(0);
			loading = false;
		}
    }, page);
}

jQuery(window).load(function () {
	snowstack_init();
	
    $("#image").find("img").each(snowstack_addimage);
    fetchImages(function (images)
    {
		jQuery.each(images, snowstack_addimage);
		updateStack(0);
    	loading = false;
    }, page);
    
	var delay = 330;

	/* Limited keyboard support for now */
	window.addEventListener('keydown', keydownlistener);
	window.addEventListener('keyup', keyuplistener);
	
	// FIXME: Mouse Movement
});
function updatekeys() {
	var newcell = currentCell;
	if (keys.left) {
		/* Left Arrow */
		var testcell = newcell;
		while (testcell >= ROWS && (cells[testcell].occupied == cells[currentCell].occupied || cells[testcell].occupied == -1)) testcell -= ROWS;
		if (cells[testcell].occupied != -1) {
			newcell = testcell;
			while (newcell >= ROWS && cells[newcell-ROWS].occupied == cells[testcell].occupied) newcell -= ROWS;
			while (newcell % ROWS != 0 && cells[newcell-1].occupied == cells[testcell].occupied) newcell--;
		}
	}
	if (keys.right) {
		/* Right Arrow */
		var testcell = newcell;
		while (testcell < cells.length && (cells[testcell].occupied == cells[currentCell].occupied || cells[testcell].occupied == -1)) testcell += ROWS
		if (testcell >= cells.length) {
			if (!loading) {
				/* We hit the right wall, add some more */
				page = page + 1;
				loading = true;
				fetchImages(function (images)
				{
					if (images.length == 0) {
						loading = false;
						--page;
						return;
					}
					jQuery.each(images, snowstack_addimage);
					loading = false;
				}, page);
			}
		}
		else {
			if (cells[testcell].occupied != -1) {
				newcell = testcell;
				while (newcell % ROWS != 0 && cells[newcell-1].occupied == cells[testcell].occupied) newcell--;
			}
			else {
				/* We hit the right wall, add some more */
				page = page + 1;
				loading = true;
				fetchImages(function (images)
				{
					jQuery.each(images, snowstack_addimage);
					loading = false;
				}, page);
			}
		}
	}
	if (keys.up)
	{
		/* Up Arrow */
		var testcell = newcell;
		while (testcell % ROWS != 0 && (cells[testcell].occupied == cells[currentCell].occupied || cells[testcell].occupied == -1)) testcell -= 1;
		if (cells[testcell].occupied != -1) {
			newcell = testcell;
			while (newcell >= ROWS && cells[newcell-ROWS].occupied == cells[testcell].occupied) newcell -= ROWS;
			while (newcell % ROWS != 0 && cells[newcell-1].occupied == cells[testcell].occupied) newcell--;
		}
	}
	if (keys.down) {
		/* Down Arrow */
		var testcell = newcell;
		while (testcell % ROWS != ROWS-1 && (cells[testcell].occupied == cells[currentCell].occupied || cells[testcell].occupied == -1)) testcell += 1;
		if (cells[testcell].occupied != -1) {
			newcell = testcell;
			while (newcell >= ROWS && cells[newcell-ROWS].occupied == cells[testcell].occupied) newcell -= ROWS;
		}
	}
	updateStack(newcell, magnifyMode);
}

function keycheck() {
	if (keys.left || keys.right || keys.up || keys.down)
	{
		if (keytimer === null)
		{
			delay = 330;
			var doTimer = function ()
			{
				updatekeys();
				keytimer = setTimeout(doTimer, delay);
				delay = 60;
			};
			doTimer();
		}
	}
	else
	{
		clearTimeout(keytimer);
		keytimer = null;
	}
}

function keydownlistener(e) {
	if (e.keyCode == 32) {
		/* Magnify toggle with spacebar */
		updateStack(currentCell, !magnifyMode);
	}
	else {
		keys[keymap[e.keyCode]] = true;
	}
	keycheck();
}

function keyuplistener(e) {
	keys[keymap[e.keyCode]] = false;
	keycheck();
}

function getSizeFromPopularity(popularity) {
	if (popularity > 8) return 4;
	else if (popularity > 5) return 3;
	else if (popularity > 2) return 2;
	else return 1;
}

function fetchImages(callback, page) {
    var url = "/wall/wallReturn/" + currTags + "/" + page + "/";
   
	jQuery.getJSON(url, function(data) 
	{
        var images = jQuery.map(data, function (item)
        {
            return {
            	thumb: item.fields.media,
            	zoom: "#", 
            	link: "/wall/" + item.pk + "/zoomBox/",
				id: item.pk,
				cellx: getSizeFromPopularity(item.fields.popularity),
				celly: getSizeFromPopularity(item.fields.popularity),
				fileType: item.fields.fileType,
				type: item.fields.mimeType,
				popularity: item.fields.popularity,
            };
        });

        callback(images);
    });
}

