var backStatusHTML;
var backListHTML;
var mapProp = {};
var map;
var marker;
var contextMarker;
var infowindow;
var directionsDisplay;
var directionsService;
var myloc; 

function initialize() {
	directionsDisplay = new google.maps.DirectionsRenderer();
	directionsService = new google.maps.DirectionsService();
	myloc = new google.maps.Marker({
    	clickable: false,
    	icon: new google.maps.MarkerImage('http://maps.gstatic.com/mapfiles/mobile/mobileimgs2.png',
                                                    new google.maps.Size(22,22),
                                                    new google.maps.Point(0,18),
                                                    new google.maps.Point(11,11)),
    	shadow: null,
    	zIndex: 999,
    });

	mapProp = {
	  	center: new google.maps.LatLng(15.6333, 32.5333),
	  	zoom:12,
	  	mapTypeId:google.maps.MapTypeId.ROADMAP,
	  	panControl:true,
	 	zoomControl:true,
		mapTypeControl:true,
		scaleControl:true,
		streetViewControl:false,
		overviewMapControl:true,
		rotateControl:true
	};
	
	map = new google.maps.Map(document.getElementById("map"), mapProp);
	if(map) {
		directionsDisplay.setMap(map);
		updateGPS(true);
		//setInterval(function() {updateGPS(false)}, 60*1000);

		/** Context Menu listener */
		google.maps.event.addListener(map, "rightclick",function(event){showContextMenu(event.latLng);});
		/** /CN L */

		$("#loading").fadeOut(500);
	} else {
		$("#loading").fadeOut();
		$("#error").fadeIn(500);
	}
}

/** CM */
function hideContextMenu() {
	$('.contextmenu').remove();
	contextMarker.setMap(null);
	//contextMarker = null;
}

function showContextMenu(LatLng) {
	
	if(contextMarker) {
		contextMarker.setPosition(LatLng);
	} else {
		contextMarker = new google.maps.Marker({
			position: LatLng,
   		});	
	}

    contextMarker.setMap(map);

	 var projection;
         var contextmenuDir;
         projection = map.getProjection() ;
         $('.contextmenu').remove();
          contextmenuDir = document.createElement("div");
           contextmenuDir.className  = 'contextmenu';
           contextmenuDir.innerHTML = '<ul class="dropdown-menu show" role="menu" aria-labelledby="Options">'
           							+ '<li style="font-size: 7pt;"><center>('+LatLng.d+', '+LatLng.e+')</center></li>'
           							+ '<li class="divider"><\/li>'
           							+ '<li><a id="menu1" onclick="pickLocation('+LatLng.d+', '+LatLng.e+')"><i class="icon icon-location-arrow"><\/i> Pick my location<\/a><\/li>'
                                    + '<li><a id="menu2" onclick="hideContextMenu()"><i class="icon icon-remove"><\/ i> Cancel<\/a><\/li>'
                                    + '<\/ul>';

         $(map.getDiv()).append(contextmenuDir);
      
         setMenuXY(LatLng);

         contextmenuDir.style.visibility = "visible";
}

function pickLocation(d, e) {
	$(".location_latitude").val(d);
	$(".location_longitude").val(e);
	hideContextMenu();
	saveGPS();
}

 function setMenuXY(LatLng){
     var mapWidth = $('#map_canvas').width();
     var mapHeight = $('#map_canvas').height();
     var menuWidth = $('.contextmenu').width();
     var menuHeight = $('.contextmenu').height();
     var clickedPosition = getCanvasXY(LatLng);
     var x = clickedPosition.x ;
     var y = clickedPosition.y ;

     // if((mapWidth - x) < menuWidth)//if to close to the map border, decrease x position
       //   x = x - menuWidth;
     //if((mapHeight - y ) < menuHeight)//if to close to the map border, decrease y position
       //  y = y - menuHeight;
     $('.contextmenu').css('position','relative');
     $('.contextmenu').css('left',x  );
     $('.contextmenu').css('top',y );
 };

 function getCanvasXY(LatLng){
       var scale = Math.pow(2, map.getZoom());
      var nw = new google.maps.LatLng(
          map.getBounds().getNorthEast().lat(),
          map.getBounds().getSouthWest().lng()
      );
      var worldCoordinateNW = map.getProjection().fromLatLngToPoint(nw);
      var worldCoordinate = map.getProjection().fromLatLngToPoint(LatLng);
      var LatLngOffset = new google.maps.Point(
          Math.floor((worldCoordinate.x - worldCoordinateNW.x) * scale),
          Math.floor((worldCoordinate.y - worldCoordinateNW.y) * scale)
      );
      return LatLngOffset;
   }
