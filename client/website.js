// Variables  saving who you are
var username = 'Guest';

// Server to  client and client to server
var socket = io();

// Chat
var chatText = document.getElementById('chat-text');
var chatInput = document.getElementById('chat-input');
var chatForm = document.getElementById('chat-form');


socket.on('addToChat',function(data){
    chatText.innerHTML += '<div class="chat-inner-window-sub">' + data + '</div>';
    windowScroll();
});

chatForm.onsubmit = function(e){
    e.preventDefault();
	socket.emit('sendMsgToServer',{chattext: chatInput.value, username: username});
    chatInput.value = '';      
}

// Update Chat Scroll

var windowScroll = function() {
  	var elem = document.getElementById('chat-text');
  	elem.scrollTop = elem.scrollHeight;
	};

// Sign in Server Update

var signDiv = document.getElementById('signDiv');
var signDivUsername = document.getElementById('signDiv-username');
var signDivSignIn = document.getElementById('signDiv-signIn');
var signDivSignUp = document.getElementById('signDiv-signUp');
var signDivPassword = document.getElementById('signDiv-password');

signDivSignIn.onclick = function(){
	username = signDivUsername.value;
    socket.emit('signIn',{username:signDivUsername.value,password:signDivPassword.value});
    signDivUsername.value = '';
    signDivPassword.value = '';
}
signDivSignUp.onclick = function(){
    socket.emit('signUp',{username:signDivUsername.value,password:signDivPassword.value});
}
socket.on('signInResponse',function(data){
	var welcome = document.getElementById('welcome'); 
    if(data.success){
        welcome.innerHTML = 'Welcome ' + username + ', you are now logged in';
    } else
        alert("Sign in unsuccessful.");
});
socket.on('signUpResponse',function(data){
    if(data.success){
        alert("Sign up successful.");
    } else
        alert("Sign up unsuccessful.");
});

// Uploading a Story

var title = document.getElementById('form-story-title');
var content = document.getElementById('form-link-content');
var submitStory = document.getElementById('submitStory');

submitStory.onclick = function() {
	if (username != 'Guest') {
		socket.emit('storyUpload', {username: username, title: title.value, content: content.value, comments: '', likes: 0});
		title.value = '';
		content.value = '';
	} else {
		alert('You need to be logged in to upload a story! Please sign up, its quick, easy and free!');
	}
}

// Website Jquery
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

	// Sign In Animation

	$('.signIn-wrapper').on('click', function(event) {
		event.preventDefault();
		$('.js-SignIn').toggleClass('chat-visible').children().click(function(e) {
  			return false;
		});
		$('.chat-wrapper').toggleClass('hidden');
		$('.lucy-chat-button').toggleClass('big-font');
		$('.lucy-chat-button').toggleClass('small-font');
	});

	// Chat

	$('.chat-wrapper').on('click', function(event) {
		event.preventDefault();
		$('.js-chat').toggleClass('chat-visible').children().click(function(e) {
  			return false;
		});
		$('.signIn-wrapper').toggleClass('hidden');
		$('.lucy-chat-button').toggleClass('big-font');
		$('.lucy-chat-button').toggleClass('small-font');
	});

	

	// Modal
	authorShow('.david', '.js-david');
	authorShow('.daniel', '.js-daniel');
	authorShow('.lucy', '.js-lucy');
});
