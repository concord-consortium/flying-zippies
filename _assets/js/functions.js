var audio_icon_flasher, next_icon_flasher, video_status;

var text_display = getParameterByName('text');

$(document).ready(function() {
  if (text_display == 'off') {
    $('#text p').hide();
    $('a').each(function(){
      var link_href = $(this).attr('href');
      if (link_href != '#') {
        link_href = link_href + '?text=off';
        $(this).attr('href', link_href);
      }
    });
  } else {
    $('#text p').show();
  }
  if ($('#play').length) {
    video_status = setTimeout('checkVideoLoadStatus()', 10);
  }
});

function checkVideoLoadStatus() {
  var isiPad = navigator.userAgent.match(/iPad/i) != null;
  console.log(isiPad);
  if (!isiPad && $('#video').length) {
    if ($('#video').get(0).readyState >= 4) {
      //console.log('video ready');
      clearTimeout(video_status);
      $('#loading').fadeOut('fast');
      // initiate audio icon flashing
      audioIconFlasher('go');
      // set up event listener for when audio clip ends
      var audio_player = $("#audio1");
      //audio_player.on('ended', loadNextAudioClip);
      // set up event listener for when audio clip plays
      //audio_player.on('play', loadNextInstructionSet);

      // disable next page link
      disableNextLink();
    } else {
      //console.log($('#video').get(0).readyState);
      video_status = setTimeout('checkVideoLoadStatus()', 10)
    }
  } else {
    clearTimeout(video_status);
    $('#loading').fadeOut('fast');
    // initiate audio icon flashing
    audioIconFlasher('go');
    // set up event listener for when audio clip ends
    var audio_player = $("#audio1");
    // disable next page link
    disableNextLink();
  }
}

function showTheModel() {
  if ($('#video').length > 0) {
    $('#video').get(0).pause();
    $('#video').fadeOut('fast');
  }
  $('#model-container').show();
  interactive.post('play');
}

function hideTheModel() {
  interactive.post('stop');
  $('#model-container').hide();
  if ($('#video').length > 0) {
    $('#video').show();
  }
}

function playAudio() {
  if (!isPlaying($('#audio').get(0))) {
    $('#audio').get(0).play();
    audioIconFlasher('stop');
    if ($('#video').length > 0) {
      $('#video').get(0).play();
    }
  }
  return false;
  /* var audio_file = document.getElementById('audio1').src.split(/(\\|\/)/g).pop();
  audio_letter = audio_file.replace(/\.mp3$/g, '');
  audio_number = audio_letter.replace(/[a-z]$/g, '');
  audio_letter = audio_letter.replace(/^\d+/g, '');
  //document.getElementById('audio1').play();
  if ((audio_letter == 'a' || audio_letter == '') && document.getElementById('video1')) {
  //  document.getElementById('video1').play();
  //    document.getElementById('video1').onended = function() {
  //      showModel();
  //    }
  }
  if (audio_letter == 'b') {
    if (document.getElementById('model-container')) {
      showModel();
    }
  }
  //audioIconFlasher('stop');
  return false; */
}
function isPlaying(audioElem) { return !audioElem.paused; }

function audioIconFlasher(action) {
  clearTimeout(audio_icon_flasher);
  $('#play').removeClass('disabled').on('click', playAudio);
  var audio_icon = document.getElementById('play');
  if (action == 'stop') {
	  audio_icon.style.opacity = 1;
  } else {
  	if (audio_icon.style.opacity == 1 || audio_icon.style.opacity == '') {
  	  audio_icon.style.opacity = .6;
  	} else {
  	  audio_icon.style.opacity = 1;
  	}
  	audio_icon_flasher = setTimeout("audioIconFlasher('go')", 400);
  }
}

function nextIconFlasher(action) {
  clearTimeout(next_icon_flasher);
  if (action == 'stop') {
	  $('#right').css({'opacity': '1'});
    $('#zippy').hide();
  } else {
    setTimeout("$('#zippy').show()", 5000);
  	if ($('#right').css('opacity') == 1 || $('#right').css('opacity') == '') {
  	  $('#right').css({'opacity': '.6'});
  	} else {
  	  $('#right').css({'opacity': '1'});
  	}
	  next_icon_flasher = setTimeout("nextIconFlasher('go')", 400);
  }
}

