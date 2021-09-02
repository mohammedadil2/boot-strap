$(document).ready( function() {
	$('body').delegate('.a.ajaxPage', 'click', function(ev) {
		//** 1. Prevent default event action
		ev.preventDefault();
		
		//** 2. Freeze document
		$('#ajaxPage').addClass('disabled');
		
		//** 3. Ajax request
		var href = $(this).attr('href') + '&ui=0';
		var jxqhr = $.get(href, function (data){
			$('#ajaxPage').html(data);
		}).always( function(){
			$("#ajaxPage").removeClass('disabled').scrollTo();
		});
		//*/
	});
	
	$('body').delegate('.a.ajaxLink', 'click', function(ev) {
		//** 1. Prevent default event action
		ev.preventDefault();
		
		//** 2. Freeze document
		$('#ajaxDiv').addClass('disabled');
		
		//** 3. Ajax request
		var href = $(this).attr('href') + '&ui=' + $(this).attr('data-ui');
		var jxqhr = $.get(href, function (data){
			$('#ajaxDiv').html(data);
		}).always( function(){
			$("#ajaxDiv").removeClass('disabled').scrollTo();
		});
		//*/
	});
});


/** Search form ajaxification */
function ajaxForm( type ) {
	return true;
	
	//** 1. Figure out which type
	var ajaxDiv = type == 0 ? "#ajaxPage" : "#ajaxDiv";
	var ajaxUi  = type == 0 ? 0 : -1;
	var q       = $('#q').val();
	
	//** 2. Freeze document
	$( ajaxDiv ).addClass('disabled');
	
	//** 3. Ajax request
	var uri   = 'index.php?act=ds&q=' + q + '&ui=' + ajaxUi;
	var jxqhr = $.get(uri, function (data){
		$( ajaxDiv ).html(data);
	}).always( function(){
		$( ajaxDiv ).removeClass('disabled');
		$("#ajaxPage").scrollTo();
	});
	//*/
	
	return false;
}

$(function() {
	var hidden = true;
	$('#cart').click(function() {
		$("#cartCollapse").toggle(500);
		$("#cartError").hide(100);
		if(hidden) {
			$("#cartLoading").show(100);
			$.get("cart.php?ajax", function(html) {
				$("#cartLoading").hide(100);
				setTimeout(function() { $("#cartInner").html(html).show(500) }, 100);
			}).error(function() {
				$("#cartLoading").hide(100);
				$("#cartError").show(100);
			});
		}
		hidden = $("#cartCollapse").is(":visible");
	});
});
