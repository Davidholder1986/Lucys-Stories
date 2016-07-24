// Server to  client and client to server
 var socket = io();

// Chat
var chatText = document.getElementById('chat-text');
var chatInput = document.getElementById('chat-input');
var chatForm = document.getElementById('chat-form');


socket.on('addToChat',function(data){
    chatText.innerHTML += '<div class="chat-inner-window-sub">' + data + '</div>';
});

chatForm.onsubmit = function(e){
    e.preventDefault();
	socket.emit('sendMsgToServer',chatInput.value);
    chatInput.value = '';      
}

// Update Chat Scroll


//  Website Jquery
function authorShow(author, jsauthor) {
	$(author).on('click', function(event) {
    	event.preventDefault();

    	$(jsauthor).addClass('is-visible');
    	$('.js-modal-overlay').addClass('is-visible');
  	});
	$('.js-modal-overlay').on('click', function(event) {
		$(jsauthor).removeClass('is-visible');
    	$('.js-modal-overlay').removeClass('is-visible');
	});
}


$(document).ready(function() {
	$('.js-like').on('click', function(event) {
		event.preventDefault();
		$(this).text('Liked')
		.closest('.story-item')
		.addClass('is-liked');
	});

	// Add link
	$('.js-add-link').on('click', function(event) {
		event.preventDefault();
		$('.js-form').toggleClass('is-visible');
	});

	// Chat

	$('.chat-wrapper').on('click', function(event) {
		event.preventDefault();
		$('.js-chat').toggleClass('chat-visible').children().click(function(e) {
  			return false;
		});
		$('.lucy-chat-button').toggleClass('big-font');
		$('.lucy-chat-button').toggleClass('small-font');
	});

	window.setInterval(function() {
  	var elem = document.getElementById('chat-text');
  	elem.scrollTop = elem.scrollHeight;
	}, 500);

	// Modal
	authorShow('.david', '.js-david');
	authorShow('.daniel', '.js-daniel');
	authorShow('.lucy', '.js-lucy');
});
