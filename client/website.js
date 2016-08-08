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
var signDivName = document.getElementById('signDiv-name');
var signDivEmail = document.getElementById('signDiv-email');
var signDivDob = document.getElementById('signDiv-dob');

signDivSignIn.onclick = function(){
	username = signDivUsername.value;
    socket.emit('signIn',{username:signDivUsername.value,password:signDivPassword.value});
    signDivUsername.value = '';
    signDivPassword.value = '';
}
signDivSignUp.onclick = function(){
	if ($('#extra-signup').hasClass('sign-up-extra-view')){
		$('#extra-signup').removeClass('sign-up-extra-view');
		$('.lucy-chat-button').removeClass('fixed');
	} else {
		socket.emit('signUp',{username:signDivUsername.value,password:signDivPassword.value, name: signDivName.value, email: signDivEmail.value, dob: signDivDob.value});
		$('#extra-signup').addClass('sign-up-extra-view');
		$('.lucy-chat-button').addClass('fixed');
	}
    
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
	if (username === 'Guest') {
		alert('You need to be logged in to upload a story! Please sign up, its quick, easy and free!');
	} else if (title.value.length < 1) {
		alert('You need to type a title!');
	} else if (content.value.length < 1) {
		alert('You need to type out your story!');
	} else {
		socket.emit('storyUpload', {username: username, title: title.value, content: content.value, comments: '', commentnumber: 0, likes: 0});
		title.value = '';
		content.value = '';
	}
}

// story request and exit

$(document).on("click",".story-back",function(event) {
		event.preventDefault();
		socket.emit('refreshStories', {refresh: 'yes'});
	});

$(document).on("click",".story-link",function(event) {
		event.preventDefault();
		var title = $(this).html();
		var data = {id: title};
		socket.emit('storyRequest', data);
	});

// Refresh Stories

$(document).on("click","#story-refresh",function(event) {
		event.preventDefault();
		socket.emit('refreshStories', {refresh: 'yes'});
	});


// adds stories to website
socket.on('topSixStories', function(data) {
	// data = tite, username,  commentnumber, likes

	var fullStoryList = '';

	for (var i = 0; i < data.length; i++) {
		var story = "<li class='story-item'>" +
				"<a class='story-link' href='#'>" + data[i].title + "</a>" +
				"<ul class='story-meta'>" +
					"<li class='story-meta-item'>" +
						"<em>Posted by:</em>" +
						"<a class='daniel' href='#'>" + data[i].username + "</a>" +
					"</li>" +
					"<li class='story-meta-item'>" +
						"<a href='#'>" + data[i].commentnumber + " comments</a>" +
					"</li>" +
					"<li class='story-meta-item'>" +
						"<a class='js-like' href='#'>like this story</a>" +
					"</li>" +
					"<li class='story-meta-item'>" +
						"<a class='js-like-counter' href='#'>" + data[i].likes + " likes</a>" +
					"</li>" +
				"</ul>" +
			"</li>"
		
		fullStoryList += story;	
	}
	$('#latest-story-list').html(fullStoryList);
	fullStoryList = '';

	});

//  Displays Stories

socket.on('storyRequested', function(story){
	var requestedstory = "<div class='story-modal js-story'>\
					<div class='modal-content'>\
					<h3 id='storyTitle'>" + story.title + "</h3>\
					<a class='story-back' href='#'>Back to Stories</a>\
					<p id='storyContent'>" + story.content + "</p>\
					<ol class='story'>\
						<li class='story-item'>\
							<a class='story-link' href='#'>My Stories</a>\
						</li>\
						<li class='story-item'>\
							<a class='story-link' href='#'>Leave a message</a>\
						</li>\
					</ol>\
				</div>\
			</div>\
			<div class='modal-overlay js-modal-overlay'>\
			</div>"
	$('#latest-story-list').html(requestedstory);
});


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

// the like function
$(document).on("click",".js-like",function(event) {
	event.preventDefault();
	$(this).text('Liked')
	.closest('.story-item')
	.addClass('is-liked');
});


$(document).ready(function() {


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

	// Story Visible

});
