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
	'david': 'Iceland18'
}

var STORIES = []

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

var io = require('socket.io')(serv,{});
io.sockets.on('connection', function(socket){
    socket.id = Math.random();
    SOCKET_LIST[socket.id] = socket;

    socket.on('signIn', function(data) {
    	if (isValidPassword(data)) {
    		addActiveAccount(socket.id, data.username);
    		socket.emit('signInResponse', {success:true});
    	} else {
    		socket.emit('signInResponse', {success:false});
    	}
    	
    });

    socket.on('signUp', function(data){
    	if(isUsernameTaken(data)){
    		socket.emit('signUpResponse', {success:false});
    	} else {
    		addUser(data);
    		socket.emit('signUpResponse', {success:true});
    	}
    });
    
    socket.on('disconnect',function(){
        delete SOCKET_LIST[socket.id];
    });
    socket.on('sendMsgToServer',function(data){
        var  playerName = '';
        if (data.username === 'Guest') {
        	var guestUserName = ("" + socket.id).slice(2,7);
        	playerName = "Guest" + guestUserName;
        } else {
        	playerName = data.username;
        }
        for(var i in SOCKET_LIST){
            SOCKET_LIST[i].emit('addToChat',playerName + ': ' + data.chattext);
        }
    });

    socket.on('storyUpload',function(data){
        STORIES.push(data);
    });
   
});