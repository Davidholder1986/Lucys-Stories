var signDivUsername = 'david'
var signDivPassword = 'Iceland18'

function setCookie(uname, uvalue, pname, pvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = uname + "=" + uvalue + "; " + pname + "=" + pvalue + "; "+ expires;
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length,c.length);
        }
    }
    return "";
} 

function checkCookie() {
    var username=getCookie("username");
    var password=getCookie("password");
    if (username!="undefined") {
        alert("Welcome again " + username);
        alert("your password is " + password);
    } else {
        username = prompt("Please enter your name:", "");
        password = prompt("Please enter your password:", "");
        if (username != "" && username != null) {
            setCookie("username", username, "password", password, 365);
        }
    }
} 

checkCookie();

//document.cookie = "username=" + signDivUsername + "; password=" + signDivPassword;

/*
// Variables saving who you are
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
	socket.emit('sendMsgToServer',{chattext: chatInput.value, username: username});  // cookie username needed
    chatInput.value = '';      
}

// Update Chat Scroll

var windowScroll = function() {
  	var elem = document.getElementById('chat-text');
  	elem.scrollTop = elem.scrollHeight;
	};

// Cookies

function setCookie(uname, uvalue, pname, pvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = uname + "=" + uvalue + "; " + pname + "=" + pvalue + "; "+ expires;
}

function getCookie(uname) {
    var name = uname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length,c.length);
        }
    }
    return "";
}

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
	setCookie("username", signDivUsername.value, "password", signDivPassword.value, 365);
    socket.emit('signIn',{username:signDivUsername.value,password:signDivPassword.value});
    signDivUsername.value = '';
    signDivPassword.value = '';
}

signDivSignUp.onclick = function(){
	if ($('#extra-signup').hasClass('sign-up-extra-view')){
		$('#extra-signup').removeClass('sign-up-extra-view');
		//$('#extra-signup').slideToggle();

	} else {

		if (signDivUsername.value === '' || signDivPassword.value === '' || signDivName.value === '' || signDivEmail.value === '' || signDivDob.value === '') {
			alert('You have missed a box, please check all the boxes have been completed');
		} else {
			socket.emit('signUp',{username:signDivUsername.value,password:signDivPassword.value, name: signDivName.value, email: signDivEmail.value, dob: signDivDob.value});
			$('#extra-signup').addClass('sign-up-extra-view');
		}
		
	}
    
} 

socket.on('signInResponse',function(data){
	var welcome = document.getElementById('welcome'); 
    if(data.success){
        welcome.innerHTML = 'Welcome ' + username + ', you are now logged in';
        $('.sign-in-wrapper').slideToggle('slow', function(){});
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

	if (username != 'Guest') {
		welcome.innerHTML = 'Welcome ' + username + ', you are now logged in';
	}

	// Initialises the sign in and chat wrappers to down
	$('.chat-wrapper').slideUp(1);
	$('.sign-in-wrapper').slideUp(1);
	$('.apps').removeClass('hidden');

	// Add link
	$('.js-add-link').on('click', function(event) {
		event.preventDefault();
		$('.js-form').toggleClass('is-visible');
	});

	// Chat

	$('#lucy-chat-button').on('click', function(event) {
		event.preventDefault();
		$('.chat-wrapper').slideToggle('slow', function(){});
	});

	// Signin / up

	$('.account-log-in').on('click', function(event){
		event.preventDefault();
		if (username === 'Guest') {
			$('.sign-in-wrapper').slideToggle('slow', function(){});
		}
		
	});

	$('#myaccount-button').on('click', function(event){
		event.preventDefault();
		if (username === 'Guest') {
			$('.sign-in-wrapper').slideToggle('slow', function(){});
		} else {
			window.location.href=('account.html');
		}
	});

	// Modal
	authorShow('.david', '.js-david');
	authorShow('.daniel', '.js-daniel');
	authorShow('.lucy', '.js-lucy');

	// navbar CSS

	$('.navbar-nav [data-toggle="tooltip"]').tooltip();

    $('.navbar-twitch-toggle').on('click', function(event) {
        event.preventDefault();
        $('.header').toggleClass('header-toggle');
        $('body').toggleClass('on');
        $('.navbar-twitch').toggleClass('open');
        $('.second-nav-icon').toggleClass('nav-shunt');

    });
    

});

*/