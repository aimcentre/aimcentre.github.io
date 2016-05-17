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
		var link_start_tag = "<a href='#' onclick='event.preventDefault();showAlbumCollectionByPath(".concat(year,");return false;'>");
		if(i < HistoryLength - 1){
			$(year_link).html(link_start_tag.concat(year, "</a> | "));
		}
		else{
			$(year_link).html(link_start_tag.concat(year, "</a>"));
		}
		page_links.appendChild(year_link);
	} //End: for (var i = 0; i < HistoryLength; i++){
}

function showAlbumCollectionByPath(year){
	var album_root_url = FeedUrlBase.concat(SiteDomain, "/", SiteName, "/?path=/", GalleryRoot, "/", year);
	
	$.ajax({
	  url: album_root_url,
	  dataType: "jsonp",
	  success: function (data) {
	  	var feed = jQuery.parseXML(data).documentElement;
	  	var entries = feed. getElementsByTagName("entry");
	  	if(entries.length > 0){
	  		var ids = entries[0].getElementsByTagName("id");
	  		if(ids.length > 0){
		  		var url = $(ids[0]).text();
		  		if(url.endsWith("/")){
		  			url = url.slice(0,-1);
		  		}
		  		var pos = url.lastIndexOf("/");
		  		var album_data_parent_id = url.slice(pos+1);
				showAlbumCollectionByParentPageId(album_data_parent_id);
		  	}
	  	}
	  }
	});	
} //End: showGallery(year)

function showAlbumCollectionByParentPageId(parentId){
	var feed_url = FeedUrlBase.concat(SiteDomain, "/", SiteName, "/?parent=", parentId, "&kind=announcement");
	var feed = new google.feeds.Feed(feed_url);
	
	//TODO: Set maximum number of entries to be retrieved to be a large number
	
	//Loading the feed
	feed.load(function(result) {
		if (!result.error) {
			
			//obtaining the specified gallery
			var id = "gallery-".concat(parentId);
			var gallery_data = document.getElementById(id);
			
			//if the gallery is not already loaded, load it.
			if(gallery_data == null){
				gallery_data = document.createElement("div");
				$(gallery_data).attr("id", id);
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
					album.appendChild(album_images);
					$(album_images).css("border", "solid 2px red");
					
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
						var img = document.createElement("div");
						$(img).addClass("album-img");
						$(img).addClass("col-md-3");
						$(img).css("background-image", "url(\"".concat(src, "\")"));
						album_images.appendChild(img);
					}
					
					var clear = document.createElement("content");
					$(clear).css("clear", "both");
					album_images.appendChild(clear);
				}
			}
			
			//making select gallery visible and everything else hidden
			$( ".gallery-data" ).each(function() {
				if($(this).attr("id") == id){
					$(this).show();
				}
				else{
					$(this).hide();
				}
			});
			
			gadgets.window.adjustHeight();
			
//			for(var i=0;i<result.feed.entries.length; ++i){
				
				
//				var container = document.getElementById(displayDivId);
				
//				var h = document.createElement("h3");
//				h.className = "page-title";
//				h.innerHTML = entry.title;
//				container.appendChild(h);
				
//				var content = document.createElement("div");
//				content.innerHTML = entry.content;
//				container.appendChild(content);
//			}
//			gadgets.window.adjustHeight();
		}
		else{
			throw new Error("Failed to load feed ".concat(feed_url));
		}
	});			
}

