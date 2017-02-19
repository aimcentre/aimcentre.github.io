function kkInit(wrapperId, title)
{
	var wrapper = "#" + wrapperId;
	if(title != undefined)
		$(wrapper).append('<span class="title">' + title + '</span>')
		$(wrapper).append(
		'<span class="kk-player">\
			<span class="kk-playtoggle"></span>\
			<span class="kk-gutter" class="ui-slider ui-slider-horizontal ui-widget ui-widget-content ui-corner-all">\
				<span class="kk-handle" class="ui-slider-handle"></span>\
			</span>\
			<span class="kk-loading"></span>\
			<audio preload="metadata">\
			</audio>\
			<span class="kk-timeleft"></span>\
		</span>\
		<span class="kk-download" style="display:none">Download: </span>'
		);

	var audio = $(wrapper + " audio").get(0);
	var timeleft = $(wrapper + " .kk-timeleft").get(0);
	var loadingIndicator = $(wrapper + ' .kk-loading').get(0);
	var playToggle = $(wrapper + ' .kk-playtoggle').get(0);
	var gutter = $(wrapper + ' .kk-gutter').get(0);
	var handle = $(wrapper + ' .kk-handle').get(0);

	var loaded = false;
	var positionIndicator = $(handle);

	var duration = "";
	var durationHrs = 0;

	$(timeleft).text(progressTime(0, 0));

	if ((audio.buffered != undefined) && (audio.buffered.length != 0)) {
	  $(audio).bind('progress', function() {
	     loaded = parseInt(((audio.buffered.end(0) / audio.duration) * 100), 10);
	    loadingIndicator.css({width: loaded + '%'});
	  });
	}
	else {
	  loadingIndicator.remove();
	}

	$(audio).bind('loadedmetadata', function() {
		$(timeleft).text(progressTime(0, audio.duration));
		loaded = true;
	    $(gutter).slider({
	      value: 0,
	      step: 0.01,
	      orientation: "horizontal",
	      range: "min",
	      max: audio.duration,
	      animate: true,
	      slide: function(e,ui) {
	        audio.currentTime = ui.value;
	      },
	      stop:function(e,ui) {
	        audio.currentTime = ui.value;
	      }
	    });
	});
	

	$(audio).bind('play',function() {
	  $(playToggle).addClass('playing');
	}).bind('pause ended', function() {
	  $(playToggle).removeClass('playing');
	});

	$(playToggle).click(function() {
	  if (audio.paused) { audio.play(); }
	  else { audio.pause(); }
	});

	$(audio).bind('timeupdate', function() {
		$(timeleft).text(progressTime(audio.currentTime, audio.duration));


	  var rem = parseInt(audio.duration - audio.currentTime, 10),
	  pos = (audio.currentTime / audio.duration) * 100,
	  mins = Math.floor(rem/60,10),
	  secs = rem - mins*60;

	  positionIndicator.css({left: pos + '%'});

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
