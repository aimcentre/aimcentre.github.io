
//A utility function which shows contents of a given page in a specified display div
function showPageContents(pathToPage, displayDivId, cacheSeed, showPageTitle){
	var feed_url_base = "https://sites.google.com/feeds/content/"; 
	var feed_url = feed_url_base.concat(siteDomain, "/", siteName, "/?path=", pathToPage, "&t=", cacheSeed);

	var feed = new google.feeds.Feed(feed_url);
	feed.includeHistoricalEntries();
	feed.load(function(result) {
		if (!result.error) {
			if(result.feed.entries.length > 0){
				var entry = result.feed.entries[0];
				showText(displayDivId, 
					     showPageTitle == true ? entry.title : null,
					     entry.content);
			}
		}
	});			
} //End: function showPageContents(paregnPageId, displayDivId)

function showText(displayDivId, title, text){
	var container = document.getElementById(displayDivId);
	
	if(title != undefined){
		var h = document.createElement("h3");
		h.className = "page-title";
		h.innerHTML = title;
		container.appendChild(h);
	}

	var content = document.createElement("div");
	content.innerHTML = text;
	container.appendChild(content);

	if(gadgetMode)
		gadgets.window.adjustHeight();

} //End: function showText(displayDivId, title, text)

//A utility function that shows images in a given page in the carousel
function showCarouselImages(pathToDataPage, displayDivId, cacheSeed, aspectRatio){

	//var my_site = "https://sites.google.com/site/" + siteDomain;
	//var site = SitesApp.getSite(my_site, siteName);

	var feed_url_base = "https://sites.google.com/feeds/content/"; 
	var feed_url = feed_url_base.concat(siteDomain, "/", siteName, "/?path=", pathToDataPage, "&t=", cacheSeed);
	
	var feed = new google.feeds.Feed(feed_url);
		
	//Loading carousel images from the data page
	feed.load(function(result) {
		if (!result.error) {
			if(result.feed.entries.length > 0){
				var entry = result.feed.entries[0];

				//getting the first image, if any
				var content = document.createElement("content");
				content.innerHTML = entry.content;        
				var images = $(content).find('img').map(function(){
					return $(this).attr('src')
				}).get();	

				showCarouselImagesFromArray(displayDivId, images, aspectRatio);
			}
		}
	});			

} //End: function showCarouselImages(pathToDataPage, displayDivId, cacheSeed, aspectRatio)

function showCarouselImagesFromArray(displayDivId, imgUrls, aspectRatio){
	
	//setting carousel dimentions
	var display_div_id = "#".concat(displayDivId);
	var carousel_width = $(display_div_id).width();
	var carousel_height = Math.round(aspectRatio * carousel_width);
	$(display_div_id).height(carousel_height);

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

	for(var i=0; i<imgUrls.length; i = i+1){
		var img = imgUrls[i];

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

	if(gadgetMode)
		gadgets.window.adjustHeight();			

} //End: function showCarouselImagesFromArray(displayDivId, imgUrls, aspectRatio)

function show(divId){
	$("#" + divId).show();
	if(gadgetMode)
		gadgets.window.adjustHeight();	
}

function hide(divId){
	$("#" + divId).hide();
	if(gadgetMode)
		gadgets.window.adjustHeight();	
}

function appendItemToFeed(targetDiv, title, description, shortDescLength, thumbnailUrl, fullPageUrl, type, start, end, tagline, attachments, sponsor){
	if(title == undefined)
		return;
	
	//item wrapper
	var outer_wrapper = document.createElement("div");
	targetDiv.appendChild(outer_wrapper);
	$(outer_wrapper).addClass("col-md-3");

	var wrapper = document.createElement("div");
	outer_wrapper.appendChild(wrapper);
	$(wrapper).addClass("feed-item");
	
	var type_defined = type != undefined;
	var type_list = type_defined ? $.map(type.split(","), $.trim) : [];
	var is_warning = $.inArray("warning", type_list) > -1;
	
	if(type_defined){
		type = type.replace(",", " ");
		$(wrapper).addClass(type);

		if(!is_warning)
			$(wrapper).addClass("alert");
	}
	
	//item heading
	var h = document.createElement("div");
	wrapper.appendChild(h);
	$(h).addClass("feed-item-title");
	if(is_warning)
		title = "<span class='glyphicon glyphicon-warning-sign'></span>&nbsp;" + title;
	$(h).html(title);
	
	//Sponsor
	if(sponsor != null){
		var sponsor_div = document.createElement("div");
		wrapper.appendChild(sponsor_div);
		$(sponsor_div).addClass("sponsor");
		$(sponsor_div).html(sponsor);
	}
	
	//Tagline
	var t = document.createElement("div");
	wrapper.appendChild(t);
	$(t).addClass("feed-item-time");
	
	var today = new Date();
	var tomorrow = new Date(today.getTime() + 86400000);
	
	if(start.dateTime == undefined){
		//an all-day event
		start = new Date(start.date.split('-').join('/'));
		end = new Date(end.date.split('-').join('/'));
		end.setTime(end.getTime() - 86400000);
		
		if(tagline == null){
			if(start.getDate() == end.getDate())
				tagline = start.toDateString();
			else
				tagline = start.toDateString() + " - " + end.toDateString();
		}
	}
	else{
		start = new Date(start.dateTime);
		end = new Date(end.dateTime);
		
		if(tagline == null){
			if(start.getDate() == end.getDate()){
				var s_h = start.getHours();
				var e_h = end.getHours();
				var s_ampm = (s_h < 12 && e_h >= 12) ? " AM" : "";
				var e_ampm = e_h < 12 ? " AM" : " PM";
				
				tagline = start.toDateString() + ", " + 
							(start.getHours() % 12) + ":" + ("0" + start.getMinutes()).slice(-2) + s_ampm + " - " + 
							(end.getHours() % 12) + ":" + ("0" + end.getMinutes()).slice(-2) + e_ampm;
				//tagline = start.toDateString() + ", " + start.toLocaleTimeString() + " - " + end.toLocaleTimeString();
			}
			else
				tagline = start.toDateString() + " - " + end.toDateString();
		}
	}
	
	var prefix = "";
	if(is_warning == false){
		if((start.getDate() == today.getDate()) && (start.getMonth() == today.getMonth()) && (start.getYear() == today.getYear()))
			prefix = "<span class='today'>Today: </span>";
		else if((start.getDate() == tomorrow.getDate()) && (start.getMonth() == tomorrow.getMonth()) && (start.getYear() == tomorrow.getYear()))
			prefix = "<span class='tomorrow'>Tomorrow: </span>";
	}
	$(t).html(prefix + tagline);
	
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
				
				$(full_desc_div).html(description + " <a href = '#' onclick='show(\"" + snippet_id + "\"); hide(\"" + full_desc_id + "\"); return false;' >less.</a>");
			}
			else{
				var canonical_site_url = "https://sites.google.com/a/" + siteDomain + "/" + siteName;
				var more = document.createElement("a");
				var more_link =  (siteRoot != null && siteRoot.length > 0) ? fullPageUrl.replace(canonical_site_url, siteRoot) : fullPageUrl;
				$(snippet_div).html($(snippet_div).html() + " ... <a href = '" + more_link + "' target = '_top' >more.</a>");
			}
		}
	}

	$(snippet_div).html($(snippet_div).html() + "<div style='clear:both'></div>");
	
	//Attachments
	if(attachments.length > 0){
		var attachments_div = document.createElement("div");
		wrapper.appendChild(attachments_div);
		$(attachments_div).addClass("attachments")
		for(var i=0; i< attachments.length; ++i){
			var attachment = document.createElement("div");
			attachments_div.appendChild(attachment);
			$(attachment).addClass("attachment");
			 
			var splitter_idx = attachments[i].indexOf(":=");
			var label = "";
			var href = "";
			if(splitter_idx > 0){
				label = attachments[i].substring(0, splitter_idx).trim();
				href = attachments[i].substring(splitter_idx+2, attachments[i].length).trim();
			}
			else{
				label = "Attachment " + (i+1);
				href = attachments[i].trim();
			}
			$(attachment).html("<span class='glyphicon glyphicon-link'></span>&nbsp;<a href='" + href + "' target='_top'>" + label + "</a>");
		}
	}
}