// controls changing the instructional text to match spoken audio when necessary
function loadNextInstructionSet() {
  if (!(typeof instructions_counter === 'undefined')) {
    $('#text p').html(instructions[instructions_counter]);
    instructions_counter++;
  }
}

// loads next audio clip when appropriate and/or enables next page link
function loadNextAudioClip() {
  var audio_clips = ['a','b','c','d'];
  var audio_icon = document.getElementById('play');
  var audio_clip = document.getElementById('audio1');
  audio_icon.style.opacity = .6;
  //$('#play').unbind('click');

  // get audio clip file name and number and letter from file name
  var audio_number, audio_letter, next_file;
  var audio_file = audio_clip.src.split(/(\\|\/)/g).pop();
  audio_number = audio_file.replace(/\w\.mp3$/g, '');
  audio_letter = audio_file.replace(/\.mp3$/g, '');
  audio_letter = audio_letter.replace(/^\d+/g, '');

  // load next clip if current clip isn't last
  if (audio_letter == 'a') {
    next_file = audio_number + '-b.mp3';
    audio_clip.src = '_assets/audio/' + next_file;
    // wait ten seconds, then start flashing the audio icon
    audio_icon_flasher = setTimeout("audioIconFlasher('go')", 10000);
  } else if (audio_letter == 'b') {
    next_file = audio_number + '-c.mp3';
    audio_clip.src = '_assets/audio/' + next_file;
    // wait ten seconds, then start flashing the audio icon
    audio_icon_flasher = setTimeout("audioIconFlasher('go')", 10000);
  } else if (audio_letter == 'c') {
    next_file = audio_number + '-d.mp3';
    audio_clip.src = '_assets/audio/' + next_file;
    // wait ten seconds, then start flashing the audio icon
    audio_icon_flasher = setTimeout("audioIconFlasher('go')", 10000);
  } else {
    // enable next page link
    enableNextLink();
  }
}

// disables next page link
function disableNextLink() {
  var next_link = $('#right');
  next_link.addClass('disabled');
  var href = next_link.attr('href');
  next_link.attr('href_bak', href);
  next_link.attr('href','#');
}

// enables next page link
function enableNextLink() {
  var next_link = $('#right');
  var href = next_link.attr('href_bak');
  next_link.attr('href', href);
  next_link.removeClass('disabled');
  nextIconFlasher('go');
}

function highlightWord(word_index) {
  $('#text p span').each(function(index){
    if (index != word_index - 1) {
      $(this).css({'background': 'transparent'});
    } else {
      $(this).css({'background': '#ff0'});
    }
  });
}

function processText(instructions) {
  var processed_instructions = [];
  for (var ii = 0; ii < instructions.length; ii++) {
    var words = instructions[ii].split(' ');
    var instruction_string = '';
    for (var wi = 0; wi < words.length; wi++) {
      instruction_string += '<span>' + words[wi] + '</span> ';
    }
    processed_instructions.push(instruction_string);
  }

  return processed_instructions;
}

function initializePage() {
  $('#audio').get(0).pause();
  $('#audio').get(0).currentTime = 0;
  if ($('#video').length > 0) {
    $('#video').get(0).pause();
    $('#video').get(0).currentTime = 0;
  }
  $('#audio').bind('play', function() {
    back_click = false;
    setUpBackLink();
  });
  $('#audio').bind('ended', function() {
    $('#play').addClass('disabled');
    setTimeout('enableNextLink()', 2000);
  });
  if (!$('#zippy').length) {
    $('#controls').append('<div id="zippy"></div>');
  }
  $('#text p').empty();
}

function setUpBackLink() {
  $('#left').click(function(event) {
    if (back_click) {
      $('#left').unbind('click');
      return true;
    } else {
      event.preventDefault();
      back_click = true;
      initializePage();
    }
  });
}

function getParameterByName(name, url) {
  if (!url) {
    url = window.location.href;
  }
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}
