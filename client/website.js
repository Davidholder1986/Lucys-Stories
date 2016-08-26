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
	socket.emit('sendMsgToServer',{chattext: chatInput.value, username: getCookie('username')});
    chatInput.value = '';      
}

// Update Chat Scroll

var windowScroll = function() {
  	var elem = document.getElementById('chat-text');
  	elem.scrollTop = elem.scrollHeight;
	};

// Cookies

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
    console.log('set cookie' + document.cookie);
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
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
    	setCookie("username", data.username, 365);
        welcome.innerHTML = 'Welcome ' + getCookie('username') + ', you are now logged in';
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
	if (getCookie('username') === 'Guest') {
		alert('You need to be logged in to upload a story! Please sign up, its quick, easy and free!');
		$('.js-form').toggleClass('is-visible');
	} else if (title.value.length < 1) {
		alert('You need to type a title!');
	} else if (content.value.length < 1) {
		alert('You need to type out your story!');
	} else {
		socket.emit('storyUpload', {username: getCookie('username'), title: title.value, content: content.value, comments: [], commentnumber: 0, likes: []});
		title.value = '';
		content.value = '';
		$('.js-form').toggleClass('is-visible');
		socket.emit('refreshStories', {refresh: 'yes'});
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

// view comments

$(document).on("click",".commentlink",function(event) {
		event.preventDefault();
		var title = $(this).closest('ul').prev().html();
		socket.emit('showComments', {commentshow: title});
	});

// adds comments to webpage

socket.on('sentComments', function(data) {
	var comments = '';
	for (var i = 0; i < data.commentlist.length; i++) {
		var comment = "<p id='storyContent'>User: " + data.commentlist[i].username + "</p>\
					   <p id='storyContent'>Comment: " + data.commentlist[i].comment + "</p>"
		comments += comment;

	}

	var commentwrap = "<div class='story-modal js-story'>\
					<div class='modal-content'>\
					<h3 id='storyTitle'>" + data.title + "</h3>\
					<a class='story-back' href='#'>Back to Stories</a>\
					<br>\
					<a class='add-comment' href='#'>Add a comment</a>" +
						comments +
					"<ol class='story'>\
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

			$('#latest-story-list').html(commentwrap);
});

// adds a comment 

$(document).on("click",".add-comment",function(event) {
		event.preventDefault();
		console.log($('#latest-story-list').hasClass('commentforminvisible'))
		if ($('#latest-story-list').hasClass('commentforminvisible')) {
			var addcommentwrap = "<form class='addcommentform'>\
					<label class='form-label' for='form-link-input' />\
						<p>Add Comment</p>\
						<textarea class='form-input' type='text' id='form-link-comment'>Type your comment here</textarea>\
						<button class='form-text' style='width: 100px;' type='button' id='submitComment'>Submit</button>\
					</form>"
		$('.add-comment').after(addcommentwrap);
		$('#latest-story-list').removeClass('commentforminvisible');
	} else {
		$('form').remove();
		$('#latest-story-list').addClass('commentforminvisible');
		}
	});

// sends comment to server when clicked
	
$(document).on("click","#submitComment",function(event) {
	event.preventDefault();
	var storytitle = $('#storyTitle').html();
	var comment = document.getElementById('form-link-comment')
	var data = {comment: comment.value, username: getCookie('username'), title: storytitle};
	console.log(data.comment);
	socket.emit('addComment', data);
	$('form').remove();
	$('#latest-story-list').addClass('commentforminvisible');
});

// adds stories to website
socket.on('topSixStories', function(data) {
	// data = title, username,  commentnumber, likes

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
						"<a href='#' class='commentlink'>" + data[i].commentnumber + " comments</a>" +
					"</li>" +
					"<li class='story-meta-item'>" +
						"<a class='js-like' href='#'>like this story</a>" +
					"</li>" +
					"<li class='story-meta-item'>" +
						"<a class='js-like-counter' href='#'>" + data[i].likes.length + " likes</a>" +
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
	if (getCookie('username') === 'Guest') {
		alert('You need to be logged in to like a story!')
	} else {
		$(this).text('Liked')
		.closest('.story-item')
		.addClass('is-liked');
		var title = $(this).closest('ul').prev().html();
		socket.emit('userLiked', {username: getCookie('username'), title: title});
	}

});

socket.on('likedResult', function(data){
	if (data.success) {
		alert('Like added');
	} else {
		alert('You have already liked this story!');
	}
})


$(document).ready(function() {

	// if no cookie, sets it  to guest
	if (getCookie('username') === ''){
		setCookie("username", 'Guest', 365);
	} 

	// checks and sets the inner html for welcome

	if (getCookie('username') != 'Guest') {
		var welcome = document.getElementById('welcome'); 
		welcome.innerHTML = 'Welcome ' + getCookie('username') + ', you are now logged in';
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
		if (getCookie('username') === 'Guest') {
			$('.sign-in-wrapper').slideToggle('slow', function(){});
		}
		
	});

	$('#myaccount-button').on('click', function(event){
		event.preventDefault();
		if (getCookie('username') === 'Guest') {
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

// Where I am upto: 