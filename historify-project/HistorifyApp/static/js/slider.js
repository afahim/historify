//Code for displaying / hiding icons on the map


function initializeSlider()
{   var currentYear = 1980;
    var requestURL = "/historify/getArchive/" + currentYear;
    $.ajax({
    url: requestURL,
    success: function(data) {
                hideAll();
                media = JSON.parse(data);
                showPopulated();
            }
    });
	$('#slider').slider({
		value: 1980,
		min: 1970,
		max: 2012,
		
		slide: function( event, ui ) {
					$( "#amount" ).val( ui.value );
					var requestURL = "/historify/getArchive/" + ui.value;
					$.ajax({
					  url: requestURL,
					  success: function(data) {
					   		hideAll();
							media = JSON.parse(data);
							showPopulated();
					  }
					});
		}
	});
	$( "#amount" ).val(  $( "#slider" ).slider( "value" ) );
	
	var value = $( "#slider" ).slider( "value" );
}