//A utility function which shows contents of a given page in a specified display div
function showPageContents(pathToPage, displayDivId, cacheSeed){
	var feed_url_base = "https://sites.google.com/feeds/content/"; 
	var feed_url = feed_url_base.concat(siteDomain, "/", siteName, "/?path=", pathToPage, "&t=", cacheSeed);

	var feed = new google.feeds.Feed(feed_url);
	feed.includeHistoricalEntries();
	feed.load(function(result) {
		if (!result.error) {
			if(result.feed.entries.length > 0){
				var entry = result.feed.entries[0];
				var container = document.getElementById(displayDivId);
				
				var h = document.createElement("h3");
				h.className = "page-title";
				h.innerHTML = entry.title;
				container.appendChild(h);
				
				var content = document.createElement("div");
				content.innerHTML = entry.content;
				container.appendChild(content);
			}
			gadgets.window.adjustHeight();
		}
	});			
} //End: function showPageContents(paregnPageId, displayDivId)


//function to convert date into a string
//Intl.DateTimeFormat does a nice job but it fails for Safari 
function Date2Str(date){
	var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October",  "November", "December"];
	
}


//A utility function which shows posts from an announcement-type page in a specified display div
function showAnnouncements(parentPagePath, displayDivId, panelHeading, cacheSeed){
	var feed_url_base = "https://sites.google.com/feeds/content/"; 
	var feed_url = feed_url_base.concat(siteDomain, "/", siteName, "/?path=", parentPagePath, "&t=", cacheSeed);

	$.ajax({
	  url: feed_url,
	  dataType: "jsonp",
	  success: function (data) {
	  	var feed = jQuery.parseXML(data).documentElement;
	  	var entries = feed. getElementsByTagName("entry");
	  	if(entries.length > 0){
	  		var ids = entries[0].getElementsByTagName("id");
	  		if(ids.length > 0){
		  		var url = $(ids[0]).text();
		  		if(url.endsWith("/")){
		  			url = url.slice(0,-1);
		  		}
		  		var pos = url.lastIndexOf("/");
		  		var id = url.slice(pos+1);

		  		showAnnouncements2(id, displayDivId, panelHeading, cacheSeed);
		  	}
	  	}



	  }
	});
}

function showAnnouncements2(parentPageId, displayDivId, panelHeading, cacheSeed){
	var feed_url_base = "https://sites.google.com/feeds/content/"; 
	var feed_url = feed_url_base.concat(siteDomain, "/", siteName, "/?parent=", parentPageId, "&t=", cacheSeed);
	var feed = new google.feeds.Feed(feed_url);
	feed.load(function(result) {
		var container = document.getElementById(displayDivId);
		if (!result.error) {
			
			//Panel heading for all devices that are larger than xs
			var heading = document.createElement("h3");
			heading.className = "feed-panel-heading hidden-xs";
			heading.appendChild(document.createTextNode(panelHeading));
			container.appendChild(heading);
			
			//panel heading for xs devices, which uses same styles as page titles
			heading = document.createElement("h3");
			heading.className = "page-title visible-xs";
			heading.appendChild(document.createTextNode(panelHeading));
			container.appendChild(heading);
			
			for (var i = 0; i < result.feed.entries.length; i++) {
				if(i >= 4){
					break;
				}

				//item wrapper
				var entry = result.feed.entries[i];
				var div = document.createElement("div");
				div.className = "feed-item";
				
				//item heading
				var h = document.createElement("a");
				$(h).attr("href", entry.link);
				$(h).attr("target", "_top");
				$(h).addClass("feed-item-title");
				h.appendChild(document.createTextNode(entry.title));
				div.appendChild(h);

				//posted time
				var published = document.createElement("div");							
				var formatter = moment(entry.publishedDate, "UTZ");
				var date_str = formatter.format('dddd MMMM DD, YYYY');	
				published.appendChild(document.createTextNode("Posted: ".concat(date_str)));
				$(published).addClass("feed-item-posted-date");
				//div.appendChild(published);

				//getting the first image, if any
				var content = document.createElement("content");
				content.innerHTML = entry.content;        
				var images = $(content).find('img').map(function(){
					return $(this).attr('src')
				}).get();					
				if(images.length > 0){
					var thumb = document.createElement("div");
					$(thumb).addClass("feed-item-thumb");
					$(thumb).css("background-image", "url(".concat(images[0],")"));

					div.appendChild(thumb);
				}
				
				//item body
				var content_div = document.createElement("div");
				content_div.appendChild(document.createTextNode(entry.contentSnippet));
				div.appendChild(content_div);
				
				//item read-more link
				var more = document.createElement("a");
				$(more).attr("href", entry.link);
				$(more).attr("target", "_top");
				more.appendChild(document.createTextNode(" more"));
				content_div.appendChild(more);
				
				//var clear = document.createElement("div");
				//$(clear).css("clear", "both"));
				//div.appendChild(clear);

				container.appendChild(div);
			}
			
			gadgets.window.adjustHeight();
		}
		else{
			container.innerHTML = "Failed to load items from the feed.";
		}
	});			
} //End: function showAnnouncements(paregnPageId, displayDivId)


