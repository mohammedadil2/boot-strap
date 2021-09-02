 
        $(document).ready(function() {
			
			$("#carousel").carousel(0);
			
			$("a").tooltip();
			
			$(".dropdown").on('mouseenter', function() {
				if($(this).hasClass('open')) return;
				$(this).children(".dropdown-menu").dropdown('toggle');
			});
			
			$(".dropdown").on('mouseleave', function() {
				if(!$(this).hasClass('open')) return;
				$(this).dropdown('toggle');
			});
			
			$('.dropdown-menu a').click(function(e) {
				e.stopPropagation();
			});
			
			$("#search .search-toggle").click(function() {
				$("#search .search-toggle").hide();
				$("#search .search-box").fadeIn(200);
				$("#search .search-box input").focus();
			});
			
			$("#search .search-box").focusout(function() {
				if($("#search .search-box input").val().length > 0) return;
				$("#search .search-box").hide();
				$("#search .search-toggle").fadeIn(200);
			});
			
			$("#search .search-box .close").click(function() {
				$("#search .search-box input").val("");
				$("#search .search-box").hide();
				$("#search .search-toggle").fadeIn(200);
			});
			
		});
	 
    