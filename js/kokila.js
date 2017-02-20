function kkInit(wrapperId, title)
{
	var wrapper = "#" + wrapperId;
	if(title != undefined)
		$(wrapper).append('<span class="kk-title">' + title + '</span>')
		$(wrapper).append(
		'<span class="kk-player">\
			<span class="kk-playtoggle glyphicon glyphicon-play"></span>\
			<span class="kk-gutter" class="ui-slider ui-slider-horizontal ui-widget ui-widget-content ui-corner-all">\
				<span class="kk-handle" class="ui-slider-handle"></span>\
			</span>\
			<span class="kk-loading"></span>\
			<audio preload="metadata">\
			</audio>\
			<span class="kk-timeleft"></span>\
		</span>\
		<span class="kk-download glyphicon glyphicon-arrow-down" style="display:none"></span>'
		);

	//Create variables to access player elements based on the wrapper id and the element class
	var audio = $(wrapper + " audio").get(0);
	var timeleft = $(wrapper + " .kk-timeleft").get(0);
	var playToggle = $(wrapper + ' .kk-playtoggle').get(0);
	var gutter = $(wrapper + ' .kk-gutter').get(0);
	var positionIndicator = $(wrapper + ' .kk-handle').get(0);
	var loadingIndicator = $(wrapper + ' .kk-loading').get(0);

	var loaded = false;
	var manualPositioning = false;
	var playPositionAtPause = 0;

	var duration = "";
	var durationHrs = 0;

	$(timeleft).text(progressTime(0, 0));

	if ((audio.buffered != undefined) && (audio.buffered.length != 0)) {
	  $(audio).bind('progress', function() {
	  	$(loadingIndicator).show();
	  	loaded = parseInt(((audio.buffered.end(0) / audio.duration) * 100), 10);
	    loadingIndicator.css({width: loaded + '%'});
	  });
	}
	else {
	  $(loadingIndicator).hide();
	}

	$(audio).bind('loadedmetadata', function() {
		loaded = true;

		if(playPositionAtPause > 0)
			audio.currentTime = playPositionAtPause;

		$(timeleft).text(progressTime(audio.currentTime, audio.duration));

	    $(gutter).slider({
	      value: 0,
	      step: 0.01,
	      orientation: "horizontal",
	      range: "min",
	      max: audio.duration,
	      animate: true,
	      slide: function(e,ui) {
	      	manualPositioning = true;
	      	var pos = (ui.value / audio.duration) * 100;
	      	$(positionIndicator).css({left: pos + '%'});
	      	$(timeleft).text(progressTime(ui.value, audio.duration));
	      },
	      stop:function(e,ui) {
	      	manualPositioning = false;
	        audio.currentTime = ui.value;
	      }
	    });
	});
	
/*
	$(audio).bind('play',function() {
	  $(playToggle).addClass('playing');
	}).bind('pause ended', function() {
	  $(playToggle).removeClass('playing');
	});
*/
	$(playToggle).click(function() {
	  if (audio.paused) {
	  	audio.play(); 
	  	$(playToggle).addClass('glyphicon-pause');
	  	$(playToggle).removeClass('glyphicon-play');
	  	//$(playToggle).addClass('playing');
	  }
	  else { 
	  	audio.pause();
	  	playPositionAtPause = audio.currentTime;
	  	$(playToggle).addClass('glyphicon-play');
	  	$(playToggle).removeClass('glyphicon-pause');
	  	//$(playToggle).removeClass('playing');
	  	audio.load();
	  }
	});

	$(audio).bind('timeupdate', function() {
		if(!(manualPositioning || isNaN(audio.duration))){
			$(timeleft).text(progressTime(audio.currentTime, audio.duration));
			var pos = (audio.currentTime / audio.duration) * 100;
			$(positionIndicator).css({left: pos + '%'});
		}
	});
}

function sec2HMS(seconds, forceHours){
	var hrs = Math.floor(seconds / 3600);
	var min = Math.floor((seconds - hrs * 3600)/ 60);
	var sec = Math.ceil(seconds - hrs * 3600 - min * 60);
	return (forceHours || hrs > 0 ? hrs + ":" : "") + Math.round(min) + ":" + Math.round(sec);
}

function progressTime(current, total){

	var showHours = total > 3600;
	var denominator = sec2HMS(total, showHours);
	var numerator = sec2HMS(current, showHours);
	return numerator + " / " + denominator;

}

function kkAddSource(wrapperId, url, type, allowDownload){
	var audio = $("#" + wrapperId + " audio").get(0);
	$(audio).append('<source src="' + url + '" type="audio/' + type + '" />')

	if(allowDownload){
		var download = $("#" + wrapperId + ' .kk-download').get(0);
		$(download).html($(download).html() + ' <a href="'+url+'" download>'+type+'</a>');
		$(download).show();

	}
		
}