/** /CM */

function loadScript()
{
	var script = document.createElement("script");
	script.src = "http://maps.googleapis.com/maps/api/js?sensor=true&callback=initialize";
	document.body.appendChild(script);
	if(!script) {
		$("#loading").fadeOut();
		$("#error").fadeIn(500);
	}
}

$(document).ready(function() {
	loadScript();

	$(".panel .toggle").click(function() {
		$(".panel .toggle > i").toggleClass("icon-arrow-left").toggleClass("icon-expand");
		$(".panel").toggleClass("col-md-2", 10000, "easeOutSine").toggleClass("col-md-3", 10000, "easeOutSine");
		$(".map").toggleClass("col-md-10", 10000, "easeOutSine").toggleClass("col-md-9", 10000, "easeOutSine");
	});

	$("#sa").click(function() {
		do_search();
	});

	$("#sb").keyup(function(e){
		if(e.keyCode == 13) {
			do_search();
		}
	});


	$("body").on('click', '.show_drug', function() {
		var id = $(this).attr('data-drug-id');
		show_drug(id);
	});

	$("body").on('click', '.show_generic', function() {
		var genericname = $(this).attr('data-generic-name');
		do_search_generic(genericname);
	});

	$("body").on('click', '.go_back', function() {
		if(backStatusHTML && backListHTML) {
			$(".status").html(backStatusHTML).slideDown();
			$(".list").html(backListHTML).slideDown(200);
		}
	});

	$("body").on('click', '.show_pharmacy', function() {
		var id = $(this).attr('data-pharmacy-id');
		var loc_lat = $(this).attr('data-loc-lat');
		var loc_lon = $(this).attr('data-loc-lon');
		var name = $(this).attr('data-pharmacy-name');
		var phone = $(this).attr('data-pharmacy-phone');
		var price = $(this).attr('data-stock-price');
		show_pharmacy(id, loc_lat, loc_lon, name, phone, price);
	});

	// Support for AJAX loaded modal window.
	// Focuses on first input textbox after it loads the window.
	$('body').delegate('[data-toggle="modal"]', 'click', function(e) {
		e.preventDefault();
		var url = $(this).attr('href');
		if (url.indexOf('#') == 0) {
			$(url).modal('open');
		} else {
			$.get(url, function(data) {
				$('<div class="modal fade" style="z-index: 10000;">' + data + '</div>').modal();
			}).success(function() { $('input:text:visible:first').focus(); });
		}
	});

	/* location box */
	$(".location_box .toggle").click(function() {
		$(".location_box .toggle > i").toggleClass('icon-expand');
		$(".location_box .box").toggle(100);
	});

	$(".location_box .location_update").click(function() {
		updateGPS(true);
	});

	$(".location_box .location_form").submit(function(ev) {
		saveGPS();

		ev.preventDefault();
	});
	/* /location box */
});

