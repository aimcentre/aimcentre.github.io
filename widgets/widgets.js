
function show(divId){
	$("#" + divId).show();
}

function hide(divId){
	$("#" + divId).hide();
}

function showCalendarEvents(calendarId, apiKey, displayDivId, shortDescLength, maxItems, itemNum, groupByTitle, startTime, endTime, query, skipTypes){

	if(startTime == null)
		startTime = new Date();

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

	        if(itemNum >= 0){
	        	if(itemNum < response.items.length){
	        		appendCalendarItemToFeed(container, response.items[itemNum], shortDescLength, skipTypes);
	        	}
	        }
	        else{
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
	        }
	    },
	    error: function (response) {
	        //tell that an error has occurred
	    }
	});	
}

function appendItemToFeed(targetDiv, title, description, shortDescLength, thumbnailUrl, fullPageUrl, type, start, end, tagline, attachments, sponsor){
	if(title == undefined)
		return;
	
	//item wrapper
	var wrapper = document.createElement("div");
	targetDiv.appendChild(wrapper);
	$(wrapper).addClass("feed-item");
	$(wrapper).addClass("col-sm-3");

	
	var type_list = type != undefined ? $.map(type.split(","), $.trim) : [];
	var is_warning = $.inArray("warning", type_list) > -1;
	
	if(type != undefined){
		type = type.replace(",", " ");
		$(wrapper).addClass(type);

		if(!is_warning)
			$(wrapper).addClass("alert");
	}

	//item thumbnail
	var thumb = document.createElement("div");
	wrapper.appendChild(thumb);
	$(thumb).addClass("thumb");
	var width = $(thumb).width();
	var height = Math.round(0.7 * width);
	$(thumb).height(height);

	if(thumbnailUrl != undefined){
		$(thumb).css("background-image", "url(".concat(thumbnailUrl,")"));
	}
	
	
	//item heading
	var h = document.createElement("h2");
	wrapper.appendChild(h);

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
	
	/*
	
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

	*/
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
		//replacing any html line breaks with newline characters
		item.description = item.description.replace(/<br>/g, "\n");
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



