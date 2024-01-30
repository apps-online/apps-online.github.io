var audio = [];
function tone(note) {
    play(note, "tone");
}
function semitone(note) {
    play(note, "semitone");
}
function play(note, dir) {
    if (audio[note]) {
        audio[note].play();
    } else {
        audio[note] = document.createElement("audio");
        audio[note].setAttribute("src", "piano/" + dir + "/" + note + ".mp3");
        document.getElementsByTagName("head")[0].appendChild(audio[note]);
        audio[note].play();
    }
}
(function( $ ) {
  $.fn.vpcf = function(options) {
	var containing_div = this;
	
	var settings = $.extend( {
      number_of_keys : 35, // cannot exceed 83 nor be less than 35
      key_width : 35, // white key width in pixels
      key_height : 130, // white key height in pixels
      chord_color : '#f3c732', // color accent when a chord is chosen
      scale_color : '#b7d03e' // color accent when a scale is chosen

    }, options);
    
    return this.each(function() {    	
	    var chord_color = settings.chord_color;
	    var scale_color = settings.scale_color;
		var number_of_keys = settings.number_of_keys; // cannot exceed 83 nor be less than 35
		var key_width = settings.key_width;  // white key width in pixels
		var key_height = settings.key_height; // white key height in pixels
		
		
		var black_key_array = new Array(1,3,6,8,10,13,15,18,20,22,25,27,30,32,34,37,39,42,44,46,49,51,54,56,58,61,63,66,68,70,73,75,78,80,82);
		var black_key_offset = parseInt(key_width / 4); // offset (distance - offset = width between keys)   
		var black_key_width = parseInt(key_width/2);
		var black_key_height = parseInt(key_height/1.65);
		var black_key_position = 0; // current black key postion
		var white_key_counter = 0;
		
		var white_key_position = 0;   // current white key position
		
		var key_notes = new Array('C','C#','D','Eb','E','F','F#','G','G#','A','Bb','B','C','C#','D','Eb','E','F','F#','G','G#','A','Bb','B','C','C#','D');
		var root = ''; // root key, initially unassigned
		var key_step = 0; // how many steps to take from one note to the next
		
		// if number of keys undefined set to default of 35
		// else if number of keys exceeds 81 bump down else if it is less than 35, bump up
		if(isNaN(number_of_keys)){
		    number_of_keys = 35;
		}else if(number_of_keys > 83){
		    number_of_keys = 83;
		}else if(number_of_keys < 35){
		    number_of_keys = 35;
		}else{}
		
		// find a Middle C key number - (12 is the number of keys from one octave to the next) 
		var middle_c = Math.round((number_of_keys) / 12 );
		middle_c = (Math.round(middle_c / 2) * 12) - 13;
		
		// if number of keys ends on a black key, bump up +1 to end on a white key
		if($.inArray(number_of_keys, black_key_array) != -1){
			number_of_keys = number_of_keys + 1;
		}
				
		// create containing divs for virtual piano chords
		$(containing_div).append('<div id="vpcf_container"></div>');
		$(containing_div).append('<div id="vpcf_controls"></div>');
		
		// Print the keys to screen
		for(key=0;key<=number_of_keys;key++){
			// if key is a black key
			if($.inArray(key, black_key_array) != -1){
			    black_key_position = (key_width * white_key_counter) - black_key_offset;
		    	$('#vpcf_container').append('<div class="vpcf_black_key" id="vpcf_key_'+key+'" style="margin-left:'+black_key_position+'px;width:'+black_key_width+'px;height:'+black_key_height+'px;"></div>');
			}else{
		    	$('#vpcf_container').append('<div class="vpcf_white_key" id="vpcf_key_'+key+'" style="margin-left:'+white_key_position+'px;width:'+key_width+'px;height:'+key_height+'px"></div>');
		    	white_key_position = white_key_position + key_width;
		    	white_key_counter++;
		    }
		}
		
		// assign width for container
		var border_width = 2; // border width is the left and right border
		var total_width = (white_key_counter * key_width) + border_width;
		var total_height = key_height + border_width;
		$('#vpcf_container').width(total_width);
		$('#vpcf_container').height(total_height);
		
		// create controls
		$('#vpcf_controls').append('<div id="vpcf_root_controls"><ul><li id="vpcf_root_1">C<sup>&nbsp;</sup></li><li id="vpcf_root_2">C<sup>#</sup> / D<sup>b</sup></li><li id="vpcf_root_3">D<sup>&nbsp;</sup></li><li id="vpcf_root_4">D<sup>#</sup> / E<sup>b</sup></li><li id="vpcf_root_5">E<sup>&nbsp;</sup></li><li id="vpcf_root_6">F / E<sup>#</sup></li><li id="vpcf_root_7">F<sup>#</sup> / G<sup>b</sup></li><li id="vpcf_root_8">G<sup>&nbsp;</sup></li><li id="vpcf_root_9">G<sup>#</sup> / A<sup>b</sup></li><li id="vpcf_root_10">A<sup>&nbsp;</sup></li><li id="vpcf_root_11">A<sup>#</sup> / B<sup>b</sup></li><li id="vpcf_root_12">B / C<sup>b</sup> </li></ul></div><div class="vpcf_clear"></div>');
		 
		 $('#vpcf_controls').append('<div id="vpcf_chords"><h3 class="vpcf_title">Chords<span class="vpcf_error">Choose the Root Note Above</span><span class="vpcf_notes"></span></h3><div><ul><li><span>5,8</span>Major</li><li><span>4,8</span>Minor</li><li><span>8</span>5</li><li><span>5,8,11</span>Dominant 7th</li><li><span>5,8,12</span>Major 7th</li><li><span>4,8,11</span>Minor 7th</li><li><span>4,8,12</span>Minor Major 7th</li><li><span>6,8</span>Sus 4</li><li><span>3,8</span>Sus 2</li><li><span>5,8,10</span>6</li><li><span>4,8,10</span>Minor 6</li><li><span>5,8,11,15</span>9</li><li><span>4,8,11,15</span>Minor 9</li><li><span>5,8,12,15</span>Major 9</li><li><span>3,4,8,12,15</span>Minor Major 9</li><li><span>3,5,6,8,11</span>11</li><li><span>3,4,6,8,11</span>Minor 11</li><li><span>3,5,6,8,12</span>Major 11</li><li><span>3,4,6,8,12</span>Minor Major 11</li><li><span>3,5,8,10,11</span>13</li><li><span>3,4,8,10,11</span>Minor 13</li><li><span>3,5,8,10,12</span>Major 13</li><li><span>3,4,8,10,12</span>Minor Major 13</li><li><span>5,8,15</span>add 9</li><li><span>4,8,15</span>Minor add 9</li><li><span>5,8,10,15</span>6 add 9</li><li><span>4,8,10,15</span>Minor 6 add 9</li><li><span>5,6,8,11</span>Dominant 7th add 11</li><li><span>5,6,8,12</span>Major 7th add 11</li><li><span>4,6,8,11</span>Minor 7th add 11</li><li><span>4,8,12,6</span>Minor Major 7th add 11</li><li><span>5,8,11,10</span>Dominant 7th add 13</li><li><span>5,8,12,10</span>Major 7th add 13</li><li><span>4,8,11,10</span>Minor 7th add 13</li><li><span>4,8,10,12</span>Minor Major 7th add 13</li><li><span>5,7,11</span>7b5</li><li><span>5,9,11</span>7#5</li><li><span>2,5,8,11</span>7b9</li><li><span>4,5,8,11</span>7#9</li><li><span>2,5,9,11</span>7#5b9</li><li><span>4,7,11</span>m7b5</li><li><span>4,9,11</span>m7#5</li><li><span>2,4,8,11</span>m7b9</li><li><span>3,5,7,8,11</span>9#11</li><li><span>3,5,8,9,11</span>9b13</li><li><span>6,8,10</span>6sus4</li><li><span>6,8,11</span>7sus4</li><li><span>6,8,12</span>Major 7th Sus4</li><li><span>3,6,8,11</span>9sus4</li><li><span>3,6,8,12</span>Major 9 Sus4</li></ul></div></div>');

		 $('#vpcf_controls').append('<div id="vpcf_scales"><h3 class="vpcf_title">Scales<span class="vpcf_error">Choose the Root Note Above</span><span class="vpcf_notes"></span></h3><div><ul><li><span>2,2,1,2,2,2,1</span>Major</li><li><span>2,1,2,2,2,2,1</span>Minor</li><li><span>2,1,2,2,1,3,1</span>Harmonic Minor</li><li><span>2,1,2,2,2,2,1</span>Melodic Minor</li><li><span>2,3,2,2,3</span>Pentatonic Major</li><li><span>3,2,2,3,2</span>Pentatonic Minor</li><li><span>3,2,1,1,3</span>Pentatonic Blues</li><li><span>2,3,2,3</span>Pentatonic Neutral</li><li><span>2,2,1,2,2,2,1</span>Ionian</li><li><span>3,2,1,2,2,1,2,2</span>Aeolian</li><li><span>2,1,2,2,2,1,2</span>Dorian</li><li><span>2,2,1,2,2,1,2</span>Mixolydian</li><li><span>1,2,2,2,1,2,2</span>Phrygian</li><li><span>2,2,2,1,2,2,1</span>Lydian</li><li><span>1,2,2,1,2,2,2</span>Locrian</li><li><span>1,2,1,2,1,2,1</span>Dim half</li><li><span>2,1,2,1,2,1,2</span>Dim whole</li><li><span>2,2,2,2,2</span>Whole</li><li><span>3,1,3,1,3</span>Augmented</li><li><span>1,1,1,1,1,1,1,1,1,1,1,1</span>Chromatic</li><li><span>2,1,3,1,2,1,2</span>Roumanian Minor</li><li><span>1,3,1,2,1,2,2</span>Spanish Gypsy</li><li><span>3,2,1,1,3,2</span>Blues</li><li><span>2,2,3,2,3</span>Diatonic</li><li><span>1,3,1,2,1,3,1</span>Double Harmonic</li><li><span>1,2,1,1,1,2,2,2</span>Eight Tone Spanish</li><li><span>1,3,2,2,2,1,1</span>Enigmatic</li><li><span>2,2,2,2,1,1</span>Leading Whole Tone</li><li><span>2,2,2,2,1,2,1</span>Lydian Augmented</li><li><span>1,2,2,2,2,2,1</span>Neoploitan Major</li><li><span>1,2,2,2,1,2,2</span>Neopolitan Minor</li><li><span>1,2,3,41</span>Pelog</li><li><span>2,2,2,3,1,2</span>Prometheus</li><li><span>1,3,2,3,1,2</span>Prometheus Neopolitan</li><li><span>1,3,1,3,1,3</span>Six Tone Symmetrical</li><li><span>1,2,1,2,2,2,2</span>Super Locrian</li><li><span>2,2,2,1,1,2,2</span>Lydian Minor</li><li><span>2,1,3,1,1,2,2</span>Lydian Diminished</li><li><span>2,1,1,2,1,1,1,2,1</span>Nine Tone Scale</li><li><span>2,1,2,1,2,1,2,1</span>Auxiliary Diminished</li><li><span>2,2,2,2,2,2</span>Auxiliary Augmented</li><li><span>1,2,1,2,1,2,1,2</span>Auxiliary Diminished Blues</li><li><span>2,2,1,1,2,2,2</span>Major Locrian</li><li><span>2,2,2,1,2,1,2</span>Overtone</li><li><span>1,2,1,2,2,2,2</span>Diminished Whole Tone</li><li><span>2,1,2,2,1,2,2</span>Pure Minor</li><li><span>2,3,2,2,1,2</span>Dominant 7th</li></ul></div></div>');
		
		
		
		 // assign active class to root note when clicked and retrieve chord or scale if active
		 $('#vpcf_root_controls ul').on('click', 'li', function(){
		 		// removes any error
		 		$('.vpcf_error').hide();
		    	$('#vpcf_root_controls ul li').removeClass('active'); 
		    	$(this).addClass('active'); 
		    	root = $('#vpcf_root_controls ul li.active').attr('id');
		    	
		    	// if a chord has already been selected...
		    	if($('#vpcf_chords ul li').hasClass('active')){
			    	
			    	root = root.split('_')[2];
			    	var chord_nums = $('#vpcf_chords div ul li.active').children('span').text();
			    	chord_nums = chord_nums.split(",");
			    	
			    	var chord_complete = new Array();
			    	chord_complete[0] = parseInt(root);
			    	
			    	var i = 1;
			    	$.each(chord_nums, function(index, value) { 
				    	chord_complete[i] = parseInt(root) + (parseInt(value) - 1);
				    	i++;
					});
		
			    	displayChords(chord_complete)
		    	}
		    	
		    	if($('#vpcf_scales ul li').hasClass('active')){	
		    		root = root.split('_')[2];
			    	var scale_nums = $('#vpcf_scales div ul li.active').children('span').text();
			    	scale_nums = scale_nums.split(",");
			    	
			    	var scale_complete = new Array();
			    	scale_complete[0] = parseInt(root);
			    	
			    	var i = 1;
			    	$.each(scale_nums, function(index, value) { 
				    	scale_complete[i] = parseInt(value);
				    	i++;
					});
					displayScales(scale_complete);
		    	}
		 });
		 
		 // define colors when hovering over a scale or chord
		 $('#vpcf_chords div ul li').hover(
		 	  function () {
			 	  $(this).css('background-color' , chord_color);
	    	  }, 
	    	  function () {
		    	  $(this).not('.active').css('background-color' , '#FFFFFF');
		      }
		 );
		  
		 $('#vpcf_scales div ul li').hover(
			function () {
				$(this).css('background-color' , scale_color);
			}, 
			function () {
				$(this).not('.active').css('background-color' , '#FFFFFF');
			}
		);
		 
		 
		 // assign active class to chord when clicked, and visually show chord by calling displayChords()
		 $('#vpcf_chords div ul').on('click', 'li', function(){
		 		$('#vpcf_scales div ul li').removeClass('active'); 
		    	$('#vpcf_scales div ul li').css('background-color' , '#FFFFFF');
		    	$('#vpcf_scales h3.vpcf_title').css('text-shadow', 'none');
		    	
		    	$('#vpcf_chords div ul li').removeClass('active'); 
		    	$('#vpcf_chords div ul li').css('background-color' , '#FFFFFF');
		    	$('#vpcf_chords h3.vpcf_title').css('text-shadow' , '0px 0px 4px '+ chord_color);
		    	$('#vpcf_chords h3 .vpcf_notes').css('text-shadow', 'none');
		    	    	
		    	$(this).addClass('active');
		    	$(this).css('background-color' , chord_color);
		    	root = $('#vpcf_root_controls ul li.active').attr('id');
		    	
		    	if(root == '' || root === undefined){
			    	$('#vpcf_chords h3 span.vpcf_error').show().fadeOut(2000);
		    	}else{
			    	root = root.split('_')[2];
			    	var chord_nums = $(this).children('span').text();
			    	chord_nums = chord_nums.split(",");
			    	
			    	var chord_complete = new Array();
			    	chord_complete[0] = parseInt(root);
			    	
			    	var i = 1;
			    	$.each(chord_nums, function(index, value) { 
				    	chord_complete[i] = parseInt(root) + (parseInt(value) - 1);
				    	i++;
					});
					displayChords(chord_complete);
				}
		 });
		 
		 
		 $('#vpcf_scales div ul').on('click', 'li', function(){
		    	$('#vpcf_chords div ul li').removeClass('active'); 
		    	$('#vpcf_chords div ul li').css('background-color' , '#FFFFFF');
		    	$('#vpcf_chords h3.vpcf_title').css('text-shadow', 'none');
		    	
		    	$('#vpcf_scales div ul li').removeClass('active'); 
		    	$('#vpcf_scales div ul li').css('background-color' , '#FFFFFF');
		    	$('#vpcf_scales h3.vpcf_title').css('text-shadow' , '0px 0px 4px '+ scale_color);
		    	$('#vpcf_scales h3 .vpcf_notes').css('text-shadow', 'none');
		    	
		    	$(this).addClass('active');
		    	$(this).css('background-color' , scale_color);
		    	root = $('#vpcf_root_controls ul li.active').attr('id');
		    	
		    	if(root == '' || root === undefined){
			    	$('#vpcf_scales h3 span.vpcf_error').show().fadeOut(2500);
		    	}else{
			    	root = root.split('_')[2];
			    	var scale_nums = $(this).children('span').text();
			    	scale_nums = scale_nums.split(",");
			    	
			    	var scale_complete = new Array();
			    	scale_complete[0] = parseInt(root);
			    	
			    	var i = 1;
			    	$.each(scale_nums, function(index, value) { 
				    	scale_complete[i] = parseInt(value);
				    	i++;
					});
					displayScales(scale_complete);
				}
		 });
		
		// Get chords and assign to keys
		function displayScales(scale){ 
		    // reset key colors
		    $('.vpcf_black_key').css('background-color', '#363636');
		    $('.vpcf_white_key').css('background-color', '#FFFFFF');

		    var old_value = 0;
		    
		    // reset the displayed notes
		    $('.vpcf_notes').text('');
		    
		    // for each note in the chord highlight on the keyboard (have middle C be the starting point)
		    $.each(scale, function(index, value) { 
		    	key_step = parseInt(value) + (middle_c) + old_value;
				$('#vpcf_key_'+key_step).css('background-color', scale_color);
				old_value = parseInt(value) + old_value;
				$('#vpcf_scales h3 .vpcf_notes').append(key_notes[(old_value - 1)]+' ');
			});
		} // END function displayChords()
		
		
		// Get chords and assign to keys
		function displayChords(chord){ 
		    // reset key colors
		    $('.vpcf_black_key').css('background-color', '#363636');
		    $('.vpcf_white_key').css('background-color', '#FFFFFF');
		    
		    // reset the displayed notes
		    $('.vpcf_notes').text('');
		    
		    // for each note in the chord highlight on the keyboard (have middle C be the starting point)
		    $.each(chord, function(index, value) { 
		    	key_step = parseInt(value) + (middle_c);
				$('#vpcf_key_'+key_step).css('background-color', chord_color);
				$('#vpcf_chords h3 .vpcf_notes').append(key_notes[(parseInt(value) - 1)]+' ');
			});
		} // END function displayChords()
		
	 }); // END this.each
  };
})( jQuery );