function appendCalendarItemToFeed(targetDiv, item, shortDescLength, skipTypes){
	
	var thumbnailUrl = null;
	var fullPageUrl = null;
	var type = null;
	var tagline = null;
	var allowGrouping = true;
	var attachments = [];
	var sponsor = null;

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
				else if(meta.match(/^\[Tagline:/i)){
					//Tagline
					tagline =  meta.substring(9, meta.length-1).trim();
					remove_meta = true;
				}
				else if(meta.match(/^\[Grouping:/i)){
					//Grouping
					if(meta.substring(10, meta.length-1).trim().toLowerCase() == "no")
						allowGrouping = false;
					remove_meta = true;
				}
				else if(meta.match(/^\[Attachment:/i)){
					//Attachments
					attachments.push(meta.substring(12, meta.length-1).trim());
					remove_meta = true;
				}
				else if(meta.match(/^\[Sponsor:/i)){
					//Sponsor
					sponsor =  meta.substring(9, meta.length-1).trim();
					remove_meta = true;
				}
				
				if(remove_meta)
					item.description = item.description.replace(meta, "");
			}
		}
	}

	if(skipTypes != undefined && type != undefined && ($.inArray(type, skipTypes) > -1))
		return false;

	appendItemToFeed(targetDiv, item.summary, item.description, shortDescLength, thumbnailUrl, fullPageUrl, type, item.start, item.end, tagline, attachments, sponsor);

	return allowGrouping;
}


function showCalendarEvents(calendarId, apiKey, displayDivId, panelHeading, shortDescLength, maxItems, groupByTitle, startTime, endTime, query, skipTypes){

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

	if(maxItems != undefined){
		if(groupByTitle == false)
			url = url + '&maxResults=' + maxItems;
		else
			url = url + '&maxResults=' + 10 * maxItems;
	}	

	if(query != undefined)
		url = url + '&q=' + query;

	url = encodeURI(url);

	$.ajax({
	    type: 'GET',
	    url: url,
	    dataType: 'json',
	    success: function (response) {
	        //do whatever you want with each
	        var container = document.getElementById(displayDivId);

	        var title_list = [];
	        var count = 0;
	        
	        if(response.items.length > 0)
	        	$("#" + displayDivId).show();
	        
	        for(var i=0; i<response.items.length; ++i){
	        	var title = response.items[i].summary;
	        	
	        	if(groupByTitle == true && $.inArray(title, title_list) >= 0)
	        		continue;
	        	
	        	var allow_grouping = appendCalendarItemToFeed(container, response.items[i], shortDescLength, skipTypes);

	        	if(allow_grouping)
	        		title_list.push(title);

	        	count = count + 1;

	        	if(maxItems != undefined &&  maxItems <= count)
	        		break;
	        }

	        if(gadgetMode)
	        	gadgets.window.adjustHeight();	
	    },
	    error: function (response) {
	        //tell that an error has occurred
	    }
	});	
}
