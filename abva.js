

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
function showAnnouncements(paregnPageId, displayDivId, panelHeading, cacheSeed){
	var feed_url_base = "https://sites.google.com/feeds/content/"; 
	var feed_url = feed_url_base.concat(siteDomain, "/", siteName, "/?parent=", paregnPageId, "&t=", cacheSeed);
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


//A utility function that shows images gallery
function showGallery(pathToGalleryDataRoot, displayDivId, cacheSeed, aspectRatio){
	var feed_url_base = "https://sites.google.com/feeds/content/"; 
	var feed_url = feed_url_base.concat(siteDomain, "/", siteName, "/?path=", pathToGalleryDataRoot, "&t=", cacheSeed);

	.ajax({
	  url: feed_url,
	  dataType: "jsonp",
	  success: function (data) {
	    console.log(data)
	    alert(data);
	  }
	});
}