var api = 'api.php';
function do_search() {
	var q = $("#sb").val();
	if(q && q.length >= 3) {
		$(".list").hide();
		$(".status").html("<i class='icon icon-spinner icon-spin'></i>");
		$.getJSON(api+'?m=ds', {'q': q}, function(r) {
			if(r.length > 0) {
				$(".status").html("Results for '<b>"+q+"</b>':");
				
				var html = "";
				for (i = r.length - 1; i >= 0; i--) {
					html += "<a href='javascript: void(0);' class='list-group-item show_drug' title='"+r[i].name+" &bull; CN: "+r[i].genericname+"' data-drug-id='"+r[i].id+"'>";
					html += "	<h4 class='list-group-item-heading'><i class='icon icon-glass'></i>"+(i+1)+". "+r[i].name+"<br /><small style='font-size: 8pt;'>"+r[i].manufacturer+"</small></h4>";
					html += "	<p class='list-group-item-text'>In <i class='icon icon-h-sign'></i> "+r[i].availability+" location(s)</p>";
					html += "</a>";
				};

				$(".list").html(html).slideDown(200);
			} else {
				$(".status").html("No results for '<b>"+q+"</b>'.");
			}
		}).error(function() {
			$(".status").html("<div class='alert alert-danger'><i class='icon icon-remove'></i> Connectivity error.</div>");	
		});
	}
}

function do_search_generic(genericname) {
	var q = genericname;
	if(q && q.length >= 3) {
		$(".list").hide();
		$(".status").html("<i class='icon icon-spinner icon-spin'></i>");
		$.getJSON(api+'?m=ds&alt', {'q': q}, function(r) {
			if(r.length > 0) {
				$(".status").html("Alternatives for '<b>"+q+"</b>':");
				
				var html = "";
				for (i = r.length - 1; i >= 0; i--) {
					html += "<a href='javascript: void(0);' class='list-group-item show_drug' title='"+r[i].name+" &bull; CN: "+r[i].genericname+"' data-drug-id='"+r[i].id+"'>";
					html += "	<h4 class='list-group-item-heading'><i class='icon icon-glass'></i>"+(i+1)+". "+r[i].name+"<br /><small style='font-size: 8pt;'>"+r[i].manufacturer+"</small></h4>";
					html += "	<p class='list-group-item-text'>In <i class='icon icon-h-sign'></i> "+r[i].availability+" location(s)</p>";
					html += "</a>";
				};

				$(".list").html(html).slideDown(200);
			} else {
				$(".status").html("No Alternatives for '<b>"+q+"</b>'.");
			}
		}).error(function() {
			$(".status").html("<div class='alert alert-danger'><i class='icon icon-remove'></i> Connectivity error.</div>");	
		});
	}
}



function show_drug(id, noback) {
	if(id && id > 0) {
		var old_status = $(".status").html();
		backStatusHTML = $(".status").html();
		backListHTML = $(".list").html();
		$(".status").html("<i class='icon icon-spinner icon-spin'></i>");
		$.getJSON(api+'?m=d', {'id': id}, function(r) {
			if(r) {
				var overview = "<h1><a class='btn btn-default go_back' title='Back'><i class='icon icon-chevron-left'></i></a> <i class='icon icon-glass'></i> "+r.name+"<br /><small style='font-size: 8pt;'>"+r.manufacturer+"</small></h1><i>"+r.genericname+"</i><br /><a class='btn btn-primary'>In "+r.availability.length+" <i class='icon icon-h-sign'></i></a> &nbsp;&nbsp;<a class='btn btn-default show_generic' data-generic-name='"+r.genericname+"'>Alternatives <i class='icon icon-search'></i></a> &nbsp;&nbsp;<a class='btn btn-default' href='view.php?model=drug&id="+r.id+"' title='Drug Information' target='new'><i class='icon icon-info-sign'></i></a>";
				var list = "";
				for (var i = r.availability.length - 1; i >= 0; i--) {
					list += "<a href='javascript: void(0);' class='list-group-item show_pharmacy' title='"+r.availability[i].name+" &bull; "+r.availability[i].city+"' data-pharmacy-id='"+r.availability[i].id+"' data-loc-lat='"+r.availability[i].loc_lat+"' data-loc-lon='"+r.availability[i].loc_lon+"' data-pharmacy-name='"+r.availability[i].name+"' data-pharmacy-phone='"+r.availability[i].phone+"' data-stock-price='"+r.availability[i].stock.price+"'>";
					list += "	<h4 class='list-group-item-heading'><i class='icon icon-h-sign'></i>"+(i+1)+". "+r.availability[i].name+"<br /><small style='font-size: 8pt;'>"+r.availability[i].address+"</small></h4>";
					list += "	<p class='list-group-item-text'>"+r.availability[i].city+" &bull; $"+r.availability[i].stock.price+"</p>";
					list += "</a>";
				};

				$(".status").html(overview).slideDown(200);
				$(".list").slideUp(100).html(list).slideDown(500);
			} else {
				// error
				$(".status").html(old_status);
			}
		}).error(function() {
			// error
			$(".status").html(old_status);
		});
	}
}

