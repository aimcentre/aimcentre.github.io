

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

