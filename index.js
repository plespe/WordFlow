require('dotenv').load();
var app = require('./server/server.js');

var http = require('http').Server(app);

var port = process.env.PORT || 3000;

var io = require('socket.io')(http);


http.listen(port, function() {
  console.log("listening to port ", port);
});

module.exports = http;


/////////
// socket.io logic
/////////

// holds list of users for socket.io
/*
  {
    socketId: { username: JackSparrow, password: CoolHat }
  }
  socketId is generated by socket.io when a new client opens a socket
*/
var allUsers = {};

// establishes a new user's connection socket
io.on('connection', function(socket) {

  // when they disconnect
  socket.on('disconnect', function() {
    // send the client the user object so they know to delete it
    io.emit('userExit', allUsers[socket.id]);
  });

  // when a user sends an update event
  socket.on('postUserUpdate', function(data) {
    // add the new user to the server's allUsers collection
    allUsers[socket.id] = data;
    // send the new user data to every client
    io.emit('getUserUpdate', data);
  });

  // when the client asks for the lit of all users
  socket.on('getAllUsers', function() {
    // send the collection of all users to the client
    io.emit('allServerUsers', allUsers);
  });
});

