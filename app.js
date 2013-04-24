
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , chatRooms = require('./routes/chatRooms')
  , users = require('./routes/users')
  , http = require('http')
  , mongo = require('mongoskin')
  , path = require('path');

var app = express();

var conn = mongo.db('mongodb://hollie:jersey@widmore.mongohq.com:10010/UniversityChat');

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.cookieParser("secret"));
  app.use(express.session({secret:"secret"}));
  app.use(express.bodyParser());

  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.locals._ = require("underscore");


app.get('/', routes.index);
app.get('/home', users.home);
app.get('/users', users.list);
app.get('/signup', users.signup);
app.get('/logout', users.logout);
app.post('/', routes.receiveForm);
app.post('/signup', users.signuppost);

app.get('/chatRooms',chatRooms.list);
app.post('/chatRooms',chatRooms.create);
app.get('/chatRooms/:id',chatRooms.edit);
app.post('/chatRooms/:id',chatRooms.update);
app.get('/chatRooms/:id/delete',chatRooms.del);
app.get('/chatRooms/:id/chat',chatRooms.chat);

app.get('/users',users.list);
app.post('/users',users.create);
app.get('/users/:id',users.edit);
app.post('/users/:id',users.update);
app.get('/users/:id/delete',users.del);

var server = http.createServer(app)

server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

var io = require('socket.io').listen(server);
 
var usernames = {}
 
io.sockets.on('connection', function (socket) {
 
    // when the client emits 'sendchat', this listens and executes
    socket.on('sendchat', function (data) {
      // we tell the client to execute 'updatechat' with 2 parameters
		io.sockets.emit('updatechat', usernames[socket.username], {message:data,state:"normal"});
	});
 
	// when the client emits 'adduser', this listens and executes
	socket.on('adduser', function(userId){
        
        conn.collection("users").findOne({_id : conn.ObjectID.createFromHexString(userId) },function(err,user) {
            if (user) {
                // we store the username in the socket session for this client
            	socket.username = userId;
        		// add the client's username to the global list
        		usernames[userId] = user.Email;
        		// echo to client they've connected
        		socket.emit('updatechat', 'SERVER', {message:'you have connected',state:"warning"});
        		// echo globally (all clients) that a person has connected
        		socket.broadcast.emit('updatechat', 'SERVER', { message: usernames[userId] + ' has connected',state:"warning"});
        		// update the list of users in chat, client-side
        		io.sockets.emit('updateusers', usernames);    
            } 
        });
        
		
	});
 
	// when the user disconnects.. perform this
	socket.on('disconnect', function(){
		// remove the username from global usernames list
		delete usernames[socket.username];
		// update list of users in chat, client-side
		io.sockets.emit('updateusers', usernames);
		// echo globally that this client has left
		socket.broadcast.emit('updatechat', 'SERVER', {message:usernames[socket.username] + ' has disconnected',state:"warning"});
	});
});
