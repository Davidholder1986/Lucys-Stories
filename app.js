var express = require('express');
var app = express();
var serv = require('http').Server(app);
 
app.get('/',function(req, res) {
    res.sendFile(__dirname + '/client/index.html');
});
app.use('/client',express.static(__dirname + '/client'));
app.use(express.static('client'));
 
serv.listen(process.env.PORT || 2000);
console.log("Server started.");

var SOCKET_LIST = {};

// socketid: socket.id, username: username.value
var activeAccounts = [];

var USERS = {
	//username: password
	'david': 'Iceland18',
	'd': 'd'
}

var advancedUSERDATA = [];

//{username: username, title: title.value, content: content.value, comments: '', commentnumber: 0, likes: 0}
var STORIES = [{username: 'username', title: 'Story Six', content: 'content.value', comments: [{username: 'david', comment: 'this is great!'}, {username: 'daniel', comment: 'I am gay!'}], commentnumber: 2, likes: ['test']},
               {username: 'username', title: 'Story Five', content: 'content.value', comments: [], commentnumber: 0, likes: ['test']},
               {username: 'username', title: 'Story Four', content: 'content.value', comments: [], commentnumber: 0, likes: ['test']},
               {username: 'username', title: 'Story Three', content: 'content.value', comments: [], commentnumber: 0, likes: ['test']},
               {username: 'username', title: 'Story Two', content: 'content.value', comments: [], commentnumber: 0, likes: ['test']},
               {username: 'username', title: 'Story One', content: 'content.value', comments: [], commentnumber: 0, likes: ['test']}];

var isValidPassword = function(data) {
	return USERS[data.username] === data.password;
}

var isUsernameTaken = function(data) {
	return USERS[data.username];
}

var addUser = function(data) {
	USERS[data.username] = data.password;
}

var addActiveAccount = function(socketid, username) {
	var pack = {};
	pack.socketid = socketid;
	pack.username = username;
	activeAccounts.push(pack);
}

var updateStories = function() {
    var sliceArray = STORIES.slice(-6);
    var reverseSliceArray = sliceArray.reverse();
	return reverseSliceArray;
};

var requestedStory = function(story) {
    for (var i = 0; i<STORIES.length; i++) {
        if (STORIES[i].title === story.id) {
            return STORIES[i];
        }
    }
};

var io = require('socket.io')(serv,{});
io.sockets.on('connection', function(socket){
    socket.id = Math.random();
    SOCKET_LIST[socket.id] = socket;
    console.log('User ' + socket.id + ' logged in');
    socket.emit('topSixStories', updateStories());

    socket.on('signIn', function(data) {
    	if (isValidPassword(data)) {
    		addActiveAccount(socket.id, data.username);
    		socket.emit('signInResponse', {success:true, username:data.username});
    	} else {
    		socket.emit('signInResponse', {success:false});
    	}
    	
    });

    socket.on('signUp', function(data){
    	if(isUsernameTaken(data)){
    		socket.emit('signUpResponse', {success:false});
    	} else {
    		addUser(data);
            advancedUSERDATA.push(data);
    		socket.emit('signUpResponse', {success:true});
    	}
    });
    
    
    socket.on('sendMsgToServer',function(data){
        var  playerName = '';
        if (data.username === 'Guest') {
        	var guestUserName = ("" + socket.id).slice(2,7);
        	playerName = "Guest" + guestUserName;
        } else {
        	playerName = data.username;
        }
        
        socket.broadcast.emit('addToChat',playerName + ': ' + data.chattext);
        
    });

    socket.on('storyUpload',function(data){
        STORIES.push(data);
        console.log('story pushed');
        console.log(data);
    });

    socket.on('storyRequest', function(data) {
        socket.emit('storyRequested', requestedStory(data));
    });

    // Sends comments on request

    socket.on('showComments', function(data) {
        var storytitle = data.commentshow
        for (var i = 0; i <  STORIES.length; i++) {
            if (STORIES[i].title === storytitle) {
                var data = {commentlist: STORIES[i].comments, title: storytitle}
                socket.emit('sentComments', data);
            }
        }
    });

    // adds the comment to the stories object for the correct title

    socket.on('addComment', function(data){
        //comment, username, title

        // finds the title in the stories object and adds the comment and adds +1 to comment number
        for(var i = 0; i < STORIES.length; i++) {
            if (STORIES[i].title === data.title) {
                STORIES[i].comments.push({username: data.username, comment: data.comment});
                STORIES[i].commentnumber ++;
            }
        }
    });

    //  Updates Like  of a story to user (has failsafe to check has not already been liked)

    socket.on('userLiked', function(data){
        for(var i = 0; i < STORIES.length; i++) {
            if (STORIES[i].title === data.title) {
                for (var j = 0; j < STORIES[i].likes.length; j++){
                    if (STORIES[i].likes[j] === data.username) {
                        socket.emit('likedResult', {success: false});
                        // stops the function
                        return '';
                    } 
                }
                // runs if username is not found
                STORIES[i].likes.push(data.username);
                console.log(STORIES[i].likes);
                socket.emit('likedResult', {success: true});                
            }
        }


    });

    // Updates website with six latest stories at predefined duration
    socket.on('refreshStories', function() {
        socket.emit('topSixStories', updateStories());
    });

    socket.on('disconnect',function(){
        console.log('User ' + socket.id + ' disconnected');
        delete SOCKET_LIST[socket.id];
    }); 

});