//A utility function that shows images in a given page in the carousel
function showCarouselImages(pathToDataPage, displayDivId, cacheSeed, aspectRatio){
	var feed_url_base = "https://sites.google.com/feeds/content/"; 
	var feed_url = feed_url_base.concat(siteDomain, "/", siteName, "/?path=", pathToDataPage, "&t=", cacheSeed);
	var feed = new google.feeds.Feed(feed_url);
	
	//setting carousel dimentions
	var display_div_id = "#".concat(displayDivId);
	var carousel_width = $(display_div_id).width();
	var carousel_height = Math.round(aspectRatio * carousel_width);
	$(display_div_id).height(carousel_height);
	gadgets.window.adjustHeight();
	
	//Loading carousel images from the data page
	feed.load(function(result) {
		if (!result.error) {
			if(result.feed.entries.length > 0){
				var entry = result.feed.entries[0];
				var container = document.getElementById(displayDivId);

				//Creating cwrapper for arousel indicators
				var ol = document.createElement("ol");
				$(ol).addClass("carousel-indicators");
				container.appendChild(ol);

				//Creating wrapper for slides
				var carousel_inner = document.createElement("div");
				$(carousel_inner).attr("role", "listbox");
				$(carousel_inner).addClass("carousel-inner");
				container.appendChild(carousel_inner);

				//Creating left control
				var left = document.createElement("a");
				$(left).addClass("left");
				$(left).addClass("carousel-control");
				$(left).attr("href", displayDivId);
				$(left).attr("role", "button");
				$(left).attr("data-slide", "prev");
				$(left).html("<span class='glyphicon glyphicon-chevron-left' aria-hidden='true'></span> <span class='sr-only'>Previous</span>");
				container.appendChild(left);


				//Creating right control
				var right = document.createElement("a");
				$(right).addClass("right");
				$(right).addClass("carousel-control");
				$(right).attr("href", displayDivId);
				$(right).attr("role", "button");
				$(right).attr("data-slide", "next");
				$(right).html("<span class='glyphicon glyphicon-chevron-right' aria-hidden='true'></span> <span class='sr-only'>Next</span>");
				container.appendChild(right);

				//getting the first image, if any
				var content = document.createElement("content");
				content.innerHTML = entry.content;        
				var images = $(content).find('img').map(function(){
					return $(this).attr('src')
				}).get();	

				for(var i=0; i<images.length; i = i+1){
					var img = images[i];

					//adding indicator
					var li = document.createElement("li");
					$(li).attr("data-target", displayDivId);
					$(li).attr("data-slide-to", i);
					if(i == 0){
						$(right).addClass("active");
					}
					ol.appendChild(li);


					//adding image
					var img_div = document.createElement("div");
					$(img_div).css("background-image", "url('".concat(img, "')"));
					$(img_div).addClass("item");
					if(i == 0){
						$(img_div).addClass("active");
					}
					carousel_inner.appendChild(img_div);

				}
				gadgets.window.adjustHeight();			
			}
		}
	});			
} //End: function showPageContents(paregnPageId, displayDivId)

