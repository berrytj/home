
//= require lodash

var ENTER_KEY = 13;
var TEXT_COLOR = '#333333';
var ORIG_COLOR = 'rgb(136, 136, 136)';
var MAX_CHARS = 140;
var BACKSPACE = 8;
var GREEN = '#1BE035';
var SLIDE = 150;
var MIN_WIDTH = 650;
var count = 0;

// Document ready.
$(function() {

	bindInputEvents();

	$('#submit').click(function(e) {

		var $input = $('#input');
		// Don't submit teaser text as tweet.
		if ($input.css('color') !== ORIG_COLOR) submitTweet(e, $input);

	});

});

// Bind functions to events triggered on #input.
var bindInputEvents = function() {

	$('#input').focus(function() {
		
		prepareForTyping($(this));
		
	}).blur(function() {

		showMessage($(this));

	}).keydown(function(e) {
		
		updateInput(e, $(this));

	}).bind('copy paste', function(e) {

    	e.preventDefault();
    	
    });

};

// Keep track of character count;
// submit tweet if enter is pressed.
var updateInput = function(e, $obj) {

	var key = e.which;
		
	if (isCharacter(key) || isDelete(key)) {

		updateChars(e, $obj, key);

	} else if (key == ENTER_KEY) {

		submitTweet(e, $obj);

	}

};

// Clear teaser text and darken text
// color when input is focused.
var prepareForTyping = function($obj) {

	// Don't take action if input contains user-generated text.
	if ($obj.css('color') === ORIG_COLOR) {

		$obj.val('').css({
			'color': TEXT_COLOR,
			'font-style': 'normal',
		});

	}

};

// If input is left empty, fill with gray teaser text.
var showMessage = function($obj) {

	if ($obj.val() === '') {

		$obj.val('What are you up to?').css({
			'color': ORIG_COLOR,
			'font-style': 'italic',
		});

	}

};

// Update character count and color based on user input.
var updateChars = function(e, $obj, key) {

	var count = $obj.val().length;

	$('#count').text(count).css('color', getCountColor(count));

	if (count >= MAX_CHARS && isCharacter(key)) e.preventDefault();

};

// Add tweet to list and reset input.
var submitTweet = function(e, $obj) {

	e.preventDefault();  // Don't return within textarea.

	var text = $obj.val();

	if (text) {

		addToList(text);  // Add to tweets.
		$obj.val('');     // Clear textarea for new input.
		$('#count').text('0').css('color', GREEN); // Reset counter.

	}

};

// Go from green to red as user nears MAX_CHARS.
var getCountColor = function(count) {

	var fraction = count / MAX_CHARS;
	
	if      (fraction < 0.3) return GREEN;
	else if (fraction < 0.5) return '#B1EB4D';
	else if (fraction < 0.7) return '#F7E700';
	else if (fraction < 0.8) return '#FFAE00';
	else if (fraction < 0.9) return '#FFA629';
	else 					 return '#FF4000';

};

// Prepend tweet to area below input.
var addToList = function(text) {

	var time = new Date().toLocaleString();
	var id = '_' + count;
	count++;

	var html = template({
		id:   id,
		text: text,
		time: time
	});

	$('#tweets').prepend(html);
	$('#' + id).slideDown(SLIDE);

};

// Return true if the keycode corresponds to a character/symbol/space.
var isCharacter = function(code) {

	return code == 32  || code == 59  ||  // spacebar  || firefox ;
		   code == 61  || code == 173 ||  // firefox = || firefox -
		   code >= 48  && code <= 57  ||
		   code >= 65  && code <= 90  ||
      	   code >= 97  && code <= 122 ||
      	   code >= 186 && code <= 191 ||
      	   code >= 219 && code <= 222;
};

// Return true if the keycode corresponds to a deletion.
var isDelete = function(code) {
	return code == 8 || code == 46;
};

// Cache the template for a tweet.
var template = _.template("<div id='<%- id %>' class='tweet' style='display:none;'>" +
							  "<div class='avatar'></div>" +
							  "<div class='text-area'>" +
								  "<div class='text'><%- text %></div>" +
								  "<div class='details'>" +
								  	  "<span class='time'><i><%- time %></i></span>" +
								  	  "<span class='star'></span>" +
									  "<span class='reply'></span>" +
								  "</div>" +
							  "</div>" +
						  "</div>");


