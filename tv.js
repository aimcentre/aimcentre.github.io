
function initSlideshow(showIndicators){

	var now = new Date();
	var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	var tonight = new Date(today.getTime() + 24 * 60 * 60 * 1000 - 1000);	

	var url = 'https://www.googleapis.com/calendar/v3/calendars/' + CALENDAR_ID + '/events?key=' + API_KEY
			  + '&timeMin=' + now.toISOString()
			  + '&timeMax=' + tonight.toISOString();

	url = encodeURI(url);

	$.ajax({
	    type: 'GET',
	    url: url,
	    dataType: 'json',
	    success: function (response) {

	    	var slides = [];
	        for(var i=0; i<response.items.length; ++i){

	        	var slide = getSlideInfo(response.items[i].description);
	        	slides.push(slide);
	        }

	        //checking if slides have been changed since previous loading.
	        var update_needed = false;
	        if(slides.length != PREV_SLIDES.length)
	        	update_needed = true;
	        else
	        {
	        	for(var i=0; i<slides.length; ++i)
	        	{
	        		if(hasMatchingSlideInfo(slides[i], PREV_SLIDES) == false)
	        		{
	        			update_needed = true;
	        			break;
	        		}
	        	}
	        }

	        if(update_needed)
	        {
	        	displaySlides(slides, showIndicators);
	        	PREV_SLIDES = slides;
	        	//console.log("Update needed");
	        }
	    },
	    error: function (response) {
	        //tell that an error has occurred
	        displaySlides([], showIndicators)
	    }
	});	
}

function displaySlides(dynamicSlides, showIndicators)
{
	//Creating the final set of slides by prepending the initial slides
	//to the dynamic slides, followed by finishing it with the conclusion slide
	var slides = [new slideInfo("First.jpg"), new slideInfo("Second.jpg")].concat(dynamicSlides);
	slides.push(new slideInfo("Last.jpg"));
	//slides.push(new slideInfo()); //An empty slide at the end

	//Remove current slides and indicators
	var slideRoot = $("#"+CAROUSEL_ID).find(".carousel-inner");
	var indicatorRoot = $("#"+CAROUSEL_ID).find(".carousel-indicators");

	$(slideRoot).empty();
	$(indicatorRoot).empty();

	for(i=0; i<slides.length; ++i)
	{
		var s = new carouselSlide(slides[i], i);
		$(slideRoot).append(s.slide);
		if(showIndicators)
			$(indicatorRoot).append(s.indicator);
	}

	initSize();

	$('.carousel').carousel({//initialize
        interval: false,
        pause: null
 	});

 	$('.carousel').carousel('cycle');

}

function getSlideInfo(description)
{
	var img = undefined;
	var desc = undefined;
	var type = undefined;

	if(description != undefined)
	{
		var metadata = description.match(/\[.*\]/g); //Matches anything that comes within square brackets.
		if(metadata != undefined)
		{
			for(var i=0; i<metadata.length; ++i)
			{
				var meta = metadata[i];
				var remove_meta = false;
				if(meta.match(/^\[Image:/i)){
					//Thumbnail URL
					img = meta.substring(7, meta.length-1);
					remove_meta = true;
				}
				else if(meta.match(/^\[Type:/i)){
					//Type
					type =  meta.substring(6, meta.length-1).trim().toLowerCase();
					remove_meta = true;
				}

				if(remove_meta)
					description = description.replace(meta, "");
			}
		}

		desc = description;
	}
	return new slideInfo(img, desc, type);
}

function slideInfo(img, desc, type)
{
	if(img != undefined)
		this.image = IMAGE_SOURCE_ROOT + img;
	this.description = desc;
	this.type = type;
}

function hasMatchingSlideInfo(needle, heystack)
{
	var match_found = false;
	for(var i=0; i<heystack.length; ++i)
	{
		match_found = needle.image == heystack[i].image && needle.description == heystack[i].description && needle.type == heystack[i].type;
		if(match_found)
			break;
	}
	return match_found;
}

function carouselSlide(slideInfoObj, index)
{
	//creating the slide
	var div = document.createElement('div');
	if(index == 0)
		$(div).addClass("item active");
	else
		$(div).addClass("item");

	if(slideInfoObj.image != undefined)
	{
		var style = "background-image:url('" + slideInfoObj.image + "')";
		$(div).attr("style", style);
	}

	this.slide = div;

	//creating the indicator
	if(slideInfoObj.image != undefined)
	{
		var ind = document.createElement('li');
		if(index == 0)
			$(ind).addClass("active");
		$(ind).attr("data-target", CAROUSEL_ID);
		$(ind).attr("data-slide-to", index);
		this.indicator = ind;		
	}
}

function initSize()
{
	$('#' + CAROUSEL_ID).css('height', $(window).height());
	$('.item').css('height', $(window).height() - FOOTER_HEIGHT);
}