function show_pharmacy(id, loc_lat, loc_lon, name, phone, price) {
	if(id && id > 0) {
		var loc = new google.maps.LatLng(loc_lat,loc_lon);
		
		if(marker) {
			marker.setMap(null);
		}

		marker = new google.maps.Marker({
  				position: loc,
  				animation: google.maps.Animation.DROP
  		});
		marker.setMap(map);

		infowindow = new google.maps.InfoWindow({
  			content:"<a class='btn btn-round btn-primary btn-xs' href='javascript: get_directions("+loc_lat+", "+loc_lon+")'><i class='icon icon-road'></i></a> &bull; <b><i class='icon icon-h-sign'></i> "+name+"</b><br /><span class='btn btn-primary'>"+price+" SDG</span> &bull; <i class='icon icon-phone'></i> "+phone+""
  		});

		google.maps.event.addListener(marker, 'click', function() {
  			infowindow.open(map,marker);
  		});

		map.setZoom(12);
		window.setTimeout(function() {
    		map.panTo(loc);
			map.setZoom(14);
  		},1000);
	}
}

function updateGPS(init) {
	console.log('updateGPS...');
	$(".location_loading").html("<i class='icon icon-spinner icon-spin'></i>").show();
	if (navigator.geolocation) navigator.geolocation.getCurrentPosition(function(pos) {
    	me = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
    	myloc.setPosition(me);
    	myloc.setMap(map);
    	
    	if(init && map) {
    		map.panTo(me);
    	}

    	console.log("updateGPS: "+me);
    	$(".location_latitude").val(me.d);
    	$(".location_longitude").val(me.e);
    	$(".location_loading").html("<i class='icon icon-ok'></i>").show();
    	setTimeout(function() { $(".location_loading").hide(500); }, 5000);
	}, function(error) {
    	myloc.setMap(null);
    	console.log('updateGPS: Error.');
    	$(".location_loading").html("<i class='icon icon-remove-sign'></i>").show();
	});
}

function saveGPS() {
	console.log('savingGPS...');
	$(".location_loading").html("<i class='icon icon-spinner icon-spin'></i>").show();
	
	var lat = $(".location_latitude").val();
    var lon = $(".location_longitude").val();
    	
	if(lat && lon) {
		me = new google.maps.LatLng(lat, lon);
    	myloc.setPosition(me);
    	myloc.setMap(map);
    	
    	if(map && me) {
    		map.panTo(me);
    	}

    	console.log("saveGPS: "+me);
    	$(".location_loading").html("<i class='icon icon-ok'></i>").show();
    	setTimeout(function() { $(".location_loading").hide(500); }, 5000);
	} else {
		console.log('saveGPS: Error.');
    	$(".location_loading").html("<i class='icon icon-remove-sign'></i>").show();
	}
}

function get_directions(lat,lon) {
	if(me) {
		var start = me;
     	var end = lat+","+lon;
     	var request = {
        	origin:start,
        	destination:end,
        	travelMode: google.maps.DirectionsTravelMode.DRIVING
    	};

    	directionsService.route(request, function(response, status) {
    		if (status == google.maps.DirectionsStatus.OK) {
          	directionsDisplay.setDirections(response);
        	}
    	});
    } else {
    	console.log("No position");
    }
}