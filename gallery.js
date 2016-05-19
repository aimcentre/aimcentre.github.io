var FeedUrlBase = "https://sites.google.com/feeds/content/";
var SiteDomain = "";
var SiteName = "";
var GalleryRoot = "";
var GalleryTitle = "";
var HistoryLength = 4;

function seed(){
	return Math.floor(Math.random() * 100000);
}

function InitGallery(){
	//Get userprefs and initialize variables
	var prefs = new gadgets.Prefs();
	SiteDomain = prefs.getString("siteDomain");
	SiteName = prefs.getString("siteName");
	GalleryRoot = prefs.getString("galleryRoot");
	GalleryTitle = prefs.getString("galleryTitle");
	HistoryLength = parseInt(prefs.getString("historyLength"));
	if(isNaN(HistoryLength)){
		HistoryLength = 5;
	}
	
	//Set gallery title
	if(GalleryTitle != ""){
		var title_div = document.getElementById("myGalleryTitle");
		$(title_div).text(GalleryTitle);
	}
	
	//set gallery year links
	var current_year = new Date().getFullYear();
	var container = document.getElementById("myGallery");
	var page_links = document.getElementById("pageLinks");
	for (var i = 0; i < HistoryLength; i++){
		var year = current_year - i;
		
		//adding the year to the page links
		var year_link = document.createElement("span");
		var link_action = "showAlbumCollectionByPath(" + year + ");return false;";
		//var link_start_tag = "<a href='#' onclick='event.preventDefault();showAlbumCollectionByPath(".concat(year,");return false;'>");
		var link_start_tag = "<a href='#' ontouch='"+link_action+"' onclick='"+link_action+"' >";
		if(i < HistoryLength - 1){
			$(year_link).html(link_start_tag.concat(year, "</a> | "));
		}
		else{
			$(year_link).html(link_start_tag.concat(year, "</a>"));
		}
		page_links.appendChild(year_link);

	} //End: for (var i = 0; i < HistoryLength; i++){
		
	//displaying the album set of the current year
	showAlbumCollectionByPath(new Date().getFullYear());
}

function showAlbumCollectionByPath(year){
	
	var albem_set_div_id = "album_set_" + year;
	var gallery_data = document.getElementById(albem_set_div_id);
	
	if(gallery_data == null){
		var album_root_url = FeedUrlBase.concat(SiteDomain, "/", SiteName, "/?path=/", GalleryRoot, "/", year, "&t=", Math.floor((Math.random() * 100000)));
		
		$.ajax({
		  url: album_root_url,
		  dataType: "jsonp",
		  success: function (data) {
			google.load("feeds", "1");
			var feed = jQuery.parseXML(data).documentElement;
			var entries = feed. getElementsByTagName("entry");
			if(entries.length > 0){
				var ids = entries[0].getElementsByTagName("id");
				if(ids.length > 0){
					var url = $(ids[0]).text();
					if(url.match("/$")){
						url = url.slice(0,-1);
					}
					var pos = url.lastIndexOf("/");
					var album_data_parent_id = url.slice(pos+1);
					showAlbumCollectionByParentPageId(album_data_parent_id, albem_set_div_id);
				}
			}
		  }
		});
	}
	else{
		//making select gallery visible and everything else hidden
		$( ".gallery-data" ).each(function() {
			if($(this).attr("id") == albem_set_div_id){
				$(this).show();
			}
			else{
				$(this).hide();
			}
		});
		//KR: gadgets.window.adjustHeight();
	}
} //End: showGallery(year)

function showAlbumCollectionByParentPageId(parentId, albumSetDivId){
	var feed_url = FeedUrlBase.concat(SiteDomain, "/", SiteName, "/?parent=", parentId, "&kind=announcement", "&t=", Math.floor((Math.random() * 100000)));
	var feed = new google.feeds.Feed(feed_url);
	
	//TODO: Set maximum number of entries to be retrieved to be a large number
	
	//Loading the feed
	feed.load(function(result) {
		if (!result.error) {
			
			//obtaining the specified gallery
			var gallery_data = document.getElementById(albumSetDivId);
			if(gallery_data == null){
				gallery_data = document.createElement("div");
				$(gallery_data).attr("id", albumSetDivId);
				$(gallery_data).addClass("gallery-data");
				
				var gallery_data_root = document.getElementById("galleryDataRoot");
				gallery_data_root.appendChild(gallery_data);
				
				for(var i=0;i<result.feed.entries.length; ++i){
					var entry = result.feed.entries[i];
					
					//album
					var album = document.createElement("div");
					gallery_data.appendChild(album);
					$(album).addClass("album");
					
					//album title
					var title = document.createElement("div");
					album.appendChild(title);
					$(title).addClass("album-title");
					$(title).html(entry.title);
					
					//album image container
					var album_images = document.createElement("div");
					$(album_images).addClass("row");
					album.appendChild(album_images);
					
					//adding images
					var content = document.createElement("content");
					content.innerHTML = entry.content;        
					var images = $(content).find('img').map(function(){
						return $(this).attr('src')
					}).get();
					for(var k=0; k<images.length; ++k){
						var src = images[k];
						//var img = document.createElement("img");
						//$(img).attr('src', src);
						var wrapper = document.createElement("div");
						$(wrapper).addClass("col-md-3");
						$(wrapper).addClass("col-sm-6");
						$(wrapper).addClass("col-xs-12");
						$(wrapper).addClass("wrapper");
						album_images.appendChild(wrapper);
						
						var img = document.createElement("div");
						$(img).css("background-image", "url(\"".concat(src, "\")"));
						$(img).addClass("album-img");
						$(wrapper).addClass("col-md-12");
						wrapper.appendChild(img);
					}
					
					var clear = document.createElement("content");
					$(clear).css("clear", "both");
					album_images.appendChild(clear);
				}
			}
			
			//making select gallery visible and everything else hidden
			$( ".gallery-data" ).each(function() {
				if($(this).attr("id") == albumSetDivId){
					$(this).show();
				}
				else{
					$(this).hide();
				}
			});
			
			gadgets.window.adjustHeight();
		}
		else{
//			throw new Error("Failed to load feed ".concat(feed_url));
		}
	});			
}



