
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
	//KR: gadgets.window.adjustHeight();
	
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
				$(left).attr("href", "#" + displayDivId);
				$(left).attr("role", "button");
				$(left).attr("data-slide", "prev");
				$(left).html("<span class='glyphicon glyphicon-chevron-left' aria-hidden='true'></span> <span class='sr-only'>Previous</span>");
				container.appendChild(left);


				//Creating right control
				var right = document.createElement("a");
				$(right).addClass("right");
				$(right).addClass("carousel-control");
				$(right).attr("href", "#" + displayDivId);
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
					$(li).attr("data-target", "#" + displayDivId);
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

function show(divId){
	$("#" + divId).show();
	gadgets.window.adjustHeight();	
}

function hide(divId){
	$("#" + divId).hide();
	gadgets.window.adjustHeight();	
}

function appendItemToFeed(title, description, shortDescLength, thumbnailUrl, fullPageUrl, type, start, end, targetDiv){
	if(title == undefined)
		return;
	
	//item wrapper
	var wrapper = document.createElement("div");
	targetDiv.appendChild(wrapper);
	$(wrapper).addClass("feed-item");
	if(type != undefined)
		$(wrapper).addClass(type);
	
	//item heading
	var h = document.createElement("div");
	wrapper.appendChild(h);
	$(h).addClass("feed-item-title");
	if(type == "warning")
		title = "<span class='glyphicon glyphicon-warning-sign'></span>&nbsp;" + title;
	$(h).html(title);
	
	//Date/time
	var t = document.createElement("div");
	wrapper.appendChild(t);
	$(t).addClass("feed-item-time");
	var t_str = null;
	if(start.dateTime == undefined){
		//an all-day event
		start = new Date(start.date.split('-').join('/'));
		end = new Date(end.date.split('-').join('/'));
		end.setTime(end.getTime() - 1);
		if(start == end)
			t_str = start.toDateString();
		else
			t_str = start.toDateString() + " - " + end.toDateString();
	}
	else{
		start = new Date(start.dateTime);
		end = new Date(end.dateTime);
		
		if(start.getDate() == end.getDate())
			t_str = start.toDateString() + ", " + start.toLocaleTimeString();
		else
			t_str = start.toDateString() + " - " + end.toDateString();
	}
	t.appendChild(document.createTextNode(t_str));
		
	//item thumbnail
	if(thumbnailUrl != undefined){
		var thumb = document.createElement("div");
		wrapper.appendChild(thumb);
		$(thumb).addClass("feed-item-thumb");
		$(thumb).css("background-image", "url(".concat(thumbnailUrl,")"));
	}
	
	
	//item body
	var snippet_div = document.createElement("div");
	wrapper.appendChild(snippet_div);
	$(wrapper).show();
	
	if(description != undefined){
		var short_desc = null;
		var trimmed = false;
		if(shortDescLength != undefined && description.length > shortDescLength){
			//trim the string to the maximum length
			var short_desc = description.substr(0, shortDescLength);
			
			//re-trim if we are in the middle of a word
			short_desc = short_desc.substr(0, Math.min(short_desc.length, short_desc.lastIndexOf(" ")));
			
			if(short_desc.length < description.length)
				trimmed = true;
		}
		else
			short_desc = description;
		
		$(snippet_div).html(short_desc);
		
		if(trimmed){
			
			if(fullPageUrl == null){
				var full_desc_div = document.createElement("div");
				wrapper.appendChild(full_desc_div);
				$(full_desc_div).hide();	

				var snippet_id = "sn_" + new Date().getTime() + Math.random().toString().substr(2,100);
				$(snippet_div).attr("id", snippet_id);
				
				var full_desc_id = "fd_" + new Date().getTime() + Math.random().toString().substr(2,100);
				$(full_desc_div).attr("id", full_desc_id);

				$(snippet_div).html($(snippet_div).html() + " ... <a href = '#' onclick='show(\"" + full_desc_id + "\"); hide(\"" + snippet_id + "\"); return false;' >more.</a>");
				
				description = description.trim().replace("\n", "<br /><br />");
				$(full_desc_div).html(description + " <a href = '#' onclick='show(\"" + snippet_id + "\"); hide(\"" + full_desc_id + "\"); return false;' >See less.</a>");
			}
			else{
				var canonical_site_url = "https://sites.google.com/a/" + siteDomain + "/" + siteName;
				var more = document.createElement("a");
				var more_link =  (siteRoot != null && siteRoot.length > 0) ? fullPageUrl.replace(canonical_site_url, siteRoot) : fullPageUrl;
				$(snippet_div).html($(snippet_div).html() + " ... <a href = '" + more_link + "' target = '_top' >more.</a>");
			}
		}
	}
}

function appendCalendarItemToFeed(item, shortDescLength, targetDiv){
	
	var thumbnailUrl = null;
	var fullPageUrl = null;
	var type = null;
	
	if(item.description != undefined){
		var metadata = item.description.match(/\[.*\]/g); //Matches anything that comes within square brackets.
		if(metadata != undefined){
			for(var i=0; i<metadata.length; ++i){
				var meta = metadata[i];
				var remove_meta = false;
				if(meta.match(/^\[T:/i)){
					//Thumbnail URL
					thumbnailUrl = meta.substring(3, meta.length-1);
					remove_meta = true;
				}
				else if(meta.match(/^\[P:/i)){
					//Full Page URL
					fullPageUrl = meta.substring(3, meta.length-1);
					remove_meta = true;
				}
				else if(meta.match(/^\[Type:/i)){
					//Type
					type =  meta.substring(6, meta.length-1).trim().toLowerCase();
					remove_meta = true;
				}
				
				if(remove_meta)
					item.description = item.description.replace(meta, "");
			}
		}
	}
	appendItemToFeed(item.summary, item.description, shortDescLength, thumbnailUrl, fullPageUrl, type, item.start, item.end, targetDiv);
}


function showCalendarEvents(calendarId, apiKey, displayDivId, panelHeading, shortDescLength, maxItems, startTime, endTime){

	if(startTime == null)
		startTime = new Date();


	if(panelHeading != undefined){
		var container = document.getElementById(displayDivId);
		
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
	}

	var url = 'https://www.googleapis.com/calendar/v3/calendars/' + calendarId + 
			  '/events?alwaysIncludeEmail=false&orderBy=startTime&singleEvents=true' + 
			  '&timeMin=' + startTime.toISOString() + 
			  '&key=' + apiKey;
			  
	if(endTime != undefined)
		url = url + '&timeMax=' + endTime.toISOString();

	if(maxItems != undefined)
		url = url + '&maxResults=' + maxItems;

	url = encodeURI(url);

	$.ajax({
	    type: 'GET',
	    url: url,
	    dataType: 'json',
	    success: function (response) {
	        //do whatever you want with each
	        var container = document.getElementById(displayDivId);
			
			if(maxItems == undefined || maxItems > response.items.length)
				maxItems = response.items.length;

	        for(var i=0; i<maxItems; ++i){
	        	appendCalendarItemToFeed(response.items[i], shortDescLength, container);
	        }
	    },
	    error: function (response) {
	        //tell that an error has occurred
	    }
	});	
}